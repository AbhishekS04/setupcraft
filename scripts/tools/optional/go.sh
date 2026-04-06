#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Go Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command_exists() { command -v "$1" &>/dev/null; }
GO_VERSION="1.22.3"

if command_exists go; then
  echo "✅ Go already installed: $(go version)"
  exit 0
fi

echo "📦 Installing Go ${GO_VERSION}..."

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  GO_ARCH="amd64" ;;
  aarch64) GO_ARCH="arm64" ;;
  armv6l)  GO_ARCH="armv6l" ;;
  *)       echo "❌ Unsupported architecture: $ARCH" >&2; exit 1 ;;
esac

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
TARBALL="go${GO_VERSION}.${OS}-${GO_ARCH}.tar.gz"
URL="https://go.dev/dl/${TARBALL}"

echo "  Downloading ${URL}..."
curl -fsSL "$URL" -o "/tmp/${TARBALL}"

echo "  Extracting to /usr/local/go..."
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "/tmp/${TARBALL}"
rm -f "/tmp/${TARBALL}"

# Patch shell profiles
for rc in "${HOME}/.bashrc" "${HOME}/.zshrc"; do
  if [[ -f "$rc" ]] && ! grep -q '/usr/local/go/bin' "$rc"; then
    cat >> "$rc" <<'EOF'

# === Go (managed by setupcraft) ===
export PATH="$PATH:/usr/local/go/bin:$HOME/go/bin"
EOF
  fi
done

export PATH="$PATH:/usr/local/go/bin"
echo "✅ Go installed: $(go version)"
