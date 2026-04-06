#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  macOS Platform Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command_exists() { command -v "$1" &>/dev/null; }

# ── Xcode Command Line Tools ──────────────────────────────────────────────────
if ! xcode-select -p &>/dev/null; then
  echo "📦 Installing Xcode Command Line Tools..."
  xcode-select --install
  # Wait for installation to complete
  until xcode-select -p &>/dev/null; do sleep 5; done
  echo "✅ Xcode Command Line Tools installed"
else
  echo "✅ Xcode Command Line Tools already present"
fi

# ── Homebrew ──────────────────────────────────────────────────────────────────
if command_exists brew; then
  echo "✅ Homebrew already installed: $(brew --version | head -1)"
  echo "📦 Updating Homebrew..."
  brew update
else
  echo "📦 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # Add to PATH for Apple Silicon
  if [[ "$(uname -m)" == "arm64" ]]; then
    for rc in "${HOME}/.bashrc" "${HOME}/.zshrc" "${HOME}/.zprofile"; do
      if [[ -f "$rc" ]] && ! grep -q 'homebrew' "$rc"; then
        cat >> "$rc" <<'EOF'

# === Homebrew (Apple Silicon) ===
eval "$(/opt/homebrew/bin/brew shellenv)"
EOF
      fi
    done
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi

  echo "✅ Homebrew installed: $(brew --version | head -1)"
fi
