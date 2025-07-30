@echo off
cd ..
echo ===================================================================
echo                       Package to EXE
echo        (Building Vue frontend, then packaging with PyInstaller)
echo ===================================================================

REM Go to frontend and build Vue app
cd frontend
echo Building frontend...
call npm run build
if errorlevel 1 (
    echo Vue build failed...
    exit /b 1
)
cd ..

REM Package the app with PyInstaller
echo Packaging Python app...
call pyinstaller --onefile --noconsole ^
  --add-data "web;web" ^
  --add-data "api.py;." ^
  main.py

REM Done
echo Build complete! EXE is in /dist folder.
pause
