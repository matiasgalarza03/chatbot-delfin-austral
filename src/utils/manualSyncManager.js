// 🎯 SISTEMA DE SINCRONIZACIÓN MANUAL - TECLAS G y H
// Permite ajustar manualmente la duración de cada bloque de subtítulos

// Clave para localStorage donde se guardan los ajustes manuales
const MANUAL_SYNC_KEY = "malvin_manual_sync_adjustments";

// Secciones protegidas que deben preservar sus ajustes manuales
const SECCIONES_PROTEGIDAS = [
  "delfin_austral",
  "escuela_secundaria", 
  "museo_escolar",
  "malvinas_contexto_geografico",
  "malvinas_impacto_social",
  "malvinas_legado_actual"
];

// Importar ajustes permanentes
let ajustesPermanentes = null;
try {
  // En entorno de navegador, cargar desde archivo JSON
  if (typeof window !== 'undefined') {
    fetch('/src/data/AjustesManualesPermanentes.json')
      .then(response => response.json())
      .then(data => {
        ajustesPermanentes = data.ajustes_preservados;
        console.log('✅ Ajustes permanentes cargados:', Object.keys(ajustesPermanentes));
      })
      .catch(err => console.log('ℹ️ Archivo de ajustes permanentes no encontrado, usando localStorage'));
  }
} catch (error) {
  console.log('ℹ️ Usando solo localStorage para ajustes manuales');
}

// Incremento/decremento por cada pulsación de tecla (en milisegundos)
const ADJUSTMENT_STEP = 500; // 0.5 segundos por pulsación

/**
 * Cargar ajustes manuales desde localStorage
 * @returns {Object} Objeto con ajustes por pregunta y bloque
 */
function cargarAjustesManuales() {
  try {
    const ajustesGuardados = localStorage.getItem(MANUAL_SYNC_KEY);
    let ajustes = ajustesGuardados ? JSON.parse(ajustesGuardados) : {};
    
    // Fusionar con ajustes permanentes para secciones protegidas
    if (ajustesPermanentes) {
      SECCIONES_PROTEGIDAS.forEach(seccion => {
        if (ajustesPermanentes[seccion] && ajustesPermanentes[seccion].ajustes) {
          // Preservar ajustes permanentes, localStorage tiene prioridad si existe
          Object.keys(ajustesPermanentes[seccion].ajustes).forEach(clave => {
            if (!ajustes[clave]) {
              ajustes[clave] = ajustesPermanentes[seccion].ajustes[clave];
              console.log(`🔒 Ajuste permanente cargado para ${seccion}: ${clave}`);
            }
          });
        }
      });
    }
    
    return ajustes;
  } catch (error) {
    console.warn("Error cargando ajustes manuales desde localStorage:", error);
  }
  return {};
}

/**
 * Guardar ajustes manuales en localStorage Y permanentemente en archivos
 * @param {Object} ajustes - Objeto con ajustes por pregunta y bloque
 */
function guardarAjustesManuales(ajustes) {
  try {
    localStorage.setItem(MANUAL_SYNC_KEY, JSON.stringify(ajustes));
    console.log("💾 Ajustes manuales guardados en localStorage:", ajustes);
    
    // Guardar también permanentemente en archivos (con debounce)
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      guardarAjustesPermanentementeEnArchivos(ajustes);
    }, 1000); // Esperar 1 segundo antes de guardar en archivos
  } catch (error) {
    console.warn("Error guardando ajustes manuales en localStorage:", error);
  }
}

/**
 * Guardar ajustes permanentemente en archivos del proyecto
 * @param {Object} ajustes - Objeto con ajustes por pregunta y bloque
 */
async function guardarAjustesPermanentementeEnArchivos(ajustes) {
  try {
    console.log("🔄 Guardando ajustes de sincronización permanentemente...");
    
    const response = await fetch('http://localhost:5005/api/guardar-sincronizacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ajustes,
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Ajustes de sincronización guardados permanentemente:', result);
    } else {
      console.warn('⚠️ No se pudieron guardar ajustes permanentemente (servidor no disponible)');
    }
  } catch (error) {
    console.warn('⚠️ Error al guardar ajustes permanentemente:', error.message);
  }
}

/**
 * Generar clave única para una pregunta específica
 * @param {Object} pregunta - Objeto de pregunta
 * @returns {string} Clave única
 */
function generarClavePregunta(pregunta) {
  if (!pregunta || !pregunta.pregunta) {
    return "pregunta_desconocida";
  }
  
  // Crear una clave única basada en el texto de la pregunta
  return pregunta.pregunta
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
    .substring(0, 50); // Limitar longitud
}

/**
 * Obtener el ajuste manual para un bloque específico
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} bloqueIndex - Índice del bloque
 * @returns {number} Ajuste en milisegundos (puede ser negativo)
 */
