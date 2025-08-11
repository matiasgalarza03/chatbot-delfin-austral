@echo off
chcp 65001 >nul
title 🚀 Marvín AI - Solo Frontend

echo.
echo 🚀 Marvín AI - Inicio Rápido (Solo Frontend)
echo ============================================
echo.

REM Verificar dependencias básicas
if not exist "package.json" (
    echo ❌ Error: Ejecuta setup_windows.bat primero
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ❌ Error: Dependencias no instaladas. Ejecuta setup_windows.bat primero
    pause
    exit /b 1
)

echo ⚠️ Nota: Ejecutando solo el frontend
echo    Para la experiencia completa con inventario, usa start_complete.bat
echo.

echo 🚀 Iniciando Marvín AI...
echo 🌐 La aplicación estará disponible en: http://localhost:5173
echo 🔄 La página se abrirá automáticamente
echo ⏹️ Presiona Ctrl+C para detener
echo.

REM Abrir navegador después de un pequeño delay
timeout /t 3 /nobreak >nul && start http://localhost:5173 &

REM Iniciar el servidor de desarrollo
yarn dev

echo.
echo 👋 ¡Servidor detenido!
pause