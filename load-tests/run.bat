@echo off
setlocal
cd /d "%~dp0"

echo Launching Ahsora Meds k6 Load Testing Suite...
powershell -ExecutionPolicy Bypass -File "%~dp0run.ps1" %*

pause
