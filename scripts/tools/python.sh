#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Python 3 Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command_exists() { command -v "$1" &>/dev/null; }

# ── Already installed? ────────────────────────────────────────────────────────
if command_exists python3; then
  VERSION=$(python3 --version 2>&1)
  echo "✅ Python already installed: ${VERSION}"
  # Still ensure pip and venv are present
  if ! command_exists pip3; then
    echo "📦 Installing pip..."
    if command_exists dnf; then
      sudo dnf install -y python3-pip
    elif command_exists apt; then
      sudo apt install -y python3-pip
    elif command_exists pacman; then
      sudo pacman -S --noconfirm python-pip
    elif command_exists zypper; then
      sudo zypper install -y python3-pip
    elif command_exists brew; then
      # pip ships with Homebrew python3
      true
    fi
  fi
  python3 -m venv --help &>/dev/null || {
    echo "📦 Installing python3-venv..."
    if command_exists apt; then
      sudo apt install -y python3-venv
    fi
  }
  echo "✅ pip: $(pip3 --version 2>&1)"
  exit 0
fi

# ── Install Python 3 ──────────────────────────────────────────────────────────
echo "📦 Installing Python 3..."

if command_exists dnf; then
  sudo dnf install -y python3 python3-pip python3-venv
elif command_exists apt; then
  sudo apt install -y python3 python3-pip python3-venv
elif command_exists pacman; then
  sudo pacman -S --noconfirm python python-pip
elif command_exists zypper; then
  sudo zypper install -y python3 python3-pip
elif command_exists brew; then
  brew install python
else
  echo "❌ No supported package manager found — install Python manually." >&2
  exit 1
fi

echo "✅ Python installed: $(python3 --version)"
echo "✅ pip: $(pip3 --version 2>&1)"
