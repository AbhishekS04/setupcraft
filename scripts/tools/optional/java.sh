#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Java (OpenJDK) Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command_exists() { command -v "$1" &>/dev/null; }

if command_exists java; then
  echo "✅ Java already installed: $(java --version 2>&1 | head -1)"
  exit 0
fi

echo "📦 Installing OpenJDK 21 (LTS)..."

if command_exists dnf; then
  sudo dnf install -y java-21-openjdk java-21-openjdk-devel
elif command_exists apt; then
  sudo apt install -y openjdk-21-jdk
elif command_exists pacman; then
  sudo pacman -S --noconfirm jdk21-openjdk
elif command_exists zypper; then
  sudo zypper install -y java-21-openjdk java-21-openjdk-devel
elif command_exists brew; then
  brew install openjdk@21
  # Homebrew requires symlinking
  sudo ln -sfn "$(brew --prefix openjdk@21)/libexec/openjdk.jdk" \
    /Library/Java/JavaVirtualMachines/openjdk-21.jdk
else
  echo "❌ No supported package manager found — install Java manually." >&2
  exit 1
fi

echo "✅ Java installed: $(java --version 2>&1 | head -1)"
