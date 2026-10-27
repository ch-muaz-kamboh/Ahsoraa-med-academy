# Interactive & Automated runner for Ahsora Meds Academy k6 load tests
param(
    [ValidateSet("smoke", "load", "stress", "spike")]
    [string]$Type = "",
    [string]$Url = "",
    [int]$VUs = 0
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$binK6 = Join-Path $scriptDir "bin\k6.exe"

# 1. Ensure k6 binary is ready
$k6Cmd = Get-Command k6 -ErrorAction SilentlyContinue
if (-not $k6Cmd -and -not (Test-Path $binK6)) {
    Write-Host "[INFO] k6 is not detected. Setting up standalone k6..." -ForegroundColor Yellow
    & (Join-Path $scriptDir "setup-k6.ps1")
}

$k6Executable = if ($k6Cmd) { "k6" } else { $binK6 }

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     Ahsora Meds Academy - k6 Load & Stress Runner        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 2. Interactive Menu if parameters not provided
if (-not $Type) {
    Write-Host "Select test type to execute:" -ForegroundColor White
    Write-Host "  1. Smoke Test        (5 VUs, 30s) - Verify site sanity & response codes" -ForegroundColor Green
    Write-Host "  2. Moderate Load     (200 VUs, 3m) - Standard peak traffic load" -ForegroundColor Yellow
    Write-Host "  3. Extreme Stress    (1000 - 2500 VUs, 8m) - Push system to breaking point" -ForegroundColor Red
    Write-Host "  4. Sudden Spike      (1200 VUs burst) - Test sudden traffic rush & recovery" -ForegroundColor Magenta
    Write-Host ""
    $choice = Read-Host "Enter choice [1-4] (default: 3)"
    switch ($choice) {
        "1" { $Type = "smoke" }
        "2" { $Type = "load" }
        "4" { $Type = "spike" }
        Default { $Type = "stress" }
    }
}

if (-not $Url) {
    $inputUrl = Read-Host "Enter target URL (Press Enter for http://localhost:3000)"
    if ([string]::IsNullOrWhiteSpace($inputUrl)) {
        $Url = "http://localhost:3000"
    } else {
        $Url = $inputUrl.Trim()
    }
}

if ($Type -eq "stress" -and $VUs -eq 0) {
    $inputVUs = Read-Host "Enter maximum concurrent Virtual Users (VUs) (Press Enter for 2000)"
    if ([string]::IsNullOrWhiteSpace($inputVUs)) {
        $VUs = 2000
    } else {
        $VUs = [int]$inputVUs
    }
}

# Ensure reports directory exists
$reportsDir = Join-Path $scriptDir "reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
}

Write-Host ""
Write-Host "Starting test: $Type" -ForegroundColor Cyan
Write-Host "Target URL:    $Url" -ForegroundColor Cyan
if ($VUs -gt 0) { Write-Host "Max VUs:       $VUs" -ForegroundColor Cyan }
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

# 3. Select script to run
$scriptFile = ""
$envArgs = @("-e", "TARGET_URL=$Url")

switch ($Type) {
    "smoke" {
        $scriptFile = Join-Path $scriptDir "scripts\smoke-test.js"
    }
    "load" {
        $scriptFile = Join-Path $scriptDir "scripts\extreme-stress-test.js"
        $envArgs += @("-e", "MAX_VUS=200")
    }
    "stress" {
        $scriptFile = Join-Path $scriptDir "scripts\extreme-stress-test.js"
        $envArgs += @("-e", "MAX_VUS=$VUs")
    }
    "spike" {
        $scriptFile = Join-Path $scriptDir "scripts\spike-test.js"
        if ($VUs -gt 0) { $envArgs += @("-e", "SPIKE_VUS=$VUs") }
    }
}

# 4. Execute k6
$runArgs = @("run") + $envArgs + @($scriptFile)
Write-Host "Executing: $k6Executable $($runArgs -join ' ')" -ForegroundColor DarkGray

& $k6Executable @runArgs

# 5. Check report output
$latestReport = Join-Path $reportsDir "latest-report.html"
if (Test-Path $latestReport) {
    Write-Host ""
    Write-Host "[SUCCESS] Interactive HTML report generated at:" -ForegroundColor Green
    Write-Host "  $latestReport" -ForegroundColor Yellow
    Write-Host "Opening report in your browser..." -ForegroundColor Cyan
    Start-Process $latestReport
}
