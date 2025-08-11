# 🏛️ BUSCADOR DE INVENTARIO - INSTRUCCIONES COMPLETAS

## ✅ SOLUCIÓN IMPLEMENTADA

El buscador de inventario ahora se inicia **automáticamente** y se mantiene ejecutándose constantemente.

## 🚀 CÓMO INICIAR TODO (MÉTODO RECOMENDADO)

### Opción 1: Script Automático Completo
```bash
cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
./start_complete.sh
```

### Opción 2: Comandos Yarn
```bash
cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
yarn dev-with-inventory
```

### Opción 3: Manual (si los anteriores no funcionan)
```bash
# Terminal 1 - Servidor de inventario
cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
python3 auto_start_inventory.py

# Terminal 2 - Aplicación React
cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
yarn dev
```

## 🎯 CÓMO USAR EL BUSCADOR

1. **Inicia los servicios** usando cualquiera de los métodos anteriores
2. **Abre tu navegador** en http://localhost:5174
3. **Ve a la sección "Museo Escolar"**
4. **Haz clic en "Buscador de Inventario"** (primer botón de la lista)
5. **Escribe un número de inventario** (ejemplos: 1, 2, 3, 4, 5)
6. **Haz clic en "Buscar"** o presiona Enter
7. **¡Disfruta de la información completa del objeto!**

## 📊 INFORMACIÓN QUE MUESTRA

Para cada objeto del inventario verás:
- 🏷️ **Número de inventario**
- 📋 **Descripción completa del objeto**
- 🏛️ **Procedencia** (quién lo donó al museo)
- 📸 **Información de fotografía** (si está disponible)

## 🎯 EJEMPLOS DE BÚSQUEDA

- **Número 1:** Reloj. Industria Argentina.
- **Número 2:** Máquina de sumar.Olivetti
- **Número 3:** Teléfono inalámbrico Panasonic. Producto importado.
- **Número 4:** Panaphone KXT-3014.
- **Número 5:** Celular Nokia 1100.

## 🔧 CARACTERÍSTICAS IMPLEMENTADAS

✅ **Inicio automático del servidor**
✅ **Monitoreo constante del servidor**
✅ **Reinicio automático si se cae**
✅ **Búsqueda por número exacto**
✅ **Sugerencias en tiempo real**
✅ **Interfaz visual moderna**
✅ **Información completa del objeto**
✅ **Manejo de errores robusto**
✅ **Proxy configurado en Vite**

## 🌐 SERVICIOS QUE SE EJECUTAN

- **Servidor de inventario:** http://localhost:5003
- **Aplicación React:** http://localhost:5174
- **API Health Check:** http://localhost:5003/api/health

## 🚨 SOLUCIÓN DE PROBLEMAS

### Si el buscador no funciona:

1. **Verificar que ambos servicios estén ejecutándose:**
   ```bash
   curl http://localhost:5003/api/health
   curl http://localhost:5174
   ```

2. **Reiniciar todo:**
   ```bash
   pkill -f "inventory_server.py"
   pkill -f "vite"
   ./start_complete.sh
   ```

3. **Verificar dependencias:**
   ```bash
   pip3 install flask flask-cors pandas openpyxl requests
   yarn install
   ```

### Si aparece error de puerto ocupado:
```bash
# Liberar puertos
sudo lsof -ti:5003 | xargs kill -9
sudo lsof -ti:5174 | xargs kill -9
```

## 📁 ARCHIVOS CREADOS/MODIFICADOS

- ✅ `public/inventory_server.py` - Servidor API principal
- ✅ `src/components/InventorySearch.jsx` - Componente React actualizado
- ✅ `src/utils/inventoryServerManager.js` - Gestor automático del servidor
- ✅ `auto_start_inventory.py` - Script de inicio automático
- ✅ `start_complete.sh` - Script completo de inicio
- ✅ `vite.config.js` - Configuración con proxy
- ✅ `package.json` - Scripts añadidos

## 🎉 ¡LISTO PARA USAR!

Tu buscador de inventario está completamente funcional y configurado para iniciarse automáticamente. Los usuarios pueden buscar cualquier objeto del museo escolar y obtener información detallada de manera intuitiva y atractiva.

**Total de objetos disponibles:** 358 objetos del Museo Escolar