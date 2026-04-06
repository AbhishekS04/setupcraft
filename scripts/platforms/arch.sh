#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Arch Linux Platform Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📦 Updating package database..."
sudo pacman -Syu --noconfirm

echo "📦 Installing base dependencies..."
sudo pacman -S --noconfirm --needed \
  curl \
  wget \
  git \
  base-devel \
  which \
  unzip \
  zip

echo "✅ Arch Linux base dependencies installed"
