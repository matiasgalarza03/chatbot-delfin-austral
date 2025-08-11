@echo off
chcp 65001 >nul
title 🤖 Marvín AI - Sistema Completo

echo.
echo 🤖 Marvín AI - Sistema Completo
echo ==============================
echo.

REM Verificar configuración
if not exist "package.json" (
    echo ❌ Error: Ejecuta setup_windows.bat primero
    pause
    exit /b 1
)

if not exist ".venv" (
    echo ❌ Error: Entorno Python no configurado. Ejecuta setup_windows.bat primero
    pause
    exit /b 1
)

echo 🐍 Activando entorno virtual Python...
call .venv\Scripts\activate.bat

echo 📋 Verificando archivo de inventario...
if not exist "public\Inventario Museo Escolar. Secundaria 3.xlsx" (
    echo ⚠️ Archivo de inventario no encontrado en public\
    echo    El sistema funcionará sin la función de búsqueda de inventario
    echo.
)

echo 🚀 Iniciando servidores...
echo.
echo 🌐 Frontend estará disponible en: http://localhost:5173
echo 🔧 Backend API estará disponible en: http://localhost:5003
echo 🔄 Las páginas se abrirán automáticamente
echo ⏹️ Presiona Ctrl+C para detener todos los servidores
echo.

REM Crear script temporal para iniciar backend
echo @echo off > temp_start_backend.bat
echo call .venv\Scripts\activate.bat >> temp_start_backend.bat
echo python auto_start_inventory.py >> temp_start_backend.bat

REM Iniciar backend en segundo plano
start /min temp_start_backend.bat

REM Esperar un poco para que el backend se inicie
echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

REM Abrir navegadores
start http://localhost:5173
start http://localhost:5003/api/health

REM Iniciar frontend
echo 🎯 Iniciando frontend...
yarn dev

REM Limpiar archivos temporales y procesos al salir
echo.
echo 🧹 Limpiando procesos...
taskkill /f /im python.exe 2>nul
del temp_start_backend.bat 2>nul

echo 👋 ¡Sistema detenido!
pause