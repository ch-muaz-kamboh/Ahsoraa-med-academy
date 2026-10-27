# PowerShell helper to install or download k6 on Windows
param(
    [switch]$ForceDownload
)

$ErrorActionPreference = "Stop"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Grafana k6 Installer / Setup for Windows" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check if k6 is already available in PATH
$installedK6 = Get-Command k6 -ErrorAction SilentlyContinue
if ($installedK6 -and -not $ForceDownload) {
    Write-Host "[OK] k6 is already installed in system PATH:" -ForegroundColor Green
    & k6 version
    exit 0
}

# 2. Check if local bin\k6.exe exists
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$binDir = Join-Path $scriptDir "bin"
$localK6 = Join-Path $binDir "k6.exe"

if ((Test-Path $localK6) -and -not $ForceDownload) {
    Write-Host "[OK] Found local k6 binary at: $localK6" -ForegroundColor Green
    & $localK6 version
    exit 0
}

# 3. Create bin directory if needed
if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir -Force | Out-Null
}

# 4. Attempt winget installation first (if winget is available)
$wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
if ($wingetCmd -and -not $ForceDownload) {
    Write-Host "[INFO] Attempting installation via winget..." -ForegroundColor Yellow
    try {
        & winget install grafana.k6 --accept-source-agreements --accept-package-agreements --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] k6 installed successfully via winget!" -ForegroundColor Green
            Write-Host "[NOTE] You may need to restart your terminal for PATH updates, or run from $binDir" -ForegroundColor Yellow
            exit 0
        }
    } catch {
        Write-Host "[WARN] winget install did not complete, falling back to direct binary download..." -ForegroundColor Yellow
    }
}

# 5. Direct download of official k6 Windows release from GitHub
Write-Host "[INFO] Downloading standalone k6 binary from official GitHub releases..." -ForegroundColor Cyan

$k6Version = "v0.56.0"
$zipUrl = "https://github.com/grafana/k6/releases/download/$k6Version/k6-$k6Version-windows-amd64.zip"
$zipPath = Join-Path $binDir "k6.zip"
$extractTemp = Join-Path $binDir "extract_temp"

Write-Host "Downloading: $zipUrl" -ForegroundColor Gray
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing

Write-Host "[INFO] Extracting archive..." -ForegroundColor Cyan
if (Test-Path $extractTemp) { Remove-Item -Path $extractTemp -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $extractTemp -Force

# Locate k6.exe inside the extracted folder
$extractedExe = Get-ChildItem -Path $extractTemp -Filter "k6.exe" -Recurse | Select-Object -First 1
if ($extractedExe) {
    Move-Item -Path $extractedExe.FullName -Destination $localK6 -Force
    Write-Host "[OK] Standalone k6.exe installed to: $localK6" -ForegroundColor Green
} else {
    Write-Error "Could not find k6.exe in the downloaded archive."
}

# Clean up temporary zip and extraction folder
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
if (Test-Path $extractTemp) { Remove-Item -Path $extractTemp -Recurse -Force }

Write-Host ""
Write-Host "Verification:" -ForegroundColor Cyan
& $localK6 version
Write-Host "k6 setup complete! You can now run load tests." -ForegroundColor Green
