#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing CLI tools..."

if command -v dnf &>/dev/null; then
  sudo dnf install -y fzf ripgrep fd-find bat jq

  # GitHub CLI
  sudo dnf config-manager addrepo \
    --from-repofile=https://cli.github.com/packages/rpm/gh-cli.repo
  sudo dnf install -y gh

elif command -v apt &>/dev/null; then
  sudo apt install -y fzf ripgrep fd-find bat jq

  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
  sudo apt install -y gh
fi

echo "✅ CLI tools installed: fzf, ripgrep, fd, bat, jq, gh"