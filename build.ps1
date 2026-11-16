$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Building Angular Frontend into Backend..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\EmployeeMS"
npm run build

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Compiling Unified Spring Boot App..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
Set-Location -Path "$PSScriptRoot\CRUD_Spring"
.\mvnw.cmd compile

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Build Successful! Run with .\run.ps1 or .\run.bat" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