function obtenerAjusteBloque(pregunta, bloqueIndex) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  if (ajustes[clavePregunta] && ajustes[clavePregunta][bloqueIndex] !== undefined) {
    return ajustes[clavePregunta][bloqueIndex];
  }
  
  return 0; // Sin ajuste por defecto
}

/**
 * Aplicar ajuste manual a un bloque específico
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} bloqueIndex - Índice del bloque
 * @param {number} ajuste - Ajuste en milisegundos
 */
function aplicarAjusteBloque(pregunta, bloqueIndex, ajuste) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  // Inicializar estructura si no existe
  if (!ajustes[clavePregunta]) {
    ajustes[clavePregunta] = {};
  }
  
  // Aplicar el ajuste
  ajustes[clavePregunta][bloqueIndex] = ajuste;
  
  // Guardar en localStorage
  guardarAjustesManuales(ajustes);
  
  console.log(`🎯 Ajuste aplicado - Pregunta: ${clavePregunta}, Bloque: ${bloqueIndex}, Ajuste: ${ajuste}ms`);
}

/**
 * Incrementar duración del bloque actual (Tecla H)
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} bloqueIndex - Índice del bloque actual
 * @returns {number} Nuevo ajuste total
 */
function incrementarDuracion(pregunta, bloqueIndex) {
  const ajusteActual = obtenerAjusteBloque(pregunta, bloqueIndex);
  const nuevoAjuste = ajusteActual + ADJUSTMENT_STEP;
  
  aplicarAjusteBloque(pregunta, bloqueIndex, nuevoAjuste);
  
  console.log(`⬆️ INCREMENTAR DURACIÓN - Bloque ${bloqueIndex + 1}: +${ADJUSTMENT_STEP}ms (Total: ${nuevoAjuste}ms)`);
  
  return nuevoAjuste;
}

/**
 * Decrementar duración del bloque actual (Tecla G)
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} bloqueIndex - Índice del bloque actual
 * @returns {number} Nuevo ajuste total
 */
function decrementarDuracion(pregunta, bloqueIndex) {
  const ajusteActual = obtenerAjusteBloque(pregunta, bloqueIndex);
  const nuevoAjuste = ajusteActual - ADJUSTMENT_STEP;
  
  aplicarAjusteBloque(pregunta, bloqueIndex, nuevoAjuste);
  
  console.log(`⬇️ DECREMENTAR DURACIÓN - Bloque ${bloqueIndex + 1}: -${ADJUSTMENT_STEP}ms (Total: ${nuevoAjuste}ms)`);
  
  return nuevoAjuste;
}

/**
 * Calcular duración ajustada para un bloque
 * @param {number} duracionOriginal - Duración original en milisegundos
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} bloqueIndex - Índice del bloque
 * @returns {number} Duración ajustada en milisegundos
 */
function calcularDuracionAjustada(duracionOriginal, pregunta, bloqueIndex) {
  const ajuste = obtenerAjusteBloque(pregunta, bloqueIndex);
  const duracionAjustada = Math.max(1000, duracionOriginal + ajuste); // Mínimo 1 segundo
  
  if (ajuste !== 0) {
    console.log(`🎵 DURACIÓN AJUSTADA - Bloque ${bloqueIndex + 1}: ${duracionOriginal}ms → ${duracionAjustada}ms (${ajuste > 0 ? '+' : ''}${ajuste}ms)`);
  }
  
  return duracionAjustada;
}

/**
 * Resetear todos los ajustes para una pregunta específica
 * @param {Object} pregunta - Objeto de pregunta
 */
function resetearAjustesPregunta(pregunta) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  if (ajustes[clavePregunta]) {
    delete ajustes[clavePregunta];
    guardarAjustesManuales(ajustes);
    console.log(`🔄 RESETEAR AJUSTES - Pregunta: ${clavePregunta}`);
  }
}

/**
 * Obtener estadísticas de ajustes para una pregunta
 * @param {Object} pregunta - Objeto de pregunta
 * @returns {Object} Estadísticas de ajustes
 */
function obtenerEstadisticasAjustes(pregunta) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  if (!ajustes[clavePregunta]) {
    return { totalBloques: 0, bloquesAjustados: 0, ajustePromedio: 0 };
  }
  
  const bloquesAjustados = Object.keys(ajustes[clavePregunta]);
  const totalAjuste = Object.values(ajustes[clavePregunta]).reduce((sum, ajuste) => sum + ajuste, 0);
  
  return {
    totalBloques: bloquesAjustados.length,
    bloquesAjustados: bloquesAjustados.length,
    ajustePromedio: bloquesAjustados.length > 0 ? totalAjuste / bloquesAjustados.length : 0,
    ajustes: ajustes[clavePregunta]
  };
}

/**
 * Incrementar duración de TODA la respuesta (todos los bloques)
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} totalBloques - Total de bloques en la respuesta
 * @returns {number} Nuevo ajuste global en milisegundos
 */
