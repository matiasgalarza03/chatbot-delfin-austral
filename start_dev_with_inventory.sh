#!/bin/bash

echo "🏛️ Iniciando ntucLearningHub con servidor de inventario..."

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    pkill -f "inventory_server.py" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    exit 0
}

# Configurar trap para limpiar al salir
trap cleanup SIGINT SIGTERM

# Verificar si Python está disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python3 no está instalado"
    exit 1
fi

# Verificar si Node.js está disponible
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar si yarn está disponible
if ! command -v yarn &> /dev/null; then
    echo "❌ Error: Yarn no está instalado"
    exit 1
fi

echo "🔍 Verificando dependencias..."

# Instalar dependencias de Python si es necesario
pip3 install flask flask-cors pandas openpyxl requests 2>/dev/null || true

echo "🚀 Iniciando servidor de inventario..."

# Iniciar el servidor de inventario en segundo plano
cd public
python3 inventory_server.py &
INVENTORY_PID=$!

# Esperar a que el servidor se inicie
echo "⏳ Esperando que el servidor de inventario se inicie..."
sleep 5

# Verificar que el servidor esté funcionando
if curl -s http://localhost:5003/api/health > /dev/null 2>&1; then
    echo "✅ Servidor de inventario funcionando en http://localhost:5003"
else
    echo "⚠️ El servidor de inventario puede tardar un poco más en iniciarse"
fi

# Volver al directorio raíz
cd ..

echo "🌐 Iniciando aplicación React..."

# Iniciar la aplicación React
yarn dev &
REACT_PID=$!

echo "✅ Servicios iniciados:"
echo "   📊 Servidor de inventario: http://localhost:5003"
echo "   🌐 Aplicación React: http://localhost:5173"
echo ""
echo "🔄 Presiona Ctrl+C para detener todos los servicios"

# Esperar a que termine alguno de los procesos
wait