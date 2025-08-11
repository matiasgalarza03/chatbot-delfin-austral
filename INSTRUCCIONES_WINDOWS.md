# 🚀 Guía Completa: Ejecutar Marvín AI en Windows

Esta guía te permitirá transferir y ejecutar el proyecto Marvín AI desde macOS hacia cualquier computadora Windows.

## 📋 Requisitos Previos en Windows

### 1. Instalar Node.js
- Descargar desde: https://nodejs.org/
- Versión recomendada: LTS (Long Term Support)
- Durante la instalación, marcar "Add to PATH"

### 2. Instalar Python
- Descargar desde: https://python.org/
- Versión recomendada: 3.9 o superior
- ⚠️ **IMPORTANTE**: Marcar "Add Python to PATH" durante la instalación

### 3. Instalar Git (opcional pero recomendado)
- Descargar desde: https://git-scm.com/
- Para transferir el proyecto fácilmente

## 📁 Transferir el Proyecto

### Opción A: Usando Git (Recomendado)
```bash
# En macOS (tu computadora actual)
cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
git add .
git commit -m "Preparando para Windows"
git push origin main

# En Windows
git clone [URL-DE-TU-REPOSITORIO]
cd ntucLearningHub
```

### Opción B: Transferencia Directa
1. Comprimir toda la carpeta `ntucLearningHub` en un ZIP
2. Transferir el ZIP a la computadora Windows (USB, email, etc.)
3. Extraer en la ubicación deseada (ej: `C:\Users\Usuario\ntucLearningHub`)

## 🛠️ Configuración Automática en Windows

1. **Abrir Terminal como Administrador**
   - Buscar "cmd" en el menú inicio
   - Clic derecho → "Ejecutar como administrador"

2. **Navegar al proyecto**
   ```cmd
   cd C:\Users\Usuario\ntucLearningHub
   ```

3. **Ejecutar configuración automática**
   ```cmd
   setup_windows.bat
   ```

## 🚀 Ejecutar el Proyecto

### Opción 1: Solo Frontend (Rápido)
```cmd
start_frontend_only.bat
```
- ✅ Inicio rápido
- ✅ No requiere configuración adicional
- ❌ Sin función de inventario del museo

### Opción 2: Sistema Completo
```cmd
start_complete.bat
```
- ✅ Todas las funcionalidades
- ✅ Incluye sistema de inventario
- ✅ Backend + Frontend

## 🌐 Hacer Accesible desde Internet

### Usando ngrok (Recomendado)

1. **Instalar ngrok**
   - Ir a: https://ngrok.com/
   - Crear cuenta gratuita
   - Descargar ngrok para Windows
   - Extraer en `C:\ngrok\`

2. **Configurar ngrok**
   ```cmd
   C:\ngrok\ngrok.exe authtoken TU_TOKEN_AQUI
   ```

3. **Ejecutar con acceso web**
   ```cmd
   start_with_ngrok.bat
   ```

## 🔧 Solución de Problemas

### Error: "node no se reconoce como comando"
- Reinstalar Node.js marcando "Add to PATH"
- Reiniciar la computadora

### Error: "python no se reconoce como comando"
- Reinstalar Python marcando "Add Python to PATH"
- Reiniciar la computadora

### Error: Dependencias no se instalan
```cmd
# Limpiar caché y reinstalar
rmdir /s node_modules
del yarn.lock
yarn install
```

### Puerto ocupado
- El proyecto usa los puertos 5173 (frontend) y 5003 (backend)
- Si están ocupados, el sistema buscará puertos alternativos automáticamente

## 📱 Acceso desde Otros Dispositivos

Una vez ejecutado con ngrok, obtendrás URLs como:
- `https://abc123.ngrok-free.app` - Acceso desde cualquier dispositivo
- Compartir esta URL para acceso remoto

## 📞 Soporte

Si encuentras problemas:
1. Revisar que todos los requisitos estén instalados
2. Ejecutar `setup_windows.bat` nuevamente
3. Verificar que los puertos 5173 y 5003 estén libres

---

## ⚡ Inicio Rápido (Resumen)

```cmd
# 1. Instalar Node.js y Python
# 2. Extraer proyecto en Windows
cd C:\ruta\al\proyecto
setup_windows.bat
start_frontend_only.bat
```

¡Tu proyecto Marvín AI estará ejecutándose en Windows! 🎉