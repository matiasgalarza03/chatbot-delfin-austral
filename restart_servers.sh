#!/bin/bash
# Script para reiniciar ambos servidores y conectarlos correctamente

echo "🔄 === REINICIANDO SERVIDORES PARA CONECTAR FRONTEND Y BACKEND ==="

# Matar procesos existentes
echo "🛑 Deteniendo servidores existentes..."
pkill -f "inventory_server_simple.py" || true
pkill -f "vite" || true
sleep 2

# Iniciar servidor Python
echo "🐍 Iniciando servidor Python (Backend)..."
python3 inventory_server_simple.py &
PYTHON_PID=$!
echo "Backend PID: $PYTHON_PID"

# Esperar a que el servidor Python esté listo
echo "⏳ Esperando que el backend esté listo..."
for i in {1..10}; do
    if curl -s http://localhost:5003/health > /dev/null; then
        echo "✅ Backend listo en puerto 5003"
        break
    fi
    echo "  Intento $i/10..."
    sleep 1
done

# Verificar que el backend responde
echo "🧪 Probando backend..."
curl -s http://localhost:5003/health | python3 -m json.tool

# Iniciar servidor React con proxy
echo ""
echo "⚛️ Iniciando servidor React (Frontend)..."
echo "📍 Frontend estará en: http://localhost:5174"
echo "🔗 Proxy configurado: /api -> http://localhost:5003"
echo ""
echo "Para probar la conexión:"
echo "1. Ve a http://localhost:5174"
echo "2. Abre Museo Escolar → Buscador de inventario"
echo "3. Debería mostrar '✅ Estado del servidor: Conectado'"
echo ""
echo "Para detener ambos servidores, presiona Ctrl+C"
echo ""

# Iniciar Vite
npm run dev

# Cleanup cuando se termine
echo "🛑 Deteniendo servidores..."
kill $PYTHON_PID 2>/dev/null || true