@echo off
echo ========================================
echo Starting KrishiChakra Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Activating Python environment...
echo.

echo [2/2] Starting FastAPI server on port 8000...
echo.
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Voice API Health: http://localhost:8000/api/voice/health
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================

python main.py
