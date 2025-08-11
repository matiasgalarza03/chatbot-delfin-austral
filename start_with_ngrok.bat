@echo off
chcp 65001 >nul
title 🌐 Marvín AI - Acceso Web Global

echo.
echo 🌐 Marvín AI - Acceso desde Internet
echo ==================================
echo.

REM Verificar ngrok
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok no está instalado o no está en PATH
    echo.
    echo 📥 Para instalar ngrok:
    echo    1. Ir a https://ngrok.com/
    echo    2. Crear cuenta gratuita
    echo    3. Descargar ngrok para Windows
    echo    4. Extraer en C:\ngrok\
    echo    5. Agregar C:\ngrok\ al PATH del sistema
    echo.
    pause
    exit /b 1
)

REM Verificar configuración del proyecto
if not exist "package.json" (
    echo ❌ Error: Ejecuta setup_windows.bat primero
    pause
    exit /b 1
)

echo 🔧 Configurando servidores...
echo.

REM Verificar si hay token de ngrok configurado
ngrok config check >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ ngrok no está configurado con un token
    echo.
    echo 🔑 Para configurar:
    echo    1. Ir a https://dashboard.ngrok.com/get-started/your-authtoken
    echo    2. Copiar tu authtoken
    echo    3. Ejecutar: ngrok authtoken TU_TOKEN_AQUI
    echo.
    set /p "continuar=¿Continuar sin token? (s/n): "
    if /i not "%continuar%"=="s" (
        pause
        exit /b 1
    )
)

echo 🐍 Activando entorno virtual Python...
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
) else (
    echo ⚠️ Entorno virtual no encontrado, usando Python global
)

echo 🚀 Iniciando backend...
start /min cmd /c "python auto_start_inventory.py"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🚀 Iniciando frontend...
start /min cmd /c "yarn dev"

echo ⏳ Esperando que el frontend se inicie...
timeout /t 8 /nobreak >nul

echo 🌐 Iniciando túnel ngrok para frontend...
start /min cmd /c "ngrok http 5173"

echo 🔧 Iniciando túnel ngrok para backend...
start /min cmd /c "ngrok http 5003"

echo.
echo ✅ ¡Servidores iniciados!
echo.
echo 📋 URLs de acceso:
echo    🖥️  Local Frontend: http://localhost:5173
echo    🔧 Local Backend:  http://localhost:5003
echo.
echo 🌐 Para obtener las URLs públicas:
echo    1. Abrir http://localhost:4040 (Panel de ngrok)
echo    2. Copiar las URLs públicas mostradas
echo    3. Compartir esas URLs para acceso remoto
echo.
echo 📱 Las URLs públicas permiten acceso desde:
echo    • Cualquier computadora en internet
echo    • Dispositivos móviles
echo    • Tablets
echo    • Otros países/ciudades
echo.
echo ⏹️ Para detener todos los servicios, cierra esta ventana
echo    o presiona Ctrl+C
echo.

REM Abrir panel de ngrok automáticamente
timeout /t 3 /nobreak >nul
start http://localhost:4040

echo 🎯 Panel de ngrok abierto. Desde ahí puedes:
echo    • Ver las URLs públicas generadas
echo    • Monitorear el tráfico web
echo    • Ver estadísticas de uso
echo.

REM Mantener la ventana abierta
pause >nul