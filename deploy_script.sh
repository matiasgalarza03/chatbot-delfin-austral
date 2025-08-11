#!/bin/bash

# 🚀 SCRIPT AUTOMÁTICO PARA DESPLEGAR EL PROYECTO WEB
# Chatbot Educativo Delfín Austral - Malvinas Argentinas

echo "🌐 INICIANDO DESPLIEGUE WEB DEL PROYECTO..."
echo "📱 Tu proyecto será accesible desde cualquier dispositivo"
echo ""

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    echo "✅ Git inicializado"
else
    echo "✅ Repositorio Git ya existe"
fi

# Verificar package.json
echo "📦 Verificando configuración del proyecto..."
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    exit 1
fi

# Verificar scripts necesarios
if ! grep -q '"build"' package.json; then
    echo "⚠️ Agregando script de build..."
    # Backup del package.json original
    cp package.json package.json.backup
    
    # Agregar scripts necesarios
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.build = 'vite build';
    pkg.scripts.preview = 'vite preview';
    pkg.scripts.start = 'vite preview';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    echo "✅ Scripts de build agregados"
fi

# Crear .gitignore si no existe
if [ ! -f ".gitignore" ]; then
    echo "📝 Creando .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Temporary files
tmp/
temp/
tmp_rovodev_*

# Cache
.cache/
.parcel-cache/

# Vercel
.vercel
EOF
    echo "✅ .gitignore creado"
fi

# Preparar archivos para commit
echo "📤 Preparando archivos para subir..."
git add .
git status

echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣ COMMIT INICIAL:"
echo "   git commit -m \"🚀 Initial commit - Chatbot Delfín Austral\""
echo ""
echo "2️⃣ CREAR REPOSITORIO EN GITHUB:"
echo "   - Ve a https://github.com"
echo "   - Clic 'New repository'"
echo "   - Nombre: 'ntuc-learning-hub-chatbot'"
echo "   - Descripción: 'Chatbot Educativo Delfín Austral - Malvinas Argentinas'"
echo "   - Clic 'Create repository'"
echo ""
echo "3️⃣ CONECTAR CON GITHUB:"
echo "   git remote add origin https://github.com/TU_USUARIO/ntuc-learning-hub-chatbot.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4️⃣ DESPLEGAR EN VERCEL:"
echo "   - Ve a https://vercel.com"
echo "   - Clic 'Sign up' (conecta con GitHub)"
echo "   - Clic 'New Project'"
echo "   - Selecciona tu repositorio"
echo "   - Framework: Vite"
echo "   - Clic 'Deploy'"
echo ""
echo "🎉 RESULTADO:"
echo "   📱 Tu proyecto estará en: https://ntuc-learning-hub-chatbot.vercel.app"
echo "   🔄 Actualizaciones automáticas con cada push a GitHub"
echo "   🌐 Accesible desde cualquier dispositivo"
echo ""

# Función para ejecutar commit automático
read -p "¿Quieres hacer el commit inicial ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Haciendo commit inicial..."
    git commit -m "🚀 Initial commit - Chatbot Delfín Austral

    ✨ Características:
    - 🐬 Avatar 3D interactivo del Delfín Austral
    - 🗣️ Sistema de texto a voz y reconocimiento
    - 🏛️ Museo Escolar con inventario completo
    - 🎵 Reproductor multimedia integrado
    - 📚 Sistema educativo sobre Islas Malvinas
    - 🎛️ Sincronización manual de audio y texto
    - 📱 Diseño responsive para todos los dispositivos
    
    🎯 Listo para despliegue web"
    
    echo "✅ Commit realizado"
    echo ""
    echo "🔗 SIGUIENTE PASO: Crear repositorio en GitHub y ejecutar:"
    echo "   git remote add origin https://github.com/TU_USUARIO/ntuc-learning-hub-chatbot.git"
    echo "   git push -u origin main"
else
    echo "⏸️ Commit pendiente. Ejecuta manualmente cuando estés listo:"
    echo "   git commit -m \"🚀 Initial commit - Chatbot Delfín Austral\""
fi

echo ""
echo "🎵 ¡Tu proyecto está listo para ser desplegado en la web!"