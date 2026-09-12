@echo off
setlocal EnableExtensions

set "CODEX_HOME=%USERPROFILE%\.codex-franco"

REM Internal relaunch inside Windows Terminal.
if /I "%~1"=="--inside-wt" (
    set "PROJECT=%~2"
    goto :RUN_CODEX
)

REM If a project path is passed, use it.
REM Otherwise use the folder where this BAT itself is located.
if not "%~1"=="" (
    set "PROJECT=%~1"
) else (
    set "PROJECT=%~dp0"
)

REM Remove trailing "\" for normal folders.
if not "%PROJECT:~-1%"==":" if "%PROJECT:~-1%"=="\" set "PROJECT=%PROJECT:~0,-1%"

if not exist "%PROJECT%\" (
    echo ERROR: Project folder does not exist:
    echo %PROJECT%
    pause
    exit /b 1
)

REM Relaunch in modern Windows Terminal.
start "" wt.exe -d "%PROJECT%" cmd.exe /k ""%~f0" --inside-wt "%PROJECT%""
exit /b 0


:RUN_CODEX

if not defined PROJECT (
    echo ERROR: No project folder was supplied.
    pause
    exit /b 1
)

if not exist "%PROJECT%\" (
    echo ERROR: Project folder does not exist:
    echo %PROJECT%
    pause
    exit /b 1
)

if not exist "%CODEX_HOME%" mkdir "%CODEX_HOME%"

cd /d "%PROJECT%"
if errorlevel 1 (
    echo ERROR: Could not open project folder:
    echo %PROJECT%
    pause
    exit /b 1
)

title Codex - Franco - %CD%
cls

echo ==========================================
echo        Codex Launcher - Franco
echo ==========================================
echo Project:    %CD%
echo CODEX_HOME: %CODEX_HOME%
echo.

if not exist "%CODEX_HOME%\auth.json" (
    echo No Codex login found for Franco.
    echo Starting Codex login...
    echo.
    call codex login
    if errorlevel 1 (
        echo.
        echo Login failed or was cancelled.
        pause
        exit /b 1
    )
    echo.
)

REM Read account and live limits using the selected profile.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Codex-Launcher-Status.ps1" -ProfileDirectory "%CODEX_HOME%"
echo.

echo Starting Codex in:
echo %CD%
echo ==========================================
echo.

call codex

endlocal
