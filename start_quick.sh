#!/bin/bash

# 🏃‍♂️ Script de inicio rápido para Marvín AI (Sin PostgreSQL)
# Para empezar a desarrollar inmediatamente

echo "🚀 Inicio Rápido - Marvín AI (Solo Frontend)"
echo "============================================"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Ejecuta desde el directorio del proyecto."
    exit 1
fi

print_status "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi
print_success "Node.js $(node --version) encontrado"

# Verificar/instalar Yarn
if ! command -v yarn &> /dev/null; then
    print_warning "Yarn no encontrado, instalando..."
    npm install -g yarn
    if [ $? -eq 0 ]; then
        print_success "Yarn instalado correctamente"
    else
        print_warning "Error instalando Yarn, usando npm en su lugar"
        PACKAGE_MANAGER="npm"
    fi
else
    print_success "Yarn encontrado"
    PACKAGE_MANAGER="yarn"
fi

# Instalar dependencias
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias de Node.js..."
    if [ "$PACKAGE_MANAGER" = "yarn" ]; then
        yarn install
    else
        npm install
    fi
else
    print_success "Dependencias ya instaladas"
fi

print_warning "Nota: Ejecutando solo el frontend (sin sistema de inventario)"
print_warning "Para la experiencia completa, instala PostgreSQL y usa ./start_dev_local.sh"

print_success "🚀 Iniciando Marvín AI..."
print_status "La aplicación estará disponible en: http://localhost:5173"
print_status "Presiona Ctrl+C para detener"

# Iniciar solo el frontend
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn dev
else
    npm run dev
fi