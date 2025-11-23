@echo off
echo ============================================
echo   Starting KrishiChakra RAG API Server
echo ============================================
echo.
echo Port: 8001
echo API Docs: http://localhost:8001/docs
echo Health Check: http://localhost:8001/api/v2/health
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

cd /d "%~dp0"
python rag_api_server.py

pause
