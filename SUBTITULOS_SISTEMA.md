# Sistema de Subtítulos Optimizado - Chatbot Malvín

## 📋 Descripción General

Este documento describe el sistema de subtítulos completamente reescrito para el chatbot Malvín del Museo Escolar. El sistema está diseñado para mostrar las respuestas predefinidas como subtítulos naturales debajo del modelo 3D, simulando el habla del delfín con timing realista.

## 🎯 Objetivos del Sistema

### Principales
- **Subtítulos naturales**: Presentar texto con ritmo de habla humana natural
- **Legibilidad óptima**: Máximo 2 líneas por bloque, sin corte de palabras
- **Sincronización perfecta**: Timing basado en velocidad de lectura real
- **Experiencia inmersiva**: Integración fluida con las animaciones del modelo 3D

### Secundarios
- **Responsividad completa**: Adaptación a diferentes tamaños de pantalla
- **Accesibilidad mejorada**: Alto contraste y legibilidad
- **Edición en tiempo real**: Capacidad de ajuste durante la reproducción

## 🔧 Características Técnicas

### Algoritmo de División de Texto

#### Función `createSubtitleSegments(text)`
```javascript
// Configuración optimizada para subtítulos
const MAX_CHARS_PER_LINE = 70;    // Caracteres por línea
const MAX_LINES_PER_BLOCK = 2;    // Máximo 2 líneas por bloque
const MAX_CHARS_PER_BLOCK = 140;  // Total de caracteres por bloque
```

#### Proceso de División
1. **Normalización**: Limpieza de espacios y formato de puntuación
2. **División por oraciones**: Separación en base a puntos, exclamaciones e interrogaciones
3. **Verificación de longitud**: Control de caracteres y líneas por bloque
4. **División inteligente**: Para oraciones largas, división por pausas naturales
5. **Optimización final**: Filtrado de segmentos vacíos

### Cálculo de Timing Natural

#### Función `calculateReadingTime(text)`
```javascript
const wordsPerMinute = 180;  // Velocidad promedio de lectura en voz alta
const words = text.split(" ").length;
const minutes = words / wordsPerMinute;
const seconds = Math.max(3, Math.min(8, minutes * 60));
```

#### Rangos de Tiempo
- **Mínimo**: 3 segundos (para textos muy cortos)
- **Máximo**: 8 segundos (para textos largos)
- **Base**: 180 palabras por minuto (velocidad natural de habla)

## 🎨 Diseño Visual

### Estilos por Defecto
```css
.subtitle-container {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: 500;
  letter-spacing: 0.3px;
}
```

### Configuración Visual
- **Ancho**: 900px (por defecto)
- **Tamaño de fuente**: 1.4rem
- **Interlineado**: 1.5
- **Posición**: 8rem desde abajo
- **Opacidad del fondo**: 85%

### Animaciones
- **Entrada**: `subtitleFadeIn` con escalado suave
- **Transiciones**: 0.2s ease para todos los cambios
- **Efectos**: Glow sutil en texto para mejor visibilidad

## 📱 Diseño Responsivo

### Breakpoints

#### Tablet (≤ 768px)
```css
.subtitle-container {
  font-size: clamp(1rem, 4vw, 1.4rem);
  max-width: 95vw;
  padding: 0.8rem 1rem;
}
```

#### Móvil (≤ 480px)
```css
.subtitle-container {
  font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  line-height: 1.3;
  padding: 0.6rem 0.8rem;
}
```

## ⚙️ Configuraciones Avanzadas

### Modo Edición - Controles Disponibles

| Control | Rango | Paso | Unidad | Descripción |
|---------|-------|------|--------|-------------|
| Ancho | 400-1200 | 50 | px | Anchura del área de subtítulos |
| Tamaño | 1-3 | 0.1 | rem | Tamaño de fuente |
| Interlineado | 1-2.5 | 0.1 | - | Espaciado entre líneas |
| Altura | 0-40 | 1 | rem | Posición vertical desde abajo |
| Margen | 0-10 | 0.5 | rem | Espaciado inferior adicional |
| Opacidad | 10%-100% | 10% | % | Transparencia del fondo |

### Estados del Sistema

#### Estado Normal
- Reproducción automática con timing calculado
- Estilos optimizados para legibilidad
- Animaciones suaves entre segmentos
- Posicionamiento fijo debajo del modelo 3D

#### Estado de Edición
- Pausa automática de reproducción
- Panel de controles deslizantes
- Vista previa en tiempo real
- Editor de texto integrado
- Botón de reset a valores por defecto

## 🔄 Flujo de Funcionamiento

### 1. Inicialización
```
Respuesta recibida → createSubtitleSegments() → Array de segmentos
```

### 2. Reproducción
```
Segmento actual → calculateReadingTime() → setTimeout() → Siguiente segmento
```

### 3. Finalización
```
Último segmento → Pausa de 4 segundos → Callback onRespuestaCompleta()
```

## 📊 Optimizaciones de Rendimiento

### División Inteligente
- **Evita cortes de palabras**: División solo en espacios y puntuación
- **Respeta pausas naturales**: Comas, dos puntos, punto y coma
- **Límites estrictos**: Control de líneas y caracteres por bloque

### Gestión de Memoria
- **useMemo para segmentos**: Recálculo solo cuando cambia la respuesta
- **useCallback para eventos**: Prevención de re-renders innecesarios
- **Cleanup automático**: Limpieza de timeouts al desmontar componente

### CSS Optimizado
- **will-change**: Propiedades específicas para animaciones
- **transform3d**: Activación de aceleración por hardware
- **font-display: swap**: Carga optimizada de fuentes

## 🎯 Casos de Uso Específicos

### Respuestas Cortas (< 50 caracteres)
- Un solo bloque
- Tiempo mínimo: 3 segundos
- Centrado perfecto

### Respuestas Medianas (50-200 caracteres)
- 1-2 bloques
- División por oraciones completas
- Timing proporcional

### Respuestas Largas (> 200 caracteres)
- Múltiples bloques
- División inteligente por pausas naturales
- Máximo 8 segundos por bloque

## 🔍 Comparación con Sistema Anterior

| Aspecto | Sistema Anterior | Sistema Nuevo |
|---------|------------------|---------------|
| División | Por caracteres fijos | Por oraciones + pausas naturales |
| Timing | Fijo (6 segundos) | Dinámico (3-8 segundos) |
| Legibilidad | Básica | Optimizada con efectos visuales |
| Responsividad | Limitada | Completa con clamp() |
| Edición | No disponible | Tiempo real con vista previa |
| Rendimiento | Básico | Optimizado con memoización |

## 🚀 Beneficios Implementados

### Para el Usuario
- **Lectura natural**: Ritmo similar al habla humana
- **Mejor comprensión**: Bloques de texto optimizados
- **Experiencia inmersiva**: Sincronización con animaciones 3D
- **Flexibilidad**: Edición en tiempo real cuando sea necesario

### Para el Desarrollador
- **Código mantenible**: Funciones especializadas y documentadas
- **Rendimiento optimizado**: Técnicas de React avanzadas
- **Escalabilidad**: Sistema modular y configurable
- **Debugging fácil**: Estados claros y logging detallado

## 📝 Mejoras Futuras

### Corto Plazo
- [ ] Detección automática de idioma para ajustar timing
- [ ] Presets de velocidad (lento, normal, rápido)
- [ ] Indicador visual de progreso mejorado

### Largo Plazo
- [ ] Integración con síntesis de voz
- [ ] Análisis de sentimiento para ajustar pausas
- [ ] Machine learning para optimización automática de división
- [ ] Soporte para múltiples idiomas

---

**Desarrollado por**: Equipo de Desarrollo del Museo Escolar
**Versión**: 2.0
**Última actualización**: Diciembre 2024
**Compatibilidad**: React 18+, ES2022+