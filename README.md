# setupcraft

> Auto development environment setup CLI — from zero to coding in minutes.

[![npm version](https://img.shields.io/npm/v/setupcraft.svg)](https://www.npmjs.com/package/setupcraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI](https://github.com/AbhishekS04/setupcraft/actions/workflows/ci.yml/badge.svg)](https://github.com/AbhishekS04/setupcraft/actions/workflows/ci.yml)

## What is this?

`setupcraft` is an interactive CLI that sets up a full development environment on a fresh machine. Run one command, answer a few prompts, and have Node.js, Python, Docker, Git, and your favorite tools installed and configured in under 15 minutes.

```bash
npx setupcraft
```

No global install needed. It downloads and runs automatically via npx.

---

## Supported Platforms

| Platform | Status |
|---|---|
| Fedora (dnf) | ✅ Full support |
| Ubuntu / Debian / Pop!_OS / Mint (apt) | ✅ Full support |
| Arch Linux (pacman) | ✅ Full support |
| openSUSE (zypper) | ✅ Full support |
| macOS Intel + Apple Silicon | ✅ Full support |
| Windows 10/11 (winget / choco) | 🚧 In progress |

---

## What gets installed?

### Core Tools (interactive selection)
- **Node.js LTS** — via `asdf-vm`, `nvm`, `fnm`, or system package manager
- **Python 3** — with pip and venv
- **Docker Engine** — with automatic docker group setup
- **Git** — with interactive username/email configuration
- **CLI Tools** — `fzf`, `ripgrep`, `fd`, `bat`, `jq`, `gh`

### Optional Language Runtimes
- **Rust** — via rustup
- **Go** — latest stable, direct tarball
- **Java** — OpenJDK 21 LTS

### Shell Configuration (optional)
Appends a managed block to `~/.bashrc` and `~/.zshrc` with:
- Useful aliases (`ll`, `gs`, `gc`, `glog`, ...)
- Quality-of-life functions (`mkcd`, `gclone`)
- Better history settings

---

## Usage

### Interactive (recommended)
```bash
npx setupcraft
```

### Non-interactive / CI mode
```bash
# Accept all defaults silently
npx setupcraft --non-interactive

# Custom selection via env vars
INSTALL_NODEJS=true INSTALL_DOCKER=false npx setupcraft --non-interactive

# Dry run — see what would happen without doing anything
npx setupcraft --dry-run
```

### All Options
```
--help              Show help
--version           Show version
--non-interactive   Run without prompts (uses defaults)
--quiet             Errors only
--debug             Show all commands as they run
--dry-run           Show what would be done, without executing
```

---

## Local Development

```bash
# Clone and install
git clone https://github.com/AbhishekS04/setupcraft.git
cd setupcraft
npm install

# Run the CLI locally
npm run dev

# Pass flags
npm run dev -- --non-interactive --dry-run

# Run tests
npm test

# Lint
npm run lint
```

---

## Output Example

```
▶  Detected: linux / fedora (x64)

▶  Running preflight checks...
✅ Internet connection detected
✅ Disk space: 120GB free on /
✅ Preflight checks passed

  ┌  🚀 Welcome to Setupcraft — Dev Environment Setup
  │
  ◆  Which Node.js version manager would you prefer?
  │  ● asdf-vm  (recommended — manages multiple languages)
  │  ○ nvm
  │  ○ fnm
  │  ○ None
  └

▶  Starting installation...
✅ Git installed: git version 2.43.0
✅ Docker installed: Docker version 26.1.1
✅ Python installed: Python 3.12.3 (pip 24.0)
✅ Node.js v20.12.0 installed via asdf

=== Setupcraft Complete ===

✅ Node.js: v20.12.0
✅ Python: Python 3.12.3
✅ Git: git version 2.43.0
✅ Docker: Docker version 26.1.1

📝 Log saved to: /home/user/.setupcraft-1234567890.log

🚀 Next steps:
   1. Run: source ~/.bashrc
   2. Create a project: mkdir ~/projects/my-app && cd $_
   3. Run: git init && npm init
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add new platforms, tools, and run the test suite.

## License

[MIT](./LICENSE) © [AbhishekS04](https://github.com/AbhishekS04)
