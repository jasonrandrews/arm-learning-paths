# Search lab

An isolated `/search/` Hugo page using the shared site layout, navigation, masthead, footer, typography, and light/dark theme. Coveo and existing search entry points are unchanged. A page-head block in the shared base layout loads scoped styles, and the browser_search front-matter flag excludes legacy list-filter scripts on this page. The page excludes itself from the sitemap and requests `noindex`; this is discoverability control, not access control. Nothing has been deployed.

## Try it

From the repository root:

```sh
hugo server --bind 127.0.0.1 --port 1313
```

Open http://localhost:1313/search/ and try `GCC`, `Docker`, `llama.cpp Graviton`, and `SVE2`. Author names such as `Jason Andrews` are searchable too, including combinations such as `Jason GCC`; author names appear on each result. Filter by install guide when you want setup instructions. Results default to Last updated (newest first), with a Relevance option. Relevance lists matching install guides before Learning Paths, with each group ordered by keyword relevance. Dates match the content metadata table: the latest page date across a Learning Path, or the guide entry page date for install guides. Missing dates appear last; equal dates use relevance. Sorting applies before pagination. Queries, filters, and sorting are bookmarkable. Timings distinguish worker execution from the response time observed by the page; index loading is reported separately. Queries are not sent to a search service, although they are stored in the page URL and browser history.

After a search completes, its execution and response times appear below the result count, along with the document count, index size, and initial index preparation time. These statistics stay hidden until a search completes, including searches with no matches.

The **Search with an agent** section below the search results shows native registration status; you can also open `/search/#agent-tools` directly. Expand **Try the agent search tool**, edit the JSON, and run it. This invokes the exact callback registered with WebMCP. Native WebMCP requires a supporting browser/configuration; the tool tester is a fallback, not proof of an agent connection. Feature detection checks `document.modelContext` first and the older `navigator.modelContext` second. No polyfill or origin-trial token is bundled.

For an actual native tool invocation from Codex through the Chrome DevTools CLI, follow the [CLI WebMCP demo](WEBMCP_DEMO.md). This bridge was verified against the local page without the Inspector extension or a Gemini API key.

## Implementation

- `layouts/search-lab/list.html`: Hugo generates the JSON index and publishes assets on every build. The index, scripts, stylesheet, and worker dependency use content fingerprints so refreshed pages load matching versions rather than stale cached assets. Learning Path landing pages and install-guide entry points only; excludes drafts, future and expired content, including ancestors, even in draft previews. URLs come from Hugo. Multi-part guide children are represented by their entry point.
- `assets/search-lab/engine.mjs`: weighted BM25 keyword baseline. Title > description/authors > taxonomy/objectives/extra search terms/prerequisites > summary/FAQ questions and answers. Prerequisites accept lists or a single string; FAQ text comes from `generated_summary_faq.faqs`, when present. Markdown links in these added fields contribute their visible text, not their URLs. Generation metadata is excluded. Full tutorial steps and guide body text are not indexed. Coverage boosts multi-term matches; punctuation in identifiers such as `llama.cpp` survives tokenization. Scores are ranking values, not probabilities. No stemming, typo tolerance, synonym expansion, or embeddings yet.
- `assets/search-lab/worker.js`: fetches and prepares the index once per page load and searches off the main thread.
- `assets/search-lab/app.js`: accessible form, filters, results, timing, WebMCP adapter, and tool tester. Tool execution returns results without navigating or changing the human's current query.

## Verify

```sh
node --test tools/search-lab/engine.test.mjs
hugo --destination /private/tmp/arm-search-lab-build
node tools/search-lab/check-index.mjs /private/tmp/arm-search-lab-build
```

For a draft-leak check, also build with `--buildDrafts` into a second directory and compare the record IDs. Review the demo at mobile width, keyboard-only, a slow network, no WebMCP, and a supported WebMCP browser before deploying. Desktop dark-theme rendering, example searches, native WebMCP registration, and native tool invocation through the Chrome DevTools CLI have been verified in Chrome. Mobile and light-theme visual checks remain outstanding.
