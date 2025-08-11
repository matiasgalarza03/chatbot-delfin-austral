/**
 * Detector simplificado de multimedia que funciona con la estructura real del proyecto
 */

// Mapeo directo basado en los archivos que sabemos que existen
const KNOWN_MULTIMEDIA_LOCATIONS = {
  // Grupo A - Delfín Austral
  'A': {
    'naturaleza': true, // Tiene archivos de delfín austral
    'presentacion': false,
    'proposito': false,
    'funcionalidades': false
  },
  
  // Grupo B - Escuela Secundaria
  'B': {
    'historia_ubicacion': true, // Tiene Historia-1.jpeg, Historia-2.jpeg
    'logo_bandera': true, // Tiene Logo-1.jpeg, Bandera-1.jpeg
    'nombre_proyectos': false,
    'equipo_directivo': false,
    'espacios_educativos': false
  },
  
  // Grupo C - Museo Escolar
  'C': {
    'museo_escolar': false,
    'objetivos_museo': false,
    'actividades_museo': false,
    'recursos_museo': false
  },
  
  // Grupo D - Malvinas
  'D': {
    'flora_fauna': true, // Sabemos que tiene archivos de flora y fauna
    'contexto_geografico': true,
    'desarrollo_conflicto': true,
    'legado_memoria': false
  }
};

/**
 * Verifica si un grupo/tema tiene multimedia disponible
 * @param {string} grupoId - ID del grupo (A, B, C, D)
 * @param {string} temaId - ID del tema (opcional)
 * @returns {boolean} - True si tiene multimedia
 */
export function hasMultimediaForTopic(grupoId, temaId = null) {
  // Si no hay tema específico, verificar si el grupo tiene algún multimedia
  if (!temaId || temaId === grupoId) {
    const grupoData = KNOWN_MULTIMEDIA_LOCATIONS[grupoId];
    if (!grupoData) return false;
    
    // Verificar si algún tema del grupo tiene multimedia
    return Object.values(grupoData).some(hasMedia => hasMedia);
  }
  
  // Verificar tema específico
  const grupoData = KNOWN_MULTIMEDIA_LOCATIONS[grupoId];
  if (!grupoData) return false;
  
  return grupoData[temaId] === true;
}

/**
 * Obtiene todos los temas con multimedia para un grupo
 * @param {string} grupoId - ID del grupo
 * @returns {Array} - Array de IDs de temas que tienen multimedia
 */
export function getTopicsWithMultimedia(grupoId) {
  const grupoData = KNOWN_MULTIMEDIA_LOCATIONS[grupoId];
  if (!grupoData) return [];
  
  return Object.entries(grupoData)
    .filter(([tema, hasMedia]) => hasMedia)
    .map(([tema]) => tema);
}

/**
 * Actualiza dinámicamente la disponibilidad de multimedia
 * @param {string} grupoId - ID del grupo
 * @param {string} temaId - ID del tema
 * @param {boolean} hasMedia - Si tiene multimedia
 */
export function updateMultimediaAvailability(grupoId, temaId, hasMedia) {
  if (!KNOWN_MULTIMEDIA_LOCATIONS[grupoId]) {
    KNOWN_MULTIMEDIA_LOCATIONS[grupoId] = {};
  }
  KNOWN_MULTIMEDIA_LOCATIONS[grupoId][temaId] = hasMedia;
}