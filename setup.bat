@echo off
setlocal

echo Creating directory %APPDATA_DIR%
set "APPDATA_DIR=%LOCALAPPDATA%\DocSearch"

if not exist "%APPDATA_DIR%" (
    mkdir "%APPDATA_DIR%"
)

set "SOURCE_DB=final.db"
set "DEST_DB=%APPDATA_DIR%\final.db"

copy "%SOURCE_DB%" "%DEST_DB%"

if %ERRORLEVEL% neq 0 (
    echo Failed to copy the database file.
    exit /b 1
)

echo Database file copied successfully to %DEST_DB%.
exit /b 0