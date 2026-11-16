Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting StaffSphere - Empowering People. Simplifying Work." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlRunning) {
    if (Test-Path "C:\xampp\mysql\bin\mysqld.exe") {
        Write-Host "[INFO] Starting MySQL from XAMPP..." -ForegroundColor Yellow
        Start-Process "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini --standalone" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "[OK] MySQL started." -ForegroundColor Green
    } else {
        Write-Host "[WARN] Make sure MySQL is running on localhost:3306 (database: crud_db)" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] MySQL is already running." -ForegroundColor Green
}

Write-Host ""
Write-Host "Application URL : http://localhost:8081" -ForegroundColor Green
Write-Host "Backend API     : http://localhost:8081/api/employees" -ForegroundColor Green
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
Set-Location -Path "$PSScriptRoot\CRUD_Spring"
.\mvnw.cmd spring-boot:run
