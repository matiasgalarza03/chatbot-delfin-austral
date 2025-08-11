#!/bin/bash

echo "🏛️ === NTUC LEARNING HUB - INICIO COMPLETO ==="
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo todos los servicios..."
    pkill -f "inventory_server.py" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    pkill -f "yarn dev" 2>/dev/null || true
    echo "✅ Servicios detenidos"
    exit 0
}

# Configurar trap para limpiar al salir
trap cleanup SIGINT SIGTERM

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio del proyecto"
    exit 1
fi

echo "🔍 Verificando dependencias..."

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python3 no está instalado"
    exit 1
fi

# Verificar Node.js y Yarn
if ! command -v yarn &> /dev/null; then
    echo "❌ Error: Yarn no está instalado"
    exit 1
fi

echo "✅ Dependencias verificadas"
echo ""

# Detener cualquier proceso previo
echo "🧹 Limpiando procesos previos..."
pkill -f "inventory_server.py" 2>/dev/null || true
sleep 2

echo "🚀 Iniciando servidor de inventario..."

# Iniciar el servidor de inventario
cd public
python3 inventory_server.py &
INVENTORY_PID=$!
cd ..

echo "⏳ Esperando que el servidor de inventario se inicie..."
sleep 8

# Verificar que el servidor esté funcionando
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:5003/api/health > /dev/null 2>&1; then
        echo "✅ Servidor de inventario funcionando en http://localhost:5003"
        break
    else
        echo "⏳ Esperando servidor de inventario... (intento $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        sleep 3
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️ El servidor de inventario tardó más de lo esperado, pero continuando..."
fi

echo ""
echo "🌐 Iniciando aplicación React..."

# Iniciar la aplicación React
yarn dev &
REACT_PID=$!

echo ""
echo "✅ === SERVICIOS INICIADOS ==="
echo "   📊 Servidor de inventario: http://localhost:5003"
echo "   🌐 Aplicación React: http://localhost:5174"
echo ""
echo "🎯 Para usar el buscador de inventario:"
echo "   1. Ve a la sección 'Museo Escolar'"
echo "   2. Haz clic en 'Buscador de Inventario'"
echo "   3. Busca cualquier número (ej: 1, 2, 3, etc.)"
echo ""
echo "🔄 Presiona Ctrl+C para detener todos los servicios"
echo ""

# Esperar a que termine alguno de los procesos
wait