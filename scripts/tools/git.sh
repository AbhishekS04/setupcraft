#!/usr/bin/env bash
set -euo pipefail

if command -v git &>/dev/null; then
  echo "✅ Git already installed: $(git --version)"
  exit 0
fi

echo "📦 Installing Git..."
if command -v dnf &>/dev/null; then
  sudo dnf install -y git
elif command -v apt &>/dev/null; then
  sudo apt install -y git
fi

# Basic git config if not set
if [ -z "$(git config --global user.name 2>/dev/null)" ]; then
  read -rp "Git username: " git_name
  read -rp "Git email: " git_email
  git config --global user.name "$git_name"
  git config --global user.email "$git_email"
fi

echo "✅ Git configured: $(git --version)"