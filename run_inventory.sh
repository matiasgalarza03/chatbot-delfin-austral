#!/bin/bash
# Script para iniciar el servidor de inventario

echo "🚀 Iniciando servidor de inventario del Museo Escolar..."

cd public

# Verificar si el servidor ya está ejecutándose
if curl -s http://localhost:5003/api/health > /dev/null 2>&1; then
    echo "✅ El servidor ya está ejecutándose en http://localhost:5003"
else
    echo "🔄 Iniciando servidor..."
    python3 inventory_server.py &
    echo "✅ Servidor iniciado en segundo plano"
    sleep 3
    
    # Verificar que el servidor esté funcionando
    if curl -s http://localhost:5003/api/health > /dev/null 2>&1; then
        echo "✅ Servidor funcionando correctamente"
        curl -s http://localhost:5003/api/health | python3 -m json.tool
    else
        echo "❌ Error: El servidor no pudo iniciarse"
    fi
fi