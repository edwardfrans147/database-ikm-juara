# IKM JUARA Server Restart Script
Write-Host "=== IKM JUARA Server Restart ===" -ForegroundColor Green

# Stop existing node processes
Write-Host "Stopping existing server processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Check if port 3000 is free
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "Port 3000 is still in use. Waiting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# Start server
Write-Host "Starting server..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "server/app.js" -WindowStyle Normal

# Wait for server to start
Start-Sleep -Seconds 3

# Test server
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/website-content" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Server started successfully!" -ForegroundColor Green
        Write-Host "Admin Panel: http://localhost:3000/admin" -ForegroundColor Cyan
        Write-Host "Public Website: http://localhost:3000/public" -ForegroundColor Cyan
        Write-Host "API Test: http://localhost:3000/api/website-content" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Server may not have started correctly. Please check manually." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")