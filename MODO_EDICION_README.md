# Modo de Edición Temporal - Respuestas Predefinidas

## 📝 Descripción

Este documento describe la funcionalidad de **Modo de Edición Temporal** implementada en el componente `RespuestaPredefinida.jsx`. Esta característica permite editar dinámicamente el aspecto y contenido de las respuestas predefinidas durante la ejecución del chatbot.

## 🎯 Características Implementadas

### 1. **Cambio de Color de Texto**
- El texto de las respuestas predefinidas ahora se muestra en **color blanco**
- Se agregó una sombra de texto (`textShadow`) para mejorar la legibilidad
- Mejor contraste visual sobre diferentes fondos

### 2. **Activación del Modo Edición**
- **Activación**: Presionar la tecla `Shift` **dos veces consecutivas** (doble Shift)
- **Desactivación**: Presionar `Shift + Shift` nuevamente
- **Tiempo límite**: Si no se presiona el segundo Shift en 500ms, se resetea el contador

### 3. **Pausa Automática de Reproducción**
- Cuando se activa el modo edición, se **pausa automáticamente** la reproducción del texto
- La animación de avance de bloques se detiene temporalmente
- Al salir del modo edición, se puede reanudar la reproducción normal

## 🛠️ Controles de Edición

### Controles Disponibles

1. **Control de Ancho**
   - Rango: 400px - 1200px
   - Control deslizante para ajuste dinámico
   - Vista previa en tiempo real

2. **Control de Tamaño de Fuente**
   - Rango: 1rem - 3rem
   - Incrementos de 0.1rem
   - Aplicación inmediata

3. **Control de Interlineado**
   - Rango: 1.0 - 2.5
   - Incrementos de 0.1
   - Mejora la legibilidad del texto

4. **Control de Posición Vertical**
   - Rango: 0rem - 40rem desde la parte inferior
   - Permite mover el texto hacia arriba o abajo
   - Útil para evitar que el texto tape el modelo 3D

5. **Control de Margen Inferior**
   - Rango: 0rem - 10rem
   - Ajusta el espaciado entre el texto y otros elementos
   - Incrementos de 0.5rem

6. **Control de Opacidad del Fondo**
   - Rango: 10% - 100%
   - Controla la transparencia del fondo del modo edición
   - Permite mejor visibilidad del contenido de fondo

### Área de Edición de Texto

- **Caja de texto expandible** (textarea)
- **Redimensionable verticalmente**
- **Vista previa en tiempo real** del texto editado
- **Fondo semitransparente** con efecto blur
- **Bordes destacados** en color naranja (#ff6b35)
- **Texto editado se muestra instantáneamente** en la vista previa
- **Preserva formato** con saltos de línea y espaciado

### Botón de Reset

- **Posición**: Esquina superior derecha del panel de controles
- **Función**: Restaura todos los valores a sus configuraciones por defecto
- **Indicador visual**: Icono circular naranja con símbolo ↺
- **Efecto**: Resetea tanto estilos como texto editado

## 🎨 Indicadores Visuales

### Indicador de Estado
- **Posición**: Esquina superior derecha
- **Apariencia**: Badge naranja con animación pulsante
- **Texto**: "🎨 MODO EDICIÓN ACTIVO"
- **Animación**: Efecto pulse cada 2 segundos

### Fondo del Contenedor
- **Modo Normal**: Fondo transparente
- **Modo Edición**: Gradiente oscuro con bordes redondeados
- **Transiciones suaves** entre estados

## 📋 Instrucciones de Uso

### Paso a Paso

1. **Activar Modo Edición**
   ```
   Presiona: Shift + Shift (rápidamente)
   ```

2. **Editar Contenido**
   - Usa los controles deslizantes para ajustar dimensiones, tipografía y posición
   - Modifica el texto en el área de edición
   - **Vista previa inmediata**: Los cambios se ven instantáneamente en la vista previa
   - **Posicionamiento**: Ajusta la altura para evitar que tape el modelo 3D
   - **Reset rápido**: Usa el botón ↺ para volver a valores por defecto

3. **Desactivar Modo Edición**
   ```
   Presiona: Shift + Shift (nuevamente)
   ```

## 🔧 Detalles Técnicos

### Estados del Componente
```javascript
const [modoEdicion, setModoEdicion] = useState(false);
const [textoEditado, setTextoEditado] = useState("");
const [estilosEditables, setEstilosEditables] = useState({
  width: "800px",
  height: "auto", 
  fontSize: "1.65rem",
  lineHeight: "1.6",
  bottom: "2rem",
  marginBottom: "1rem",
  backgroundOpacity: "0.8",
});
```

### Detección de Doble Shift
```javascript
const handleKeyDown = useCallback((event) => {
  if (event.key === "Shift") {
    shiftPressCount.current += 1;
    // Lógica de detección de doble pulsación
  }
}, [currentBlock]);
```

### Pausa de Reproducción
- La lógica de avance automático incluye verificación de `modoEdicion`
- Cuando está activo, los timeouts se cancelan automáticamente
- Al desactivar, se reanuda el flujo normal

## 🎯 Beneficios

1. **Flexibilidad Visual**: Ajuste dinámico sin recargar la aplicación
2. **Experiencia de Usuario**: Edición intuitiva con controles visuales
3. **Feedback Inmediato**: Los cambios se ven al instante con vista previa
4. **Control Total de Posicionamiento**: Evita interferencias con elementos 3D
5. **No Invasivo**: Se activa solo cuando se necesita
6. **Preserva Funcionalidad**: No interfiere con el flujo normal del chatbot
7. **Reset Rápido**: Vuelve a configuración por defecto con un clic

## 🚀 Futuras Mejoras

- [ ] Guardar preferencias de estilo en localStorage
- [ ] Exportar configuraciones de estilo
- [ ] Más opciones de tipografía (fuente, peso, etc.)
- [ ] Presets de estilos predefinidos
- [ ] Modo de edición para otros componentes
- [ ] Control de alineación de texto (izquierda, centro, derecha)
- [ ] Efectos de texto adicionales (sombras, bordes)
- [ ] Atajos de teclado para ajustes rápidos

---

**Desarrollado por**: Equipo de Desarrollo
**Versión**: 1.0
**Fecha**: Diciembre 2024