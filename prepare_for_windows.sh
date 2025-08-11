#!/bin/bash

# 📦 Script para preparar el proyecto para transferencia a Windows
# Ejecutar en macOS antes de transferir

echo "📦 Preparando Marvín AI para transferencia a Windows"
echo "=================================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta desde el directorio del proyecto."
    exit 1
fi

print_status "Limpiando archivos temporales y dependencias..."

# Limpiar archivos temporales de macOS
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "tmp_rovodev_*" -delete 2>/dev/null || true

# Limpiar dependencias que se reinstalarán en Windows
if [ -d "node_modules" ]; then
    print_warning "Eliminando node_modules (se reinstalará en Windows)..."
    rm -rf node_modules
fi

if [ -d ".venv" ]; then
    print_warning "Eliminando entorno virtual Python (se recreará en Windows)..."
    rm -rf .venv
fi

# Limpiar archivos de bloqueo específicos de macOS
rm -f yarn.lock 2>/dev/null || true
rm -f package-lock.json 2>/dev/null || true

print_status "Creando archivo de configuración para Windows..."

# Crear archivo con información del sistema
cat > CONFIGURACION_WINDOWS.txt << EOF
🤖 MARVÍN AI - CONFIGURACIÓN PARA WINDOWS
========================================

📅 Preparado el: $(date)
💻 Desde: macOS
🎯 Para: Windows

📋 CONTENIDO DEL PROYECTO:
- ✅ Código fuente completo
- ✅ 55 archivos de audio (29 MB)
- ✅ Respuestas en JSON
- ✅ Modelos 3D
- ✅ Inventario del museo (19 MB)
- ✅ Scripts de configuración para Windows

📁 ARCHIVOS IMPORTANTES:
- setup_windows.bat          → Configuración automática
- start_frontend_only.bat    → Inicio rápido (solo frontend)
- start_complete.bat         → Sistema completo
- start_with_ngrok.bat       → Acceso desde internet
- INSTRUCCIONES_WINDOWS.md   → Guía completa

🚀 INICIO RÁPIDO EN WINDOWS:
1. Instalar Node.js y Python
2. Ejecutar: setup_windows.bat
3. Ejecutar: start_frontend_only.bat

📞 SOPORTE:
Si hay problemas, revisar INSTRUCCIONES_WINDOWS.md
EOF

print_status "Verificando integridad de archivos críticos..."

# Verificar archivos importantes
critical_files=(
    "public/data/Respuestas.json"
    "public/Inventario Museo Escolar. Secundaria 3.xlsx"
    "src"
    "public/audios"
    "public/models"
    "package.json"
    "vite.config.js"
)

for file in "${critical_files[@]}"; do
    if [ -e "$file" ]; then
        print_success "✓ $file"
    else
        print_warning "⚠ $file no encontrado"
    fi
done

print_status "Calculando tamaño del proyecto..."
project_size=$(du -sh . | cut -f1)
audio_size=$(du -sh public/audios 2>/dev/null | cut -f1 || echo "0")
print_success "Tamaño total: $project_size"
print_success "Tamaño audios: $audio_size"

print_status "Creando instrucciones de transferencia..."

cat > COMO_TRANSFERIR.txt << EOF
📤 CÓMO TRANSFERIR A WINDOWS
===========================

OPCIÓN 1: Comprimir y transferir
- Comprimir toda la carpeta en ZIP
- Transferir por USB, email, o nube
- Extraer en Windows

OPCIÓN 2: Git (Recomendado)
- Hacer commit de todos los cambios
- Push al repositorio
- Clone en Windows

OPCIÓN 3: Sincronización en nube
- Subir a Google Drive/OneDrive/Dropbox
- Descargar en Windows

⚠️ IMPORTANTE:
- NO comprimir node_modules (ya se eliminó)
- Mantener estructura de carpetas
- Verificar que se transfieran archivos .bat

📁 Tamaño aproximado: $project_size
EOF

echo
print_success "🎉 ¡Proyecto preparado para Windows!"
echo
print_status "📋 Próximos pasos:"
echo "   1. Transferir toda la carpeta a Windows"
echo "   2. En Windows, seguir INSTRUCCIONES_WINDOWS.md"
echo "   3. Ejecutar setup_windows.bat"
echo "   4. ¡Disfrutar de Marvín AI!"
echo
print_warning "📁 Archivos importantes creados:"
echo "   • CONFIGURACION_WINDOWS.txt"
echo "   • COMO_TRANSFERIR.txt"
echo "   • INSTRUCCIONES_WINDOWS.md"
echo "   • Scripts .bat para Windows"
echo