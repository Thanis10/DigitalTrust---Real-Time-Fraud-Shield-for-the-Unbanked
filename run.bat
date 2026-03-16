@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

set "MODEL_DIR=%ROOT%\model_service"
if not exist "%MODEL_DIR%\api\main.py" (
  set "MODEL_DIR=%ROOT%\model_side_runtime"
)
if not exist "%MODEL_DIR%\api\main.py" (
  set "MODEL_DIR=%ROOT%\model"
)

if not exist "%MODEL_DIR%\api\main.py" (
  echo [ERROR] Could not find the model API folder.
  echo Expected either:
  echo   %ROOT%\model_side_runtime\api\main.py
  echo or
  echo   %ROOT%\model\api\main.py
  exit /b 1
)

echo [INFO] Root app directory: %ROOT%
echo [INFO] Model directory: %MODEL_DIR%
echo [INFO] Starting FastAPI on http://127.0.0.1:8000
start "VHack Side Model API" cmd /k "cd /d ""%MODEL_DIR%"" && python -m uvicorn api.main:app --host 127.0.0.1 --port 8000"

echo [INFO] Starting Streamlit on http://127.0.0.1:8501
start "VHack Side Model Dashboard" cmd /k "cd /d ""%MODEL_DIR%"" && streamlit run dashboard/app.py --server.port 8501"

echo [INFO] Starting Next.js on http://127.0.0.1:3000
start "VHack Wallet App" cmd /k "cd /d ""%ROOT%"" && set FRAUD_API_URL=http://127.0.0.1:8000 && npm run dev -- --port 3000"

echo.
echo [READY] Launchers started.
echo Wallet App:      http://127.0.0.1:3000
echo Model API:       http://127.0.0.1:8000
echo Streamlit Demo:  http://127.0.0.1:8501
echo.
echo If a port is already busy, that window will show the fallback port or error.

endlocal
