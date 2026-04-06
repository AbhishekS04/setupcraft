# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- macOS platform support (Intel + Apple Silicon, Homebrew)
- Arch Linux platform support (pacman)
- openSUSE platform support (zypper)
- Windows platform support (winget / Chocolatey)
- Python 3 tool installer with pip + venv
- Optional Rust installer via rustup
- Optional Go installer via official tarball
- Optional Java (OpenJDK 21 LTS) installer
- Shell configuration block appended to ~/.bashrc and ~/.zshrc
- `--version` flag now reads from package.json and prints correctly
- `config/default-tools.json` for non-interactive mode defaults
- `config/min-versions.json` for post-install version validation
- `config/shell-block.sh` with aliases and helpful shell functions
- Node.js installer now supports asdf-vm, nvm, fnm, and system package managers
- Async internet connectivity check using native Node.js TCP socket
- Disk space check via `df` instead of RAM check

### Fixed
- Preflight internet check was blocking the Node process — replaced with non-blocking TCP socket
- `nodejs.sh` was hardcoded to Fedora/dnf — now supports all distros and version managers
- `configureShell` prompt selection was collected but never acted on — now appends shell block
- `--version` flag was parsed but silently ignored

---

## [1.0.0] - 2026-04-06

### Added
- Initial release
- Interactive CLI via `@clack/prompts`
- OS detection: Fedora, Ubuntu/Debian, Pop!_OS, Linux Mint
- Tool installers: Git, Docker, Node.js, CLI tools (fzf, ripgrep, fd, bat, jq, gh)
- Non-interactive mode (`--non-interactive`)
- Dry-run mode (`--dry-run`)
- Post-install verification with version reporting
- Log file written to home directory
- Preflight checks: root detection, internet, disk space, sudo
