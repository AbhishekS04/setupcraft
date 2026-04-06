#!/usr/bin/env bash
set -euo pipefail

if command -v docker &>/dev/null; then
  echo "✅ Docker already installed: $(docker --version)"
  exit 0
fi

echo "📦 Installing Docker..."

if command -v dnf &>/dev/null; then
  sudo dnf install -y dnf-plugins-core
  # dnf5 uses 'addrepo' not '--add-repo'
  sudo dnf config-manager addrepo \
    --from-repofile=https://download.docker.com/linux/fedora/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
elif command -v apt &>/dev/null; then
  sudo apt update
  sudo apt install -y ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
  sudo apt install -y docker-ce docker-ce-cli containerd.io
fi

sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
echo "✅ Docker installed — log out and back in for group access"