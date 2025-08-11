# 🧪 INSTRUCCIONES PARA PROBAR LA SINCRONIZACIÓN MANUAL

## 🚀 PASOS PARA VERIFICAR QUE FUNCIONA

### **1. Preparar el Entorno**
```bash
# Ejecutar el proyecto
npm run dev
```

### **2. Abrir Herramientas de Desarrollador**
- Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- Ve a la pestaña **Console**
- Ejecuta el script de debug (opcional):
```javascript
// Copiar y pegar en la consola:
fetch('./tmp_rovodev_debug_manual_sync.js').then(r => r.text()).then(eval);
```

### **3. Hacer una Pregunta de Prueba**

Prueba con cualquiera de estas preguntas que tienen audio sincronizado:

#### **🐬 Delfín Austral:**
- "¡Hola!"
- "¿Qué eres?"
- "¿Para qué fuiste creado?"
- "¿Qué puedes hacer?"

#### **🏛️ Museo Escolar:**
- "¿Qué es el museo escolar?"
- "¿Cuáles son los objetivos del museo?"
- "¿Qué actividades se realizan?"
- "¿Qué recursos están disponibles?"

#### **🏫 Escuela Secundaria:**
- "¿Cuándo se fundó la escuela y dónde se encuentra ubicada?"
- "¿Por qué se llama Malvinas Argentinas?"
- "¿Quiénes diseñaron el logo?"

#### **🗺️ Malvinas (cualquier pregunta de las secciones):**
- Contexto Geográfico
- Conflicto Armado
- Impacto Social
- Legado Actual

### **4. Verificar Indicadores Visuales**

Los indicadores visuales **solo aparecen cuando presionas las teclas G o H**. No hay indicadores permanentes en pantalla.

### **5. Probar las Teclas G y H**

#### **🔴 Tecla G (Reducir duración):**
1. **Durante la reproducción**, mientras se muestra un bloque de texto, presiona `G`
2. **Efecto inmediato:** El bloque actual se acortará inmediatamente
3. **Indicador visual:** Aparecerá un indicador rojo:
```
⬇️ BLOQUE 1 - AJUSTE APLICADO
   -0.5s
   ✅ Guardado para este bloque
```
4. **Persistencia:** El ajuste se guarda específicamente para ese bloque

#### **🟢 Tecla H (Aumentar duración):**
1. **Durante la reproducción**, mientras se muestra un bloque de texto, presiona `H`
2. **Efecto inmediato:** El bloque actual se alargará inmediatamente
3. **Indicador visual:** Aparecerá un indicador verde:
```
⬆️ BLOQUE 1 - AJUSTE APLICADO
   +0.5s
   ✅ Guardado para este bloque
```
4. **Persistencia:** El ajuste se guarda específicamente para ese bloque

### **6. Edición en Tiempo Real**

#### **🎯 Cómo Funciona:**
1. **Bloque en pantalla:** Mientras un bloque de texto se está mostrando
2. **Presionar G/H:** El ajuste se aplica **inmediatamente** a ese bloque específico
3. **Efecto inmediato:** La duración restante del bloque cambia al instante
4. **Guardado automático:** El ajuste se guarda para ese bloque particular

#### **📝 Ejemplo Práctico:**
```
Bloque 1: "¡Hola! Soy Delfín Austral..." (mostrándose ahora)
↓ Presionas H (aumentar duración)
↓ Efecto inmediato: El bloque durará 0.5s más
↓ Se guarda: Bloque 1 = +0.5s

Bloque 2: "Estoy aquí para ayudarte..." (mostrándose ahora)  
↓ Presionas G (reducir duración)
↓ Efecto inmediato: El bloque durará 0.5s menos
↓ Se guarda: Bloque 2 = -0.5s
```

### **7. Verificar Persistencia**

1. **Hacer ajustes:** Presiona G o H varias veces durante una respuesta
2. **Repetir pregunta:** Haz la misma pregunta otra vez
3. **Verificar:** Los ajustes deben mantenerse y aplicarse automáticamente

### **8. Verificar en Consola**

En la consola del navegador deberías ver mensajes como:

#### **✅ Cuando presionas teclas:**
```
🎯 TECLA DETECTADA: g, Modo edición: false, Bloque actual: 1/3
🔧 TECLA G - Decrementar duración bloque 1: -500ms
💾 Ajuste guardado: que_es_el_museo_escolar_0 = -500ms
```

