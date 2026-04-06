#!/usr/bin/env bash
set -euo pipefail

echo "📦 Updating Fedora package cache..."
sudo dnf update -y --refresh

echo "📦 Installing base dependencies..."
sudo dnf install -y curl wget git util-linux-user