# Script de Pruebas - Sistema Global de Estilos
## Chatbot Malvín - Modo de Edición Global/Individual

---

## 🎯 Objetivos de las Pruebas

1. **Verificar edición global**: Los cambios se aplican a todos los bloques de todas las respuestas
2. **Verificar edición individual**: Los cambios solo afectan al bloque actual
3. **Comprobar persistencia**: Los estilos globales se guardan en localStorage
4. **Validar texto limpio**: Sin sombras negras, solo texto blanco puro

---

## 🧪 Casos de Prueba

### Caso 1: Edición Global (Por Defecto)
**Objetivo**: Verificar que los cambios afectan a todos los bloques

**Pasos**:
1. Selecciona cualquier pregunta predefinida
2. Presiona `Shift + Shift` en el primer bloque
3. Verifica que aparece "🌍 GLOBAL" en el botón superior izquierdo
4. Cambia el tamaño de fuente a 2rem
5. Cambia la altura a 15rem
6. Presiona `Shift + Shift` para continuar
7. **Resultado esperado**: El siguiente bloque debe tener los mismos estilos

**Verificación adicional**:
- Sal de la respuesta y selecciona otra pregunta diferente
- **Resultado esperado**: Los nuevos estilos se aplican a todos los bloques de la nueva respuesta

---

### Caso 2: Cambio a Edición Individual
**Objetivo**: Verificar que solo el bloque actual se modifica

**Pasos**:
1. En modo edición, haz clic en el botón "🌍 GLOBAL"
2. Verifica que cambia a "📝 INDIVIDUAL"
3. Cambia el ancho a 1200px
4. Modifica el texto del bloque actual
5. Presiona `Shift + Shift` para continuar
6. **Resultado esperado**: El siguiente bloque mantiene los estilos globales originales

---

### Caso 3: Persistencia en localStorage
**Objetivo**: Verificar que los estilos globales se guardan

**Pasos**:
1. En modo global, cambia varios estilos:
   - Tamaño: 1.8rem
   - Ancho: 1000px
   - Altura: 12rem
2. Recarga completamente la página (F5)
3. Selecciona cualquier pregunta
4. **Resultado esperado**: Los estilos modificados se mantienen

**Verificación técnica**:
- Abre DevTools → Application → Local Storage
- Busca la clave `malvin_estilos_globales`
- Debe contener los valores modificados

---

### Caso 4: Texto Sin Sombras Negras
**Objetivo**: Verificar que se removieron las sombras negras

**Pasos**:
1. Selecciona cualquier pregunta con texto largo
2. Observa el texto de los subtítulos normales
3. **Resultado esperado**: 
   - Texto blanco puro
   - Sin sombras negras alrededor
   - Sin efectos de drop-shadow oscuros
   - Legibilidad clara

**Verificación técnica**:
- Inspecciona el elemento de texto con DevTools
- La propiedad `textShadow` debe ser `none`
- No debe haber `filter: drop-shadow` con valores oscuros

---

### Caso 5: Reset de Estilos
**Objetivo**: Verificar la funcionalidad de reset

**Pasos**:
1. **Modo Global**: Modifica varios estilos
2. Haz clic en el botón ↺ (reset)
3. **Resultado esperado**: Todos los valores vuelven a los por defecto
4. **Modo Individual**: Cambia a individual y modifica un bloque
5. Haz clic en ↺
6. **Resultado esperado**: Solo el bloque actual se resetea

---

### Caso 6: Indicadores Visuales
**Objetivo**: Verificar que los indicadores son claros

**Pasos**:
1. Entra en modo edición
2. **Verificar elementos visuales**:
   - Badge "🎨 EDITANDO BLOQUE X/Y" en la esquina
   - Botón "🌍 GLOBAL" o "📝 INDIVIDUAL" claramente visible
   - Mensaje informativo explicando el modo actual
   - Contador de bloque actual vs total

---

## ✅ Lista de Verificación

### Funcionalidad Global
- [ ] Los cambios de estilo se aplican a todos los bloques
- [ ] Los estilos persisten entre diferentes preguntas
- [ ] Los estilos se guardan en localStorage
- [ ] Los estilos se restauran al recargar la página

### Funcionalidad Individual
- [ ] Los cambios solo afectan al bloque actual
- [ ] Los demás bloques mantienen estilos globales
- [ ] Se puede editar texto independientemente
- [ ] Reset individual funciona correctamente

### Estilo de Texto
- [ ] Texto es blanco puro sin sombras negras
- [ ] Legibilidad es excelente
- [ ] Tipografía Inter se carga correctamente
- [ ] Suavizado de fuente está activo

### Interfaz de Usuario
- [ ] Botón de cambio global/individual es claro
- [ ] Indicadores visuales son informativos
- [ ] Botón reset funciona en ambos modos
- [ ] Mensajes explicativos son útiles

---

## 🔧 Debugging

### Si los estilos globales no persisten:
1. Verifica que localStorage esté habilitado
2. Revisa la consola de DevTools por errores
3. Confirma que la clave `malvin_estilos_globales` existe

### Si el texto tiene sombras negras:
1. Inspecciona el elemento con DevTools
2. Busca propiedades `textShadow` y `filter`
3. Verifica que `textShadow` sea `none`

### Si los modos no cambian correctamente:
1. Observa el estado de `edicionGlobal` en React DevTools
2. Verifica que los eventos de clic funcionen
3. Confirma que los estilos se aplican según el modo

---

## 📊 Métricas Esperadas

### Rendimiento
- Cambio entre modos: < 100ms
- Aplicación de estilos: Instantánea
- Carga desde localStorage: < 50ms

### Usabilidad
- Comprensión del modo actual: Inmediata
- Diferenciación global vs individual: Clara
- Persistencia de cambios: 100%

---

## 🎯 Casos Edge

### Caso A: localStorage Deshabilitado
- El sistema debe funcionar sin crashear
- Los estilos globales se mantienen durante la sesión
- Al recargar, vuelve a valores por defecto

### Caso B: Datos Corruptos en localStorage
- El sistema debe detectar datos inválidos
- Debe volver a valores por defecto automáticamente
- No debe mostrar errores al usuario

### Caso C: Valores Extremos
- Fuente muy pequeña (1rem) debe ser legible
- Fuente muy grande (3rem) no debe romper layout
- Posición muy alta (40rem) debe ser accesible

---

## 🚀 Resultados Esperados Finales

Al completar todas las pruebas exitosamente:

✅ **Sistema global funcional**: Los estilos se aplican universalmente  
✅ **Edición individual precisa**: Solo afecta al bloque seleccionado  
✅ **Persistencia confiable**: Los cambios se mantienen entre sesiones  
✅ **Texto limpio**: Sin sombras negras, máxima legibilidad  
✅ **Interfaz intuitiva**: Modos claramente diferenciados  
✅ **Rendimiento óptimo**: Sin impacto en la experiencia de usuario  

---

**Archivo de pruebas creado**: $(date)  
**Versión del sistema**: 3.1 - Sistema Global  
**Próxima actualización**: Al completar todas las verificaciones  

---

*"El sistema de edición global permite personalizar la experiencia visual de todos los subtítulos del chatbot Malvín, mientras que el modo individual ofrece precisión granular cuando se necesite."*