@echo off
REM Script para iniciar ProductStore en modo optimizado (Windows)
REM Uso: dev.bat [fast|turbo|full]

setlocal enabledelayedexpansion

if "%1"=="" (
    set MODE=fast
) else (
    set MODE=%1
)

echo.
echo ^===== ProductStore Development Server =====
echo Modo: %MODE%
echo.

set "BACKEND_PATH=%~dp0backend-marketplace"
set "FRONTEND_PATH=%~dp0frontend-marketplace"

if "%MODE%"=="fast" (
    echo ^[*^] Modo FAST - Minimo consumo de recursos
    echo Backend:  node sin nodemon
    echo Frontend: next dev normal
    echo.
    
    start "ProductStore Backend (FAST)" cmd /k "cd /d %BACKEND_PATH% && npm run dev:fast"
    timeout /t 3 /nobreak
    start "ProductStore Frontend" cmd /k "cd /d %FRONTEND_PATH% && npm run dev"
    
    echo.
    echo ^[OK^] Servidores iniciados:
    echo Backend:  http://localhost:3001
    echo Frontend: http://localhost:3000
    echo.
    echo Presiona Ctrl+C en las ventanas cuando termines
)

if "%MODE%"=="turbo" (
    echo ^[*^] Modo TURBO - Compilacion experimental rapida
    echo Backend:  nodemon
    echo Frontend: Turbopack experimental
    echo.
    
    start "ProductStore Backend" cmd /k "cd /d %BACKEND_PATH% && npm run dev"
    timeout /t 3 /nobreak
    start "ProductStore Frontend (TURBO)" cmd /k "cd /d %FRONTEND_PATH% && npm run dev:turbo"
    
    echo.
    echo ^[OK^] Servidores iniciados en modo experimental:
    echo Backend:  http://localhost:3001
    echo Frontend: http://localhost:3000
    echo.
    echo ^[!^] Turbopack es experimental, reporta problemas si los hay
)

if "%MODE%"=="full" (
    echo ^[*^] Modo FULL - Todas las caracteristicas
    echo Backend:  nodemon
    echo Frontend: next dev normal
    echo.
    
    start "ProductStore Backend" cmd /k "cd /d %BACKEND_PATH% && npm run dev"
    timeout /t 3 /nobreak
    start "ProductStore Frontend" cmd /k "cd /d %FRONTEND_PATH% && npm run dev"
    
    echo.
    echo ^[OK^] Servidores iniciados:
    echo Backend:  http://localhost:3001
    echo Frontend: http://localhost:3000
)

if not "%MODE%"=="fast" if not "%MODE%"=="turbo" if not "%MODE%"=="full" (
    echo ^[ERROR^] Modo desconocido: %MODE%
    echo.
    echo Usos validos:
    echo   dev.bat           # Modo fast (recomendado)
    echo   dev.bat fast      # Minimo consumo
    echo   dev.bat turbo     # Compilacion rapida experimental
    echo   dev.bat full      # Todas las caracteristicas
)
