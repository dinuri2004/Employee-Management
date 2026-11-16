@echo off
echo ==========================================
echo Building Angular Frontend into Backend...
echo ==========================================
cd /d "%~dp0EmployeeMS"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed!
    exit /b %ERRORLEVEL%
)

echo ==========================================
echo Compiling Unified Spring Boot Application...
echo ==========================================
set JAVA_HOME=C:\Program Files\Java\jdk-24
cd /d "%~dp0CRUD_Spring"
call mvnw.cmd compile
if %ERRORLEVEL% NEQ 0 (
    echo Backend compilation failed!
    exit /b %ERRORLEVEL%
)

echo ==========================================
echo Build Successful!
echo Run the project anytime with: run.bat
echo ==========================================
pause
