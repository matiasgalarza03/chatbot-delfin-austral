@echo off
chcp 65001 >nul
title 🤖 Marvín AI - Configuración Windows

echo.
echo 🤖 Configuración de Marvín AI para Windows
echo ==========================================
echo.

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json
    echo    Asegúrate de ejecutar este script desde el directorio del proyecto
    pause
    exit /b 1
)

echo 📋 Verificando dependencias del sistema...
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION! encontrado
)

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado
    echo 📥 Descárgalo desde: https://python.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo ✅ !PYTHON_VERSION! encontrado
)

REM Verificar/instalar Yarn
yarn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Yarn no encontrado, instalando...
    npm install -g yarn
    if %errorlevel% neq 0 (
        echo ❌ Error instalando Yarn
        pause
        exit /b 1
    )
    echo ✅ Yarn instalado correctamente
) else (
    echo ✅ Yarn encontrado
)

echo.
echo 📦 Instalando dependencias de Node.js...
if not exist "node_modules" (
    yarn install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias de Node.js
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias de Node.js ya instaladas
)

echo.
echo 🐍 Configurando entorno Python...
if not exist ".venv" (
    echo 📦 Creando entorno virtual Python...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo ❌ Error creando entorno virtual
        pause
        exit /b 1
    )
)

echo 🔧 Activando entorno virtual...
call .venv\Scripts\activate.bat

echo 📦 Instalando dependencias Python...
pip install flask flask-cors pandas openpyxl requests
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias Python
    pause
    exit /b 1
)

echo.
echo ✅ Configuración completada exitosamente!
echo.
echo 📋 Scripts disponibles:
echo    • start_frontend_only.bat  - Solo frontend (rápido)
echo    • start_complete.bat       - Frontend + Backend completo
echo    • start_with_ngrok.bat     - Acceso desde internet (requiere ngrok)
echo.
pause