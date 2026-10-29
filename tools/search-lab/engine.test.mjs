import test from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, tokenize } from '../../assets/search-lab/engine.mjs';
const records = [
  { id: '/gcc/', title: 'GNU Compiler', authors: ['Jason Andrews'], description: 'Install GCC on Linux', type: 'install-guide', category: '' },
  { id: '/llama/', title: 'Deploy llama.cpp', authors: ['Pareena Verma', 'Jason Andrews'], description: 'Deploy a chatbot on AWS Graviton', type: 'learning-path', category: 'servers-and-cloud-computing' },
  { id: '/other/', title: 'Python chatbot', summary: 'Example mentions llama.cpp', type: 'learning-path', category: 'cross-platform' }
];
const search = createEngine(records);
test('technical punctuation survives tokenization', () => {
  assert.deepEqual(tokenize('llama.cpp SVE2 C++'), ['llama.cpp', 'sve2', 'c++']);
});
test('prerequisites and FAQ questions and answers can independently find content', () => {
  const expandedSearch = createEngine([
    { id: '/path/', title: 'Application tutorial', type: 'learning-path', prerequisites: 'SSH access with PMU counters', faq: 'Which binary path should I use? Use performix-analysis/dot_scalar.' },
    { id: '/guide/', title: 'Setup guide', type: 'install-guide', prerequisites: 'Arduino IDE' },
    { id: '/empty/', title: 'Another tutorial', type: 'learning-path' }
  ]);
  for (const query of ['PMU', 'binary path', 'dot_scalar']) {
    assert.equal(expandedSearch({ query }).results[0].id, '/path/');
  }
  assert.equal(expandedSearch({ query: 'Arduino' }).results[0].id, '/guide/');
  assert.equal(expandedSearch({ query: 'Arduino', type: 'learning-path' }).total, 0);
});
test('exact title and query coverage win', () => {
  assert.equal(search({ query: 'How do I deploy llama.cpp on Graviton?' }).results[0].id, '/llama/');
});
test('filters apply before limiting and total is independent of limit', () => {
  assert.equal(search({ query: 'chatbot', limit: 1 }).total, 2);
  assert.equal(search({ query: 'chatbot', category: 'cross-platform' }).results[0].id, '/other/');
  assert.equal(search({ query: 'GCC', type: 'learning-path' }).total, 0);
});
test('reject invalid tool arguments', () => {
  for (const input of [null, [], {}, { query: ' ' }, { query: 'gcc', limit: 101 }, { query: 'gcc', limit: 1.5 }, { query: 'gcc', category: 'fake' }, { query: 'gcc', type: 'fake' }]) assert.throws(() => search(input));
});
test('empty or irrelevant queries produce no matches', () => {
  assert.equal(search({ query: 'the and' }).total, 0);
  assert.equal(search({ query: 'unfindable' }).total, 0);
});

test('author names are searchable alongside topic terms and returned in results', () => {
  assert.equal(search({ query: 'Jason Andrews' }).total, 2);
  assert.equal(search({ query: 'pArEeNa VeRmA' }).results[0].id, '/llama/');
  assert.equal(search({ query: 'Jason GCC' }).results[0].id, '/gcc/');
  assert.deepEqual(search({ query: 'Pareena' }).results[0].authors, ['Pareena Verma', 'Jason Andrews']);
});

test('newest sorting applies to all matches before limiting, with relevance as an alternative', () => {
  const datedSearch = createEngine([
    { id: '/old/', title: 'Docker Docker Docker', lastUpdated: '2025-01-01', type: 'install-guide' },
    { id: '/new/', title: 'Containers', description: 'Docker', lastUpdated: '2026-10-29', type: 'install-guide' },
    { id: '/missing/', title: 'Docker', type: 'learning-path' }
  ]);
  assert.deepEqual(datedSearch({ query: 'docker' }).results.map(r => r.id), ['/new/', '/old/', '/missing/']);
  assert.equal(datedSearch({ query: 'docker', limit: 1 }).results[0].id, '/new/');
  assert.equal(datedSearch({ query: 'docker', sort: 'relevance' }).results[0].id, '/old/');
  assert.throws(() => datedSearch({ query: 'docker', sort: 'invalid' }));
});

test('relevance puts matching install guides first, then ranks each type by score', () => {
  const prioritize = createEngine([
    { id: '/path/', title: 'Docker', type: 'learning-path', lastUpdated: '2026-10-29' },
    { id: '/weak-guide/', title: 'Containers', summary: 'Docker', type: 'install-guide', lastUpdated: '2025-01-01' },
    { id: '/strong-guide/', title: 'Docker', type: 'install-guide', lastUpdated: '2025-01-01' },
    { id: '/weak-path/', title: 'Containers', summary: 'Docker', type: 'learning-path', lastUpdated: '2026-10-28' },
    { id: '/unmatched/', title: 'GCC', type: 'install-guide' }
  ]);
  assert.deepEqual(prioritize({ query: 'docker', sort: 'relevance' }).results.map(r => r.id),
    ['/strong-guide/', '/weak-guide/', '/path/', '/weak-path/']);
  assert.equal(prioritize({ query: 'docker', sort: 'relevance', limit: 1 }).results[0].id, '/strong-guide/');
  assert.equal(prioritize({ query: 'docker', sort: 'updated' }).results[0].id, '/path/');
  assert.deepEqual(prioritize({ query: 'docker', sort: 'relevance', type: 'learning-path' }).results.map(r => r.id), ['/path/', '/weak-path/']);
});