#### **✅ Cuando se aplican ajustes:**
```
🎯 APLICANDO AJUSTE INMEDIATO AL BLOQUE ACTUAL EN REPRODUCCIÓN
⏱️ DURACIÓN ACTUALIZADA INMEDIATAMENTE: 2.5s para bloque 1
🎵 DURACIÓN AJUSTADA - Bloque 1: 3000ms → 2500ms (-500ms)
```

## 🐛 SOLUCIÓN DE PROBLEMAS

### **❌ No aparecen indicadores al presionar G/H**
- **Causa:** No hay respuesta reproduciéndose
- **Solución:** Haz una pregunta válida y espera a que aparezcan los subtítulos

### **❌ Las teclas G/H no funcionan**
- **Causa 1:** Estás en modo edición de subtítulos
- **Solución:** Sal del modo edición (Shift+Shift)

- **Causa 2:** No hay bloques de texto activos
- **Solución:** Asegúrate de que haya una respuesta reproduciéndose

- **Causa 3:** El foco está en un campo de texto
- **Solución:** Haz clic en un área vacía de la página

### **❌ No veo indicadores visuales**
- **Causa:** Los estados no se están actualizando
- **Solución:** Recarga la página y vuelve a intentar

### **❌ Los ajustes no persisten**
- **Causa:** Problema con localStorage
- **Solución:** Verifica en DevTools > Application > Local Storage

## 🧪 COMANDOS DE DEBUG

Ejecuta estos comandos en la consola para debug:

```javascript
// Verificar localStorage
debugManualSync.verificarLocalStorage();

// Simular ajustes de prueba
debugManualSync.simularAjustesManual();

// Limpiar ajustes
debugManualSync.limpiarAjustesPrueba();

// Verificar detección de teclas
debugManualSync.verificarDeteccionTeclas();

// Mostrar instrucciones
debugManualSync.mostrarInstrucciones();
```

## ✅ CRITERIOS DE ÉXITO

La funcionalidad está funcionando correctamente si:

1. **✅ Teclas detectadas:** G y H generan logs en consola
2. **✅ Indicadores aparecen:** Se muestran los indicadores visuales temporales al presionar G/H
3. **✅ Duración cambia:** Los bloques duran más/menos tiempo según los ajustes
4. **✅ Persistencia:** Los ajustes se mantienen al repetir preguntas
5. **✅ Guardado:** Los ajustes aparecen en localStorage
6. **✅ Interfaz limpia:** No hay indicadores permanentes en pantalla

## 🎯 PREGUNTAS ESPECÍFICAS PARA PROBAR

### **Prueba de Edición en Tiempo Real (1 minuto):**
1. Pregunta: "¡Hola!"
2. **Mientras se muestra el primer bloque**, presiona H
3. **Observa:** El bloque actual debe extenderse inmediatamente
4. **Verifica:** Debe aparecer el indicador "✅ Guardado para este bloque"
5. **Resultado:** El primer bloque durará más tiempo del programado originalmente

### **Prueba Rápida (2 minutos):**
1. Pregunta: "¡Hola!"
2. Presiona H dos veces durante el primer bloque
3. Presiona G una vez durante el segundo bloque
4. Espera a que termine la respuesta
5. Repite la pregunta "¡Hola!"
6. Verifica que los ajustes se mantienen en cada bloque específico

### **Prueba Completa (5 minutos):**
1. Prueba con diferentes secciones (Delfín, Museo, Escuela, Malvinas)
2. Aplica diferentes ajustes (G y H) en diferentes bloques
3. Verifica persistencia en todas las secciones
4. Revisa localStorage para confirmar guardado

## 📞 SOPORTE

Si la funcionalidad no funciona después de seguir estos pasos:

1. **Verifica la consola** para mensajes de error
2. **Revisa localStorage** para confirmar que se están guardando los datos
3. **Prueba en modo incógnito** para descartar problemas de caché
4. **Recarga la página** y vuelve a intentar

## 🎉 ¡FUNCIONALIDAD LISTA!

Si todos los pasos funcionan correctamente, la sincronización manual está completamente operativa y lista para usar en todas las secciones del proyecto ntucLearningHub.