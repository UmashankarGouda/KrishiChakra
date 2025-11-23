@echo off
echo ============================================
echo   KrishiChakra Backend - Windows Setup
echo ============================================
echo.

REM Check if venv exists
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing dependencies (Windows-compatible)...
python -m pip install --upgrade pip
pip install -r requirements-windows.txt

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the backend:
echo   1. Run: venv\Scripts\activate.bat
echo   2. Then: python main.py
echo.
echo Or use: start_backend_windows.bat
echo ============================================
pause
