@echo off
setlocal

set "REPO_ROOT=%~dp0"
if "%REPO_ROOT:~-1%"=="\" set "REPO_ROOT=%REPO_ROOT:~0,-1%"

echo.
echo [1/3] Cerrando instancias previas de Node...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/3] Limpiando cache .next...
if exist "%REPO_ROOT%\.next" (
  rmdir /s /q "%REPO_ROOT%\.next"
  echo       .next eliminado.
) else (
  echo       No habia cache .next.
)

echo [3/3] Iniciando dev server en http://localhost:5000 ...
cd /d "%REPO_ROOT%"
npx next dev -p 5000

endlocal
