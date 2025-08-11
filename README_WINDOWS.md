# 🤖 Marvín AI - Versión para Windows

¡Bienvenido al chatbot 3D interactivo Marvín AI! Este proyecto ha sido preparado para ejecutarse fácilmente en computadoras Windows.

## 🎯 ¿Qué es Marvín AI?

Marvín AI es un asistente virtual con avatar 3D que incluye:
- 🗣️ **Reconocimiento de voz** - Habla con Marvín
- 🔊 **Respuestas en audio** - 55 archivos pregrabados
- 📚 **Sistema de inventario** - Búsqueda de objetos del museo
- 🎭 **Avatar 3D interactivo** - Interfaz visual atractiva
- 📖 **Contenido educativo** - Sobre Malvinas y la escuela

## ⚡ Inicio Súper Rápido

```cmd
# 1. Doble clic en:
setup_windows.bat

# 2. Cuando termine, doble clic en:
start_frontend_only.bat
```

¡Listo! Tu chatbot estará en `http://localhost:5173`

## 📋 Requisitos Mínimos

### Software Necesario:
- **Windows 10/11** (cualquier edición)
- **Node.js 16+** (https://nodejs.org/)
- **Python 3.9+** (https://python.org/)
- **4 GB RAM** mínimo
- **500 MB espacio** en disco

### Instalación de Requisitos:
1. **Node.js**: Descargar desde nodejs.org, marcar "Add to PATH"
2. **Python**: Descargar desde python.org, marcar "Add Python to PATH"

## 🚀 Opciones de Ejecución

### 🏃‍♂️ Opción 1: Solo Frontend (Recomendado para pruebas)
```cmd
start_frontend_only.bat
```
- ✅ Inicio en 30 segundos
- ✅ Chatbot 3D completo
- ✅ Todas las respuestas de audio
- ❌ Sin búsqueda de inventario

### 🎯 Opción 2: Sistema Completo
```cmd
start_complete.bat
```
- ✅ Todas las funcionalidades
- ✅ Sistema de inventario del museo
- ✅ Backend + Frontend
- ⏳ Inicio en 1-2 minutos

### 🌐 Opción 3: Acceso desde Internet
```cmd
start_with_ngrok.bat
```
- ✅ Accesible desde cualquier dispositivo
- ✅ Compartir con otros usuarios
- 📱 Funciona en móviles
- 🔧 Requiere cuenta gratuita en ngrok.com

## 📁 Estructura del Proyecto

```
ntucLearningHub/
├── 🎵 public/audios/           # 55 archivos MP3 (29 MB)
├── 📊 public/data/             # Respuestas en JSON
├── 🏛️ public/models/           # Modelos 3D
├── 📋 public/Inventario...     # Base de datos del museo
├── ⚙️ src/                     # Código fuente React
├── 🚀 setup_windows.bat       # Configuración automática
├── 🏃 start_frontend_only.bat # Inicio rápido
├── 🎯 start_complete.bat      # Sistema completo
└── 🌐 start_with_ngrok.bat    # Acceso web
```

## 🔧 Solución de Problemas

### ❌ "node no se reconoce como comando"
- Reinstalar Node.js marcando "Add to PATH"
- Reiniciar computadora

### ❌ "python no se reconoce como comando"  
- Reinstalar Python marcando "Add Python to PATH"
- Reiniciar computadora

### ❌ Error de puertos ocupados
- Los puertos 5173 y 5003 se usan automáticamente
- Si están ocupados, el sistema encuentra otros libres

### 🐌 Carga lenta en el primer inicio
- Normal - se están instalando dependencias
- Los siguientes inicios serán más rápidos

## 🌐 Acceso Remoto con ngrok

Para que otras personas accedan desde internet:

1. **Instalar ngrok**:
   - Ir a https://ngrok.com/
   - Crear cuenta gratuita
   - Descargar para Windows

2. **Configurar**:
   ```cmd
   ngrok authtoken TU_TOKEN_AQUI
   ```

3. **Ejecutar**:
   ```cmd
   start_with_ngrok.bat
   ```

4. **Compartir**: Aparecerá una URL como `https://abc123.ngrok-free.app`

## 📱 Dispositivos Compatibles

Una vez ejecutándose, funciona en:
- ✅ **Computadoras Windows** (Chrome, Edge, Firefox)
- ✅ **Móviles Android/iPhone** (navegador)
- ✅ **Tablets** (navegador)
- ✅ **Smart TVs** (navegador)
- ✅ **Chromebooks**

## 📞 Soporte y Ayuda

### Documentación Completa:
- `INSTRUCCIONES_WINDOWS.md` - Guía detallada paso a paso
- `CONFIGURACION_WINDOWS.txt` - Info del sistema

### Problemas Comunes:
1. **Reinstalar dependencias**: Ejecutar `setup_windows.bat` nuevamente
2. **Limpiar caché**: Borrar carpeta `node_modules` y ejecutar setup
3. **Verificar requisitos**: Node.js y Python correctamente instalados

## 🎉 ¡Comienza Ahora!

```cmd
# Paso 1: Configurar (solo la primera vez)
setup_windows.bat

# Paso 2: Ejecutar
start_frontend_only.bat

# 🌐 Tu chatbot estará en: http://localhost:5173
```

---

## 🔥 Características Destacadas

- 🎤 **Habla con Marvín** usando tu micrófono
- 👂 **Escucha respuestas** en audio de alta calidad
- 🔍 **Busca objetos** del museo por número de inventario
- 📚 **Aprende sobre Malvinas** con contenido interactivo
- 🎮 **Interfaz 3D** intuitiva y moderna
- 📱 **Responsive** - funciona en cualquier pantalla

¡Disfruta explorando con Marvín AI! 🤖✨