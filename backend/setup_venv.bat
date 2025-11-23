@echo off
echo ================================
echo Setting up Backend Virtual Environment
echo ================================

REM Remove old venv if exists
if exist "venv" (
    echo Removing old virtual environment...
    rmdir /s /q venv
)

REM Create new venv
echo Creating new virtual environment...
python -m venv venv

REM Activate venv
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Create flag file
echo. > venv\installed.flag

echo.
echo ================================
echo Setup complete!
echo ================================
echo.
echo To start the backend, run: start_backend_venv.bat
echo.

pause