function incrementarDuracionGlobal(pregunta, totalBloques) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  if (!ajustes[clavePregunta]) {
    ajustes[clavePregunta] = {};
  }
  
  // Aplicar incremento a todos los bloques
  for (let i = 0; i < totalBloques; i++) {
    const ajusteActual = ajustes[clavePregunta][i] || 0;
    ajustes[clavePregunta][i] = ajusteActual + ADJUSTMENT_STEP;
  }
  
  guardarAjustesManuales(ajustes);
  
  console.log(`⬆️ INCREMENTAR GLOBAL - Pregunta: ${clavePregunta}, Bloques: ${totalBloques}, Ajuste: +${ADJUSTMENT_STEP}ms por bloque`);
  return ADJUSTMENT_STEP;
}

/**
 * Decrementar duración de TODA la respuesta (todos los bloques)
 * @param {Object} pregunta - Objeto de pregunta
 * @param {number} totalBloques - Total de bloques en la respuesta
 * @returns {number} Nuevo ajuste global en milisegundos
 */
function decrementarDuracionGlobal(pregunta, totalBloques) {
  const ajustes = cargarAjustesManuales();
  const clavePregunta = generarClavePregunta(pregunta);
  
  if (!ajustes[clavePregunta]) {
    ajustes[clavePregunta] = {};
  }
  
  // Aplicar decremento a todos los bloques
  for (let i = 0; i < totalBloques; i++) {
    const ajusteActual = ajustes[clavePregunta][i] || 0;
    ajustes[clavePregunta][i] = ajusteActual - ADJUSTMENT_STEP;
  }
  
  guardarAjustesManuales(ajustes);
  
  console.log(`⬇️ DECREMENTAR GLOBAL - Pregunta: ${clavePregunta}, Bloques: ${totalBloques}, Ajuste: -${ADJUSTMENT_STEP}ms por bloque`);
  return -ADJUSTMENT_STEP;
}

// Exportar todas las funciones
/**
 * Exportar ajustes actuales para preservarlos permanentemente
 * @returns {Object} Ajustes formateados para el archivo permanente
 */
function exportarAjustesParaPreservacion() {
  const ajustes = cargarAjustesManuales();
  const ajustesParaPreservar = {
    delfin_austral: { ajustes: {} },
    escuela_secundaria: { ajustes: {} },
    museo_escolar: { ajustes: {} },
    malvinas_contexto_geografico: { ajustes: {} },
    malvinas_impacto_social: { ajustes: {} },
    malvinas_legado_actual: { ajustes: {} }
  };
  
  // Filtrar ajustes por sección
  Object.keys(ajustes).forEach(clave => {
    // Determinar a qué sección pertenece cada clave
    if (clave.includes('delfin') || clave.includes('austral')) {
      ajustesParaPreservar.delfin_austral.ajustes[clave] = ajustes[clave];
    } else if (clave.includes('escuela') || clave.includes('secundaria')) {
      ajustesParaPreservar.escuela_secundaria.ajustes[clave] = ajustes[clave];
    } else if (clave.includes('museo')) {
      ajustesParaPreservar.museo_escolar.ajustes[clave] = ajustes[clave];
    } else if (clave.includes('geografico') || clave.includes('historico')) {
      ajustesParaPreservar.malvinas_contexto_geografico.ajustes[clave] = ajustes[clave];
    } else if (clave.includes('impacto') || clave.includes('social')) {
      ajustesParaPreservar.malvinas_impacto_social.ajustes[clave] = ajustes[clave];
    } else if (clave.includes('legado') || clave.includes('actual')) {
      ajustesParaPreservar.malvinas_legado_actual.ajustes[clave] = ajustes[clave];
    }
  });
  
  console.log('📦 Ajustes exportados para preservación:', ajustesParaPreservar);
  return ajustesParaPreservar;
}

/**
 * Verificar si una pregunta pertenece a una sección protegida
 * @param {Object} pregunta - Objeto de pregunta
 * @returns {boolean} True si la sección está protegida
 */
function esSectionProtegida(pregunta) {
  const clave = generarClavePregunta(pregunta);
  return SECCIONES_PROTEGIDAS.some(seccion => 
    clave.includes(seccion.replace('_', '')) || 
    clave.includes(seccion)
  );
}

const manualSyncManager = {
  cargarAjustesManuales,
  guardarAjustesManuales,
  generarClavePregunta,
  obtenerAjusteBloque,
  aplicarAjusteBloque,
  incrementarDuracion,
  decrementarDuracion,
  incrementarDuracionGlobal,
  decrementarDuracionGlobal,
  calcularDuracionAjustada,
  resetearAjustesPregunta,
  obtenerEstadisticasAjustes,
  exportarAjustesParaPreservacion,
  esSectionProtegida,
  ADJUSTMENT_STEP,
  SECCIONES_PROTEGIDAS
};

export default manualSyncManager;