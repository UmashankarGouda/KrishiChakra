@echo off
echo ================================
echo Starting Backend with VENV
echo ================================

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements if needed
if not exist "venv\installed.flag" (
    echo Installing requirements...
    pip install -r requirements.txt
    echo. > venv\installed.flag
)

REM Start the backend
echo.
echo Starting FastAPI server...
echo Backend will run on: http://localhost:8000
echo API docs available at: http://localhost:8000/docs
echo.
python main.py

pause
