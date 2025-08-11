# 🚀 Guía de Desarrollo Local - Marvín AI

Esta guía te ayudará a configurar y ejecutar tu proyecto **Marvín AI** (chatbot con avatar 3D) en tu entorno de desarrollo local.

## 📋 Requisitos del Sistema

### ✅ Ya tienes instalado:
- ✅ Node.js v22.15.0
- ✅ npm v10.9.2  
- ✅ Python 3.7.9
- ✅ Entorno virtual Python (.venv)

### 🔧 Necesitas verificar:
- [ ] PostgreSQL (para la base de datos)
- [ ] Yarn (recomendado para este proyecto)

## 🛠️ Configuración Inicial

### 1. Instalar Yarn (si no lo tienes)
```bash
npm install -g yarn
```

### 2. Verificar PostgreSQL
```bash
# Verificar si PostgreSQL está ejecutándose
pg_isready -h localhost -p 5432

# Si no está instalado, instálalo:
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
```

### 3. Configurar la Base de Datos
```bash
# Crear la base de datos (si no existe)
createdb chatbot_db

# O usando psql:
psql -U postgres -c "CREATE DATABASE chatbot_db;"
```

## 🚀 Pasos para Iniciar el Desarrollo

### Opción 1: Inicio Automático (Recomendado)
```bash
# Navegar al directorio del proyecto
cd "./Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"

# Instalar dependencias de Node.js
yarn install

# Iniciar todo automáticamente (backend Python + frontend React)
yarn dev-with-inventory
```

### Opción 2: Inicio Manual (Para debugging)

#### Terminal 1 - Backend Python (Servidor de Inventario)
```bash
cd "./Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"

# Activar entorno virtual
source .venv/bin/activate

# Iniciar servidor de inventario
python3 auto_start_inventory.py
```

#### Terminal 2 - Frontend React
```bash
cd "./Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"

# Iniciar servidor de desarrollo
yarn dev
```

## 🌐 URLs de Acceso

Una vez iniciado, tendrás acceso a:

- **Frontend (Marvín AI)**: http://localhost:5173
- **Backend API (Inventario)**: http://localhost:5003
- **Health Check**: http://localhost:5003/api/health

## 🔧 Scripts Disponibles

```bash
# Desarrollo con inventario automático
yarn dev-with-inventory

# Solo desarrollo frontend
yarn dev

# Solo servidor de inventario
yarn start-inventory

# Detener servidor de inventario
yarn stop-inventory

# Build para producción
yarn build

# Preview del build
yarn preview
```

## 🗂️ Estructura del Proyecto

```
ntucLearningHub/
├── src/                    # Código fuente React
├── public/                 # Archivos estáticos y scripts Python
│   ├── inventory_excel.py  # Lógica del inventario
│   ├── inventory_server.py # Servidor Flask
│   └── Inventario Museo Escolar. Secundaria 3.xlsx
├── .venv/                  # Entorno virtual Python
├── server.py              # Servidor principal Flask
├── auto_start_inventory.py # Gestor automático del servidor
└── package.json           # Dependencias Node.js
```

## 🎯 Características del Proyecto

- **🗣️ Reconocimiento de Voz**: Usa Web Speech API
- **🗨️ Texto a Voz**: Síntesis de voz integrada
- **🎭 Avatar 3D**: Renderizado con Three.js/React Three Fiber
- **📚 Sistema de Inventario**: Búsqueda en Excel del museo escolar
- **🎨 UI Moderna**: Chakra UI + Tailwind CSS

## 🐛 Solución de Problemas

### Error: "PostgreSQL no está ejecutándose"
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Error: "Puerto 5003 ya en uso"
```bash
# Encontrar y terminar el proceso
lsof -ti:5003 | xargs kill -9
```

### Error: "Módulo no encontrado"
```bash
# Reinstalar dependencias Python
source .venv/bin/activate
pip install flask flask-cors pandas openpyxl requests

# Reinstalar dependencias Node.js
yarn install
```

## 📱 Desarrollo Mobile (Capacitor)

El proyecto también incluye soporte para Capacitor:

```bash
# Instalar Capacitor CLI
npm install -g @capacitor/cli

# Sincronizar con plataformas móviles
npx cap sync

# Ejecutar en Android
npx cap run android
```

## 🔄 Flujo de Desarrollo Recomendado

1. **Iniciar con**: `yarn dev-with-inventory`
2. **Desarrollar**: Edita archivos en `src/`
3. **Probar API**: Usa http://localhost:5003/api/health
4. **Hot Reload**: Los cambios se reflejan automáticamente
5. **Build**: `yarn build` cuando esté listo para producción

---

¡Listo para desarrollar! 🎉 Si tienes algún problema, revisa la sección de solución de problemas o consulta los logs en la terminal.