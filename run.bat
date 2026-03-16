@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "API_PORT=8000"
set "STREAMLIT_PORT=8501"
set "NEXT_PORT=3000"

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

echo [INFO] Stopping existing listeners on ports 3000, 8000, 8001, and 8501
call :kill_port 3000
call :kill_port 8000
call :kill_port 8001
call :kill_port 8501

netstat -ano | findstr /R /C:":8000 .*LISTENING" >nul 2>nul
if not errorlevel 1 (
  set "API_PORT=8001"
  echo [WARN] Port 8000 is already in use. Switching model API to 8001.
)

echo [INFO] Root app directory: %ROOT%
echo [INFO] Model directory: %MODEL_DIR%
echo [INFO] Starting FastAPI on http://127.0.0.1:%API_PORT%
start "VHack Side Model API" cmd /k "cd /d ""%MODEL_DIR%"" && python -m uvicorn api.main:app --host 127.0.0.1 --port %API_PORT%"

echo [INFO] Starting Streamlit on http://127.0.0.1:%STREAMLIT_PORT%
start "VHack Side Model Dashboard" cmd /k "cd /d ""%MODEL_DIR%"" && set API_URL=http://127.0.0.1:%API_PORT%/predict_fraud && streamlit run dashboard/app.py --server.port %STREAMLIT_PORT%"

echo [INFO] Starting Next.js on http://127.0.0.1:%NEXT_PORT%
start "VHack Wallet App" cmd /k "cd /d ""%ROOT%"" && set FRAUD_API_URL=http://127.0.0.1:%API_PORT% && npm run dev -- --port %NEXT_PORT%"

echo.
echo [READY] Launchers started.
echo Wallet App:      http://127.0.0.1:%NEXT_PORT%
echo Model API:       http://127.0.0.1:%API_PORT%
echo Streamlit Demo:  http://127.0.0.1:%STREAMLIT_PORT%
echo.
echo If a port is already busy, that window will show the fallback port or error.

endlocal
exit /b 0

:kill_port
set "TARGET_PORT=%~1"
set "KILLED_ANY="
for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%TARGET_PORT% .*LISTENING"') do (
  if not "%%A"=="0" (
    echo [INFO] Stopping PID %%A on port %TARGET_PORT%
    taskkill /PID %%A /F >nul 2>nul
    set "KILLED_ANY=1"
  )
)
if defined KILLED_ANY (
  timeout /t 1 /nobreak >nul
)
set "KILLED_ANY="
set "TARGET_PORT="
exit /b 0
