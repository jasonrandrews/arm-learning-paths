// Dependency-free BM25 baseline. Exact identifiers stay searchable alongside words.
const stop = new Set('a an and are at be can do for from how i in is it me my of on or the to using what with'.split(' '));
export function tokenize(text) {
  return String(text).toLowerCase().match(/[\p{L}\p{N}]+(?:[.+#-][\p{L}\p{N}+#]+)*/gu) || [];
}
export function createEngine(records) {
  const fields = [['title', 5], ['description', 3], ['authors', 3], ['metadata', 2], ['prerequisites', 2], ['summary', 1], ['faq', 1]];
  const docs = records.map(record => ({ record, fields: fields.map(([key, boost]) => {
    const value = record[key] || '';
    const tokens = tokenize(Array.isArray(value) ? value.join(' ') : value);
    const counts = new Map();
    for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
    return { counts, length: tokens.length, boost };
  }) }));
  const averages = fields.map((_, i) => docs.reduce((n, d) => n + d.fields[i].length, 0) / (docs.length || 1) || 1);
  const df = new Map();
  for (const doc of docs) {
    const terms = new Set(doc.fields.flatMap(f => [...f.counts.keys()]));
    for (const term of terms) df.set(term, (df.get(term) || 0) + 1);
  }
  return function search(input = {}) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Arguments must be an object.');
    if (Object.keys(input).some(key => !['query', 'type', 'category', 'limit', 'sort'].includes(key))) throw Error('Unknown search argument.');
    const { query, type = '', category = '', limit = 10, sort = 'updated' } = input;
    if (typeof query !== 'string' || !query.trim() || query.length > 300) throw Error('Query must contain 1–300 characters.');
    if (!['', 'learning-path', 'install-guide'].includes(type)) throw Error('Unknown content type.');
    if (typeof category !== 'string' || (category && !records.some(r => r.category === category))) throw Error('Unknown category.');
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw Error('Limit must be an integer from 1 to 100.');
    if (!['updated', 'relevance'].includes(sort)) throw Error('Unknown sort order.');
    const terms = [...new Set(tokenize(query).filter(t => !stop.has(t)))];
    if (!terms.length) return { total: 0, results: [] };
    const ranked = [];
    for (const doc of docs) {
      if ((type && doc.record.type !== type) || (category && doc.record.category !== category)) continue;
      let score = 0, matched = 0;
      for (const term of terms) {
        let termScore = 0;
        const idf = Math.log(1 + (docs.length - (df.get(term) || 0) + 0.5) / ((df.get(term) || 0) + 0.5));
        doc.fields.forEach((field, i) => {
          const tf = field.counts.get(term) || 0;
          termScore += field.boost * idf * tf * 2.2 / (tf + 1.2 * (0.25 + 0.75 * field.length / averages[i]));
        });
        if (termScore) matched++;
        score += termScore;
      }
      // Reward coverage so long natural-language queries can still find partial matches.
      if (matched) ranked.push({ ...doc.record, score: score * (matched / terms.length) ** 2 });
    }
    ranked.sort((a, b) => {
      // ISO date strings sort chronologically; missing dates follow dated results.
      const dateOrder = sort === 'updated' ? (b.lastUpdated || '').localeCompare(a.lastUpdated || '') : 0;
      const typeOrder = sort === 'relevance'
        ? Number(b.type === 'install-guide') - Number(a.type === 'install-guide')
        : 0;
      return dateOrder || typeOrder || b.score - a.score || a.id.localeCompare(b.id);
    });
    return { total: ranked.length, results: ranked.slice(0, limit) };
  };
}
