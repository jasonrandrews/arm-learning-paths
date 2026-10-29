# Codex CLI WebMCP demo

Verified on October 29, 2026 with Chrome 156.0.8078.74 and `chrome-devtools-mcp` 1.12.0.

The connection is:

```text
Codex → shell → Chrome DevTools CLI → Chrome → search_arm_content → browser search worker
```

Chrome DevTools provides the bridge to the page's native WebMCP registration. The page's tool tester and the WebMCP Inspector extension are not involved. This demonstration uses the current Codex session to run CLI commands; it does not launch a second Codex agent or require a Gemini API key.

## Repeat the demo

Start the site in one terminal from the repository root:

```sh
hugo server --bind 127.0.0.1 --port 1313
```

In another terminal, define a shortcut for the pinned Chrome DevTools CLI. The first invocation may download the package through npm. Chrome must already be installed.

```sh
devtools() {
  npx --yes --package=chrome-devtools-mcp@1.12.0 chrome-devtools "$@"
}

devtools start --isolated --headless \
  --categoryExperimentalWebmcp \
  --chromeArg=--enable-features=WebMCP \
  --no-usage-statistics --no-performance-crux

devtools new_page http://localhost:1313/search/
```

Use the page ID printed by `new_page` in the next commands. The verified session used ID `2`; a new session may use another ID.

```sh
devtools list_webmcp_tools 2

devtools execute_webmcp_tool 2 search_arm_content \
  --input '{"query":"Jason Andrews","type":"learning-path","sort":"updated","limit":5}'
```

Discovery should list `search_arm_content` and its input schema. Execution should report `Completed` and return five results. For a live Codex demonstration, ask:

> Use the Chrome DevTools CLI to open my local search page, discover its native WebMCP tools, and call search_arm_content for the five most recently updated Learning Paths by Jason Andrews. Show their titles and last-updated dates.

Finish the isolated browser session with:

```sh
devtools stop
```

The browser feature flag is supplied to this isolated Chrome instance. This does not change the flags in your everyday Chrome profile or modify Codex configuration. If discovery returns no tools, check the page URL, wait for page initialization, and verify that Chrome was launched with both experimental options above.

## Observed result

The actual test used the existing preview at `http://localhost:8765/search/` and the cached package's CLI binary. Discovery returned the registered tool, and native execution reported `Completed`, 58 total matches, five returned results, and approximately **0.6 ms** of worker search time. That timing excludes CLI/browser communication and index loading.

| Last updated | Learning Path |
| --- | --- |
| 2026-10-27 | Get started with Windows Subsystem for Linux on Arm |
| 2026-10-27 | Deploy Arm Instances on AWS using Terraform |
| 2026-10-27 | Deploy Arm virtual machines on Google Cloud Platform using Terraform |
| 2026-10-22 | Run headless browser tests with Puppeteer on Arm Linux |
| 2026-10-20 | Run agent-generated Python in GKE Agent Sandbox on Google Axion |

These are the most recently **updated** matching Learning Paths, not necessarily the most recently published. The query searches indexed author names and text; it is not an exact author-only filter.

The result demonstrates a local agent calling a page's structured tool through a browser bridge. It does not establish support in Chrome's Ask Gemini sidebar or other agents without such a bridge.

References: [Chrome WebMCP automation and agents](https://developer.chrome.com/docs/devtools/application/webmcp#automation-and-agents), [Chrome DevTools CLI documentation](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/cli.md).
