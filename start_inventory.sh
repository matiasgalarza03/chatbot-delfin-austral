#!/bin/bash
# Script para iniciar el sistema de inventario

echo "🏛️ === INICIANDO SISTEMA DE INVENTARIO ==="

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

echo "✅ Python3 encontrado"

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
python3 -c "import flask, flask_cors" 2>/dev/null || {
    echo "📦 Instalando dependencias..."
    pip3 install flask flask-cors python-docx requests
}

# Extraer inventario
echo "📄 Preparando inventario..."
python3 extract_inventory.py

# Iniciar servidor
echo "🚀 Iniciando servidor de inventario..."
echo "📍 Servidor disponible en: http://localhost:5003"
echo "🔍 Para probar: curl http://localhost:5003/health"
echo ""
echo "Para detener el servidor, presiona Ctrl+C"
echo ""

python3 inventory_server_simple.py