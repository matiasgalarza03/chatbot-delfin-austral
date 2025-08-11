# 🔧 Instalación de Dependencias - Marvín AI

## 📋 Estado Actual de tu Sistema
- ✅ Node.js v22.15.0
- ✅ Python 3.7.9
- ❌ PostgreSQL (no instalado)
- ❌ Homebrew (no instalado)

## 🚀 Opción 1: Instalación Completa (Recomendada)

### 1. Instalar Homebrew (Gestor de paquetes para macOS)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar PostgreSQL
```bash
# Una vez instalado Homebrew:
brew install postgresql@14
brew services start postgresql@14

# Crear la base de datos
createdb chatbot_db
```

### 3. Instalar Yarn
```bash
npm install -g yarn
```

## 🏃‍♂️ Opción 2: Inicio Rápido (Sin PostgreSQL)

Si quieres empezar a desarrollar inmediatamente sin configurar PostgreSQL:

### 1. Instalar solo Yarn
```bash
npm install -g yarn
```

### 2. Usar el modo de desarrollo simplificado
```bash
cd "./Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
yarn install
yarn dev  # Solo frontend, sin sistema de inventario
```

## 🔄 Opción 3: PostgreSQL Alternativo

### Usar PostgreSQL.app (Más fácil para macOS)
1. Descargar desde: https://postgresapp.com/
2. Instalar y ejecutar
3. Crear base de datos desde la interfaz

### Usar Docker (Si tienes Docker instalado)
```bash
# Ejecutar PostgreSQL en contenedor
docker run --name postgres-chatbot -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=chatbot_db -p 5432:5432 -d postgres:14

# Verificar que esté ejecutándose
docker ps
```

## 🎯 Pasos Siguientes

### Una vez instaladas las dependencias:

1. **Ejecutar el script automático:**
```bash
cd "./Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
./start_dev_local.sh
```

2. **O ejecutar manualmente:**
```bash
# Instalar dependencias
yarn install

# Opción A: Con inventario (requiere PostgreSQL)
yarn dev-with-inventory

# Opción B: Solo frontend
yarn dev
```

## 🌐 URLs de Acceso

- **Marvín AI (Frontend)**: http://localhost:5173
- **API Inventario**: http://localhost:5003 (solo si usas PostgreSQL)

## 🐛 Solución de Problemas

### Error: "command not found: brew"
```bash
# Instalar Homebrew primero
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Agregar al PATH (seguir las instrucciones que aparecen después de la instalación)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Error: "PostgreSQL connection failed"
```bash
# Verificar estado
brew services list | grep postgresql

# Reiniciar si es necesario
brew services restart postgresql@14
```

### Error: "Permission denied"
```bash
# Hacer ejecutable el script
chmod +x start_dev_local.sh
```

---

## 🎉 ¿Qué Opción Elegir?

- **¿Quieres la experiencia completa?** → Opción 1 (Instalación Completa)
- **¿Quieres empezar YA?** → Opción 2 (Inicio Rápido)
- **¿Prefieres contenedores?** → Opción 3 con Docker

¡Elige la que mejor se adapte a tus necesidades!