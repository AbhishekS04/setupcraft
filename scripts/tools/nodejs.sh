#!/usr/bin/env bash
set -euo pipefail

# Called by runner.js as: bash nodejs.sh <manager>
# manager = asdf | nvm | fnm | none
MANAGER="${1:-none}"

# ── helpers ──────────────────────────────────────────────────────────────────
command_exists() { command -v "$1" &>/dev/null; }

install_via_pkg_manager() {
  echo "📦 Installing Node.js LTS via system package manager..."
  if command_exists dnf; then
    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
    sudo dnf install -y nodejs
  elif command_exists apt; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
    sudo apt install -y nodejs
  elif command_exists pacman; then
    sudo pacman -S --noconfirm nodejs npm
  elif command_exists zypper; then
    sudo zypper install -y nodejs npm
  elif command_exists brew; then
    brew install node
  else
    echo "❌ No supported package manager found — install Node.js manually." >&2
    exit 1
  fi
}

# ── asdf ─────────────────────────────────────────────────────────────────────
install_asdf() {
  if command_exists asdf; then
    echo "✅ asdf already installed: $(asdf --version)"
  else
    echo "📦 Installing asdf..."
    git clone https://github.com/asdf-vm/asdf.git "${HOME}/.asdf" --branch v0.14.0

    # Append to shell profiles
    for rc in "${HOME}/.bashrc" "${HOME}/.zshrc"; do
      if [[ -f "$rc" ]] && ! grep -q 'asdf.sh' "$rc"; then
        cat >> "$rc" <<'EOF'

# === asdf (managed by setupcraft) ===
export ASDF_DIR="$HOME/.asdf"
. "$ASDF_DIR/asdf.sh"
EOF
      fi
    done

    export ASDF_DIR="$HOME/.asdf"
    # shellcheck source=/dev/null
    . "$HOME/.asdf/asdf.sh"
    echo "✅ asdf installed"
  fi

  # Add & install nodejs plugin
  asdf plugin list | grep -q nodejs || asdf plugin add nodejs
  asdf install nodejs lts
  asdf set --home nodejs lts
  echo "✅ Node.js $(node --version) installed via asdf"
}

# ── nvm ───────────────────────────────────────────────────────────────────────
install_nvm() {
  if [[ -d "${HOME}/.nvm" ]]; then
    echo "✅ nvm already present at ~/.nvm"
  else
    echo "📦 Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  fi

  # Source nvm and install LTS
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install --lts
  nvm use --lts
  echo "✅ Node.js $(node --version) installed via nvm"
}

# ── fnm ───────────────────────────────────────────────────────────────────────
install_fnm() {
  if command_exists fnm; then
    echo "✅ fnm already installed: $(fnm --version)"
  else
    echo "📦 Installing fnm..."
    curl -fsSL https://fnm.vercel.app/install | bash
    # Add to PATH for this session
    export PATH="$HOME/.local/share/fnm:$PATH"
    eval "$(fnm env)"
  fi

  fnm install --lts
  fnm use lts-latest
  echo "✅ Node.js $(node --version) installed via fnm"
}

# ── main ──────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Node.js Setup  [manager: ${MANAGER}]"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

case "$MANAGER" in
  asdf)  install_asdf ;;
  nvm)   install_nvm  ;;
  fnm)   install_fnm  ;;
  none)
    if command_exists node; then
      echo "✅ Node.js already installed: $(node --version)"
    else
      install_via_pkg_manager
    fi
    ;;
  *)
    echo "⚠ Unknown manager '${MANAGER}' — falling back to package manager"
    install_via_pkg_manager
    ;;
esac