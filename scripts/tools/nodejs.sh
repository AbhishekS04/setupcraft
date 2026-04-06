#!/bin/bash

if command -v node &> /dev/null; then
    echo "✅ Node already installed: $(node -v)"
else
    echo "📦 Installing Node.js..."

    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
    sudo dnf install -y nodejs
fi