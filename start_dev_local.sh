#!/bin/bash

# 🚀 Script de inicio para desarrollo local de Marvín AI
# Este script configura y ejecuta todo lo necesario para el desarrollo

echo "🤖 Iniciando Marvín AI - Desarrollo Local"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

print_status "Verificando dependencias del sistema..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_success "Node.js $(node --version) encontrado"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python3 no está instalado"
    exit 1
fi
print_success "Python $(python3 --version) encontrado"

# Verificar Yarn
if ! command -v yarn &> /dev/null; then
    print_warning "Yarn no encontrado, instalando..."
    npm install -g yarn
fi
print_success "Yarn encontrado"

# Verificar PostgreSQL
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    print_warning "PostgreSQL no está ejecutándose"
    print_status "Intentando iniciar PostgreSQL..."
    
    # Intentar iniciar PostgreSQL en macOS
    if command -v brew &> /dev/null; then
        brew services start postgresql
        sleep 3
        if pg_isready -h localhost -p 5432 &> /dev/null; then
            print_success "PostgreSQL iniciado correctamente"
        else
            print_error "No se pudo iniciar PostgreSQL automáticamente"
            print_status "Por favor, inicia PostgreSQL manualmente"
        fi
    else
        print_warning "Inicia PostgreSQL manualmente antes de continuar"
    fi
else
    print_success "PostgreSQL está ejecutándose"
fi

# Verificar entorno virtual Python
if [ ! -d ".venv" ]; then
    print_warning "Entorno virtual no encontrado, creando..."
    python3 -m venv .venv
fi

print_status "Activando entorno virtual Python..."
source .venv/bin/activate

# Verificar e instalar dependencias Python
print_status "Verificando dependencias Python..."
if ! python -c "import flask, flask_cors, pandas, openpyxl" &> /dev/null; then
    print_status "Instalando dependencias Python..."
    pip install flask flask-cors pandas openpyxl requests
fi
print_success "Dependencias Python verificadas"

# Verificar e instalar dependencias Node.js
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias Node.js..."
    yarn install
else
    print_success "Dependencias Node.js ya instaladas"
fi

# Verificar archivo de inventario
if [ ! -f "public/Inventario Museo Escolar. Secundaria 3.xlsx" ]; then
    print_warning "Archivo de inventario no encontrado en public/"
    print_status "Buscando archivo de inventario..."
    find . -name "*Inventario*Museo*" -type f 2>/dev/null | head -1
fi

print_status "Configuración completada. Iniciando servidores..."

# Función para limpiar procesos al salir
cleanup() {
    print_status "Deteniendo servidores..."
    pkill -f "inventory_server.py" 2>/dev/null || true
    pkill -f "auto_start_inventory.py" 2>/dev/null || true
    exit 0
}

# Configurar trap para limpieza
trap cleanup SIGINT SIGTERM

print_success "🚀 Iniciando Marvín AI..."
print_status "Frontend estará disponible en: http://localhost:5173"
print_status "Backend API estará disponible en: http://localhost:5003"
print_status "Presiona Ctrl+C para detener todos los servidores"

# Iniciar con el script de desarrollo que incluye inventario
yarn dev-with-inventory