@echo off
echo ========================================================
echo Starting StaffSphere - Empowering People. Simplifying Work.
echo ========================================================
echo.

rem Check if MySQL is running, start it from XAMPP if needed
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running.
) else (
    echo [INFO] MySQL is not running. Attempting to start from XAMPP...
    if exist "C:\xampp\mysql\bin\mysqld.exe" (
        start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
        timeout /t 3 /nobreak >nul
        echo [OK] MySQL started.
    ) else (
        echo [WARN] XAMPP MySQL not found. Please start MySQL on port 3306 manually.
    )
)

echo.
echo Application will be available at:
echo   - App: http://localhost:8081
echo   - API: http://localhost:8081/api/employees
echo.
echo ========================================================

set JAVA_HOME=C:\Program Files\Java\jdk-24
cd /d "%~dp0CRUD_Spring"
call mvnw.cmd spring-boot:run
pause
