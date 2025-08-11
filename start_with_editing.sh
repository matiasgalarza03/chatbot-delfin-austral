#!/bin/bash

# Script para iniciar la aplicación con funcionalidad de edición permanente

echo "🚀 Iniciando sistema completo con edición permanente..."

# Matar procesos existentes en los puertos
echo "🔄 Limpiando puertos..."
lsof -ti:5174 | xargs kill -9 2>/dev/null || true
lsof -ti:5005 | xargs kill -9 2>/dev/null || true

# Esperar un momento
sleep 2

echo "📝 Iniciando servidor de edición en puerto 5005..."
# Iniciar servidor de edición en background
node server_edicion.js &
EDIT_PID=$!

# Esperar a que el servidor de edición esté listo
sleep 3

echo "🌐 Iniciando aplicación principal en puerto 5174..."
# Iniciar aplicación principal
npm run dev &
APP_PID=$!

echo ""
echo "✅ Sistema iniciado correctamente:"
echo "   📱 Aplicación: http://localhost:5174"
echo "   📝 Servidor de edición: http://localhost:5005"
echo ""
echo "🎯 FUNCIONALIDADES DISPONIBLES:"
echo "   🎵 Audio corregido para sectores geográficos"
echo "   ✏️  Edición permanente con Shift+Shift"
echo "   💾 Cambios se guardan automáticamente en archivos"
echo ""
echo "📋 INSTRUCCIONES DE USO:"
echo "   1. Abre http://localhost:5174"
echo "   2. Ve a cualquier respuesta"
echo "   3. Presiona Shift+Shift para activar modo edición"
echo "   4. Edita el texto de los bloques"
echo "   5. Presiona Shift+Shift nuevamente para guardar permanentemente"
echo ""
echo "🔄 Para detener: Ctrl+C"

# Función para limpiar al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $EDIT_PID 2>/dev/null || true
    kill $APP_PID 2>/dev/null || true
    echo "✅ Servidores detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Esperar indefinidamente
wait