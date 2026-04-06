# Contributing to setupcraft

Thank you for taking the time to contribute! This document explains how to get the project running locally, and how to add new platforms or tools.

---

## Development Setup

```bash
git clone https://github.com/AbhishekS04/setupcraft.git
cd setupcraft
npm install
```

### Running locally

```bash
# Run the CLI
npm run dev

# Pass flags to the CLI
npm run dev -- --non-interactive --dry-run
npm run dev -- --help

# Lint
npm run lint

# Run tests
npm test

# Watch tests
npm run test:watch
```

---

## Project Structure

```
setupcraft/
├── bin/cli.js            # npx entry point
├── src/                  # Node.js orchestration layer
│   ├── index.js          # main() — orchestrates all stages
│   ├── detect-os.js      # OS/distro detection
│   ├── args.js           # CLI flag parsing
│   ├── preflight.js      # Root check, internet, disk space
│   ├── prompts.js        # @clack/prompts interactive UI
│   ├── runner.js         # Script spawner + shell config
│   ├── logger.js         # Chalk-colored logger + log file
│   ├── verify.js         # Post-install version checks
│   └── summary.js        # Final report
├── scripts/
│   ├── platforms/        # One script per OS/distro
│   └── tools/            # One script per tool (all idempotent)
│       └── optional/
├── config/
│   ├── default-tools.json
│   ├── min-versions.json
│   └── shell-block.sh
└── tests/
```

---

## Adding a New Platform

1. Create `scripts/platforms/<distro>.sh` (or `.ps1` for Windows)
2. Add detection logic to `src/detect-os.js` — add a new `if` branch that returns `{ os: 'linux', distro: '<distro>', arch }` 
3. Add to the CI matrix in `.github/workflows/ci.yml`
4. Document the platform in `README.md`

**Platform script conventions:**
- Always start with `#!/usr/bin/env bash` and `set -euo pipefail`
- Only install base dependencies (curl, wget, build tools) — tool-specific installs go in `scripts/tools/`
- Print clear emoji-prefixed status messages
- Be idempotent — safe to run multiple times

---

## Adding a New Tool

1. Create `scripts/tools/<toolname>.sh` (and a `.ps1` variant for Windows)
2. Add an entry to `src/runner.js` `toolMap`:
   ```js
   installMyTool: 'my-tool',
   ```
3. Add to the prompts in `src/prompts.js` `coreTools` multiselect
4. Add to non-interactive defaults in `src/prompts.js`
5. Add to `config/default-tools.json`
6. Add version check in `src/verify.js`
7. Write a test in `tests/`

**Tool script conventions:**
- Check if already installed at the top — exit 0 if so (idempotent)
- Support all major package managers (dnf, apt, pacman, zypper, brew)
- Use `command_exists()` helper pattern
- Print a clear `✅` on success

---

## Adding an Optional Tool

Same as above, but:
- Place the script in `scripts/tools/optional/<toolname>.sh`
- Add to the `optionalTools` multiselect in `src/prompts.js`
- No need to add to `config/default-tools.json` (optional tools default to unselected)

---

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for openSUSE platform
fix: handle docker group on arch linux
docs: update README with Windows instructions
chore: bump @clack/prompts to 0.9.1
```

---

## Pull Request Checklist

- [ ] `npm test` passes
- [ ] `npm run lint` passes with no errors
- [ ] New scripts are idempotent (safe to run multiple times)
- [ ] `--dry-run` mode still works end-to-end
- [ ] README is updated if you added a platform or tool

---

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

Please include:
- Your OS and distro version
- The exact command you ran
- The full log file (`~/.setupcraft-<timestamp>.log`)
- What you expected vs what happened
