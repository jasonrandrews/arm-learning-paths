---
title: Install and configure Nous Research Hermes Agent
description: Install Nous Research Hermes Agent on Arm64 Linux, point it at your local llama-server endpoint, and increase API timeouts for CPU inference.
weight: 6

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Install Hermes Agent

With `llama-server` running in your first terminal, install Nous Research Hermes Agent in your second terminal:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

When the interactive **Hermes Agent Setup Wizard** prompts you to sign in or select a cloud provider, press **Ctrl+C** to exit the wizard. You'll configure the local `llama-server` provider directly with `hermes config set` in the next step.

The output is similar to:

```output
┌─────────────────────────────────────────────────────────┐
│             ☤ Hermes Agent Installer                    │
├─────────────────────────────────────────────────────────┤
│  An open source AI agent by Nous Research.              │
└─────────────────────────────────────────────────────────┘

✓ prerequisites ok (git, curl)
→ Updating /home/user/.hermes/hermes-agent to the latest stable release (v0.23.3)
✓ uv ready (uv 0.13.5 (aarch64-unknown-linux-gnu))
...
✓ app products and hermes command ready

┌─────────────────────────────────────────────────────────┐
│             ☤ Hermes Agent Setup Wizard                │
├─────────────────────────────────────────────────────────┤
│  Let's configure your Hermes Agent installation.       │
│  Press Ctrl+C at any time to exit.                     │
└─────────────────────────────────────────────────────────┘


  Setup cancelled. Remaining sections were not changed.
✓ Hermes Agent install complete. Run: hermes
```

If the installer updates your shell `PATH`, reload your shell profile or open a new terminal, then verify the `hermes` CLI is available:

```bash
hermes --version
```

The output is similar to:

```output
Hermes Agent v0.23.3 (2026.11.17)
```

## Point Hermes Agent to local llama-server

Configure Hermes Agent to use a custom OpenAI-compatible provider pointing to your local `llama-server` instance at `http://127.0.0.1:8080/v1`:

```bash
hermes config set model.provider local
hermes config set model.base_url http://127.0.0.1:8080/v1
hermes config set model.default ./models/gemma-4-E4B-it-Q4_0.gguf
```

Verify your active configuration:

```bash
hermes config show
```

The output is similar to:

```output
  model:
    default: ./models/gemma-4-E4B-it-Q4_0.gguf
    provider: local
    base_url: http://127.0.0.1:8080/v1
```

## Increase the API timeout for local CPU inference

Autonomous tool-calling loops can send large prompts (thousands of tokens of file contents and tool outputs) to `llama-server`. On CPU-only inference, a single turn can take longer than default cloud-API HTTP timeouts.

Set `HERMES_API_TIMEOUT=1800` (30 minutes) in `~/.hermes/.env` so multi-step local generations don't time out prematurely:

```bash
mkdir -p ~/.hermes
grep -q '^HERMES_API_TIMEOUT=' ~/.hermes/.env 2>/dev/null \
  && sed -i 's/^HERMES_API_TIMEOUT=.*/HERMES_API_TIMEOUT=1800/' ~/.hermes/.env \
  || echo 'HERMES_API_TIMEOUT=1800' >> ~/.hermes/.env
```

Confirm the setting in `~/.hermes/.env`:

```bash
cat ~/.hermes/.env
```

## Start an interactive session

After configuring `model.provider`, `model.base_url`, and `model.default`, you can launch Hermes Agent interactively with no arguments in any workspace directory:

```bash
hermes
```

Hermes opens its interactive terminal UI connected directly to your local `llama-server` at `http://127.0.0.1:8080/v1` (or use `hermes chat --cli` for the classic line-based REPL). Type `/exit` or press **Ctrl+C** when you're finished.

## What you've accomplished and what's next

You've installed Nous Research Hermes Agent, connected it to your local `llama-server` endpoint, and configured `HERMES_API_TIMEOUT` for long-running local CPU inference.

Next, you'll test autonomous multi-step tool calling on a local code-fixing task with Gemma 4 E4B.
