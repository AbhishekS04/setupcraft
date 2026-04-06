#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  openSUSE Platform Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📦 Refreshing repositories..."
sudo zypper refresh

echo "📦 Installing base dependencies..."
sudo zypper install -y \
  curl \
  wget \
  git \
  gcc \
  gcc-c++ \
  make \
  which \
  unzip \
  zip \
  ca-certificates

echo "✅ openSUSE base dependencies installed"
