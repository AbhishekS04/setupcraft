#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Ubuntu / Debian Platform Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📦 Updating package cache..."
sudo apt update -y

echo "📦 Installing base dependencies..."
sudo apt install -y \
  curl \
  wget \
  git \
  ca-certificates \
  gnupg \
  lsb-release \
  build-essential \
  software-properties-common \
  apt-transport-https

echo "✅ Ubuntu/Debian base dependencies installed"
