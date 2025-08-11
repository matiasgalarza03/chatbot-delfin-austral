# 🎯 SISTEMA DE PREGUNTAS VISITADAS IMPLEMENTADO

## ✅ FUNCIONALIDAD COMPLETADA

He implementado un sistema completo para marcar visualmente las preguntas predefinidas que ya han sido presionadas/visitadas.

### 🔧 **COMPONENTES MODIFICADOS:**

#### **1. 📝 PreguntasScrollList.jsx**
- ✅ **Nuevos props agregados:**
  - `preguntasVisitadas` - Set con preguntas ya visitadas
  - `onPreguntaVisitada` - Callback para marcar pregunta como visitada

- ✅ **Estilo visual implementado:**
  - **Preguntas normales:** Fondo blanco, borde gris claro
  - **Preguntas visitadas:** Fondo gris claro, borde gris oscuro, texto gris, opacidad reducida

- ✅ **Lógica de marcado:**
  ```javascript
  onClick={() => {
    // Marcar pregunta como visitada
    onPreguntaVisitada(p.pregunta);
    onPreguntaSeleccionada(preguntaConRespuesta);
  }}
  ```

#### **2. 🏗️ ChatbotEscenario.jsx**
- ✅ **Estado agregado:**
  ```javascript
  const [preguntasVisitadas, setPreguntasVisitadas] = useState(new Set());
  ```

- ✅ **Función de marcado:**
  ```javascript
  const handlePreguntaVisitada = useCallback((pregunta) => {
    setPreguntasVisitadas(prev => new Set([...prev, pregunta]));
  }, []);
  ```

- ✅ **Props pasados a PreguntasScrollList:**
  ```javascript
  preguntasVisitadas={preguntasVisitadas}
  onPreguntaVisitada={handlePreguntaVisitada}
  ```

- ✅ **Reseteo en botón reiniciar:**
  ```javascript
  const handleReset = () => {
    // ... otros resets ...
    setPreguntasVisitadas(new Set());
  };
  ```

### 🎨 **ESTILOS VISUALES:**

#### **Pregunta Normal:**
```javascript
{
  backgroundColor: "#ffffff",
  border: "2px solid #e5e7eb", 
  color: "#374151",
  // ... estilos normales
}
```

#### **Pregunta Visitada:**
```javascript
{
  backgroundColor: "#f3f4f6", // Gris claro
  border: "2px solid #d1d5db", // Borde gris más oscuro
  color: "#6b7280", // Texto gris
  opacity: "0.75", // Ligeramente transparente
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)", // Sombra más sutil
}
```

### 🔄 **FLUJO DE FUNCIONAMIENTO:**

1. **Al hacer clic en una pregunta:**
   - Se marca como visitada en el Set
   - Se aplica el estilo visual oscurecido
   - Se reproduce la respuesta normalmente

2. **Al volver a la lista:**
   - Las preguntas visitadas se ven oscurecidas y tenues
   - Las no visitadas mantienen su estilo normal

3. **Al presionar el botón reiniciar:**
   - Se resetea el Set de preguntas visitadas
   - Todas las preguntas vuelven al estilo normal

### 🎯 **APLICACIÓN UNIVERSAL:**

✅ **Funciona en todas las secciones:**
- Delfín Austral
- Escuela Secundaria N° 3 Malvinas Argentinas  
- Museo Escolar
- Malvinas (todas las subsecciones)

✅ **Persistencia durante la sesión:**
- Las preguntas visitadas se mantienen marcadas
- Solo se resetean con el botón reiniciar

### 🔍 **LOGS DE DEBUG:**

```javascript
// Al marcar pregunta como visitada:
🔍 Marcando pregunta como visitada: ¿Cuál es la historia territorial de las Malvinas antes de 1982?

// Al resetear:
🔄 ✅ Preguntas visitadas reseteadas
```

### ✅ **RESULTADO FINAL:**

**El sistema está completamente implementado y funcional:**

- 🎨 **Indicación visual clara** de preguntas ya visitadas
- 🔄 **Reseteo completo** con el botón reiniciar
- 🌐 **Aplicación universal** en todas las secciones
- 💾 **Persistencia** durante la sesión de usuario
- 🎯 **UX mejorada** - El usuario puede ver fácilmente qué preguntas ya revisó

**La funcionalidad está lista para usar y mejora significativamente la experiencia del usuario.**