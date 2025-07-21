@echo off
cd ..
echo Starting Vue dev server...
start "" cmd /k "cd frontend && npm run dev"

timeout /t 5 > nul
echo Starting Python app with pywebview...
py dev.py