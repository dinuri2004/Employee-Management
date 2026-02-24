@echo off
REM Run this from any location — it will cd to the script folder and run docker compose
cd /d %~dp0
echo Building and starting Docker Compose stack...
docker compose up --build -d
necho.
echo Showing running containers:
docker compose ps
necho.
echo Tailing backend logs (press Ctrl+C to stop):
docker compose logs backend --tail 200 -f
pause

