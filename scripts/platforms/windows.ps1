# windows.ps1 — Setupcraft Windows platform setup
# Run via: powershell.exe -ExecutionPolicy Bypass -File windows.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Windows Platform Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# ── Require Windows 10/11 ─────────────────────────────────────────────────────
$osVersion = [System.Environment]::OSVersion.Version
if ($osVersion.Major -lt 10) {
  Write-Host "❌ Windows 10 or 11 is required." -ForegroundColor Red
  exit 1
}

# ── Check winget ──────────────────────────────────────────────────────────────
$hasWinget = $null -ne (Get-Command winget -ErrorAction SilentlyContinue)
if ($hasWinget) {
  Write-Host "✅ winget detected: $(winget --version)" -ForegroundColor Green
} else {
  Write-Host "⚠  winget not found. Install App Installer from the Microsoft Store." -ForegroundColor Yellow
  Write-Host "   https://aka.ms/getwinget"
  # Continue anyway — chocolatey may be available
}

# ── Check / install Chocolatey as fallback ────────────────────────────────────
$hasChoco = $null -ne (Get-Command choco -ErrorAction SilentlyContinue)
if (-not $hasChoco -and -not $hasWinget) {
  Write-Host "📦 Installing Chocolatey (winget not available)..." -ForegroundColor Yellow
  Set-ExecutionPolicy Bypass -Scope Process -Force
  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
  Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
  $hasChoco = $true
  Write-Host "✅ Chocolatey installed" -ForegroundColor Green
} elseif ($hasChoco) {
  Write-Host "✅ Chocolatey already present: $(choco --version)" -ForegroundColor Green
}

# ── Developer Mode (optional — needed for symlinks) ───────────────────────────
$devMode = Get-ItemProperty `
  -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" `
  -Name "AllowDevelopmentWithoutDevLicense" `
  -ErrorAction SilentlyContinue

if ($devMode -and $devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
  Write-Host "✅ Developer Mode is enabled" -ForegroundColor Green
} else {
  Write-Host "⚠  Developer Mode is not enabled. Some tools (symlinks, WSL) may not work." -ForegroundColor Yellow
  Write-Host "   Enable it: Settings → Privacy & Security → For Developers → Developer Mode"
}

Write-Host "✅ Windows platform check complete" -ForegroundColor Green
