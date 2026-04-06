#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Rust Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command_exists() { command -v "$1" &>/dev/null; }

if command_exists rustc; then
  echo "✅ Rust already installed: $(rustc --version)"
  echo "✅ Cargo: $(cargo --version)"
  exit 0
fi

echo "📦 Installing Rust via rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path

# Source cargo env for this session
# shellcheck source=/dev/null
. "${HOME}/.cargo/env"

# Append to shell profiles if not already there
for rc in "${HOME}/.bashrc" "${HOME}/.zshrc"; do
  if [[ -f "$rc" ]] && ! grep -q 'cargo/env' "$rc"; then
    cat >> "$rc" <<'EOF'

# === Rust (managed by setupcraft) ===
. "$HOME/.cargo/env"
EOF
  fi
done

echo "✅ Rust installed: $(rustc --version)"
echo "✅ Cargo: $(cargo --version)"
