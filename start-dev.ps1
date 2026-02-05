# Church Project - Development Auto-Start Script
# This script starts both backend and frontend servers and opens Chrome

Write-Host "Starting Church Project Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($connection.TcpTestSucceeded) {
        return $true
    }
    return $false
}

# Function to wait for server to be ready
function Wait-ForServer {
    param(
        [string]$Url,
        [int]$MaxAttempts = 30
    )
    
    $attempts = 0
    while ($attempts -lt $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                return $true
            }
        }
        catch {
            # Server not ready yet
        }
        Start-Sleep -Seconds 1
        $attempts++
    }
    return $false
}

# Check if ports are already in use
if (Test-Port -Port 5000) {
    Write-Host "Warning: Port 5000 is already in use. Backend might already be running." -ForegroundColor Yellow
}
else {
    Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; npm run dev" -WindowStyle Normal
}

if (Test-Port -Port 5173) {
    Write-Host "Warning: Port 5173 is already in use. Frontend might already be running." -ForegroundColor Yellow
}
else {
    Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm run dev" -WindowStyle Normal
}

Write-Host ""
Write-Host "Waiting for servers to start..." -ForegroundColor Yellow

# Wait for backend
Write-Host "   Checking backend..." -NoNewline
if (Wait-ForServer -Url "http://localhost:5000/api/health") {
    Write-Host " OK" -ForegroundColor Green
}
else {
    Write-Host " Timeout (continuing)" -ForegroundColor Yellow
}

# Wait for frontend
Write-Host "   Checking frontend..." -NoNewline
Start-Sleep -Seconds 3
if (Wait-ForServer -Url "http://localhost:5173") {
    Write-Host " OK" -ForegroundColor Green
}
else {
    Write-Host " Timeout (continuing)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Opening Chrome Browser..." -ForegroundColor Cyan

# Find Chrome executable
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LocalAppData}\Google\Chrome\Application\chrome.exe"
)

$chromePath = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chromePath) {
    # Open Chrome with both URLs in separate tabs
    Start-Process $chromePath -ArgumentList "http://localhost:5173", "http://localhost:5000/api/health"
    Write-Host "Chrome opened with:" -ForegroundColor Green
    Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   - Backend Health: http://localhost:5000/api/health" -ForegroundColor White
}
else {
    Write-Host "Chrome not found. Please open manually:" -ForegroundColor Yellow
    Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   - Backend: http://localhost:5000/api/health" -ForegroundColor White
}

Write-Host ""
Write-Host "Development environment is ready!" -ForegroundColor Green
Write-Host "Press Ctrl+C in the server windows to stop the servers." -ForegroundColor Gray
Write-Host ""
