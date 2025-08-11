// 🎵 Sistema de gestión de audios para respuestas predefinidas
// Este módulo maneja la reproducción automática de audios sincronizados con las respuestas

/**
 * Mapeo de preguntas/respuestas a archivos de audio
 * Estructura: categoria -> identificador -> archivo
 */
const AUDIO_MAPPING = {
  // Grupo A - Delfín Austral (✅ ARCHIVOS DISPONIBLES)
  delfin_austral: {
    "presentacion": "01_presentacion.mp3",
    "naturaleza": "02_naturaleza.mp3", 
    "proposito": "03_proposito.mp3",
    "funcionalidades": "04_funcionalidades.mp3"
  },

  // Grupo B - Escuela Secundaria (✅ ARCHIVOS DISPONIBLES)
  escuela_secundaria: {
    "historia_ubicacion": "01_historia_ubicacion.mp3",
    "nombre_proyectos": "02_nombre_proyectos.mp3",
    "logo_bandera": "03_logo_bandera.mp3",
    "equipo_directivo": "04_equipo_directivo.mp3",
    "espacios_educativos": "05_espacios_educativos.mp3"
  },

  // Grupo C - Museo Escolar (✅ ARCHIVOS DISPONIBLES)
  museo_escolar: {
    "definicion": "01_definicion.mp3",
    "objetivos": "02_objetivos.mp3",
    "actividades": "03_actividades.mp3",
    "recursos": "04_recursos.mp3"
  },

  // Grupo D - Malvinas (subcategorías)
  malvinas: {
    contexto_geografico: {
      "descubrimiento": "descubrimiento.mp3",
      "bandera": "bandera.mp3", 
      "fundador": "fundador.mp3",
      "actividades_economicas": "actividades_economicas.mp3",
      "flora_fauna": "flora_fauna.mp3",
      "sectores_geograficos": "sectores_geograficos.mp3"
    },
    conflicto_armado: {
      "inicio_conflicto": "inicio_conflicto.mp3",
      "operacion_rosario": "operacion_rosario.mp3",
      "desembarco_puerto_argentino": "desembarco_puerto_argentino.mp3",
      "hundimiento_belgrano": "hundimiento_belgrano.mp3",
      "hundimiento_sheffield": "hundimiento_sheffield.mp3",
      "batalla_san_carlos": "batalla_san_carlos.mp3",
      "hundimiento_coventry": "hundimiento_coventry.mp3",
      "batalla_darwin": "batalla_darwin.mp3",
      "combate_longdon": "combate_longdon.mp3",
      "defensa_puerto_argentino": "defensa_puerto_argentino.mp3",
      "armamento_argentino": "armamento_argentino.mp3",
      "armamento_ingles": "armamento_ingles.mp3",
      "heroes_guerra": "heroes_guerra.mp3",
      "perros_guerra": "perros_guerra.mp3"
    },
    impacto_social: {
      "medios_comunicacion": "medios_comunicacion.mp3",
      "donaciones_movilizacion": "donaciones_movilizacion.mp3",
      "cartas_ninos": "cartas_ninos.mp3",
      "cartas_veteranos": "cartas_veteranos.mp3",
      "cartas_caidos": "cartas_caidos.mp3",
      "cartas_familiares": "cartas_familiares.mp3"
    },
    legado_actual: {
      "malvinas_actualidad": "malvinas_actualidad.mp3",
      "cementerio_darwin": "cementerio_darwin.mp3"
    },
    recursos_adicionales: {
      "recursos_extra": "recursos_adicionales.mp3"
    }
  }
};

/**
 * Clase para gestionar la reproducción de audios
 */
class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.8;
    this.audioCache = new Map();
  }

  /**
   * Busca el archivo de audio correspondiente a una pregunta/respuesta
   * @param {string} categoria - Categoría del audio (ui_basicas, delfin_austral, etc.)
   * @param {string} identificador - Identificador específico o pregunta
   * @param {string} subcategoria - Subcategoría para Malvinas (opcional)
   * @returns {string|null} - Ruta del archivo de audio o null si no existe
   */
  getAudioPath(categoria, identificador, subcategoria = null) {
    try {
      let mapping = AUDIO_MAPPING[categoria];
      
      if (!mapping) {
        console.warn(`🎵 Categoría de audio no encontrada: ${categoria}`);
        return null;
      }

      // Para Malvinas, usar subcategoría
      if (categoria === 'malvinas' && subcategoria) {
        mapping = mapping[subcategoria];
        if (!mapping) {
          console.warn(`🎵 Subcategoría de Malvinas no encontrada: ${subcategoria}`);
          return null;
        }
      }

      const audioFile = mapping[identificador];
      if (!audioFile) {
        console.warn(`🎵 Audio no encontrado para: ${categoria}/${subcategoria || ''}/${identificador}`);
        return null;
      }

      // Construir ruta completa
      const basePath = '/audios/respuestas_predefinidas';
      const categoryPath = categoria === 'malvinas' && subcategoria 
        ? `${categoria}/${subcategoria}` 
        : categoria;
      
      return `${basePath}/${categoryPath}/${audioFile}`;
    } catch (error) {
      console.error('🎵 Error al buscar audio:', error);
      return null;
    }
  }

  /**
   * Reproduce un audio específico
   * @param {string} audioPath - Ruta del archivo de audio
   * @param {function} onEnded - Callback cuando termina el audio
   * @param {function} onError - Callback en caso de error
   * @returns {Promise<boolean>} - true si se reproduce correctamente
   */
  async playAudio(audioPath, onEnded = null, onError = null, onStart = null) {
    // 🚫 SISTEMA DESHABILITADO - Audio manejado por RespuestaPredefinida.jsx
    console.log('🚫 audioManager.playAudio DESHABILITADO - usando sistema simplificado');
    return;
    // DETENER CUALQUIER AUDIO ANTERIOR ANTES DE REPRODUCIR UNO NUEVO
    console.log('🔇 Deteniendo audio anterior antes de reproducir nuevo...');
    this.stopCurrentAudio();
    
    // Esperar un momento para asegurar detención completa
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Guardar callback de inicio
    this.onAudioStart = onStart;
    try {
      // Detener audio actual si existe
      this.stopCurrentAudio();

      console.log(`🎵 Reproduciendo audio: ${audioPath}`);

      // Verificar si el audio está en caché
      let audio = this.audioCache.get(audioPath);
      
      if (!audio) {
        // Crear nuevo elemento de audio
        audio = new Audio(audioPath);
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        // Cachear el audio
        this.audioCache.set(audioPath, audio);
      }

      // Configurar eventos
      audio.onended = () => {
        console.log(`🎵 Audio terminado: ${audioPath}`);
        this.isPlaying = false;
        this.currentAudio = null;
        if (onEnded) onEnded();
      };

      audio.onerror = (error) => {
        console.error(`🎵 Error reproduciendo audio: ${audioPath}`, error);
        this.isPlaying = false;
        this.currentAudio = null;
        if (onError) onError(error);
      };

      // 🎵 EVENTO CUANDO EL AUDIO REALMENTE INICIA
      audio.onplay = () => {
        console.log(`🎵 ✅ AUDIO INICIADO: ${audioPath} - Sincronizando subtítulos`);
        if (this.onAudioStart) this.onAudioStart();
      };

      // Reproducir
      this.currentAudio = audio;
      this.isPlaying = true;
      
      await audio.play();
      return true;

    } catch (error) {
      console.error(`🎵 Error al reproducir audio: ${audioPath}`, error);
      this.isPlaying = false;
      this.currentAudio = null;
      if (onError) onError(error);
      return false;
    }
  }

  /**
   * Detiene el audio actual
   */
  stopCurrentAudio() {
    console.log('🔇 INICIANDO DETENCIÓN FORZADA DE AUDIO');
    
    if (this.currentAudio) {
      console.log('🔇 Audio encontrado - Deteniendo...');
      
      try {
        // Pausar inmediatamente
        this.currentAudio.pause();
        console.log('🔇 Audio pausado');
        
        // Resetear tiempo
        this.currentAudio.currentTime = 0;
        console.log('🔇 Tiempo reseteado');
        
        // Limpiar TODOS los event listeners
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.onloadstart = null;
        this.currentAudio.oncanplay = null;
        this.currentAudio.onloadeddata = null;
        this.currentAudio.onloadedmetadata = null;
        this.currentAudio.onplay = null;
        this.currentAudio.onpause = null;
        console.log('🔇 Event listeners limpiados');
        
        // Forzar detención adicional
        this.currentAudio.src = '';
        this.currentAudio.load();
        console.log('🔇 Fuente de audio limpiada');
        
      } catch (error) {
        console.warn('🔇 Error al detener audio:', error);
      }
      
      // Limpiar referencias
      this.currentAudio = null;
      this.isPlaying = false;
      this.onAudioStart = null;
      
      console.log('🔇 ✅ AUDIO COMPLETAMENTE DETENIDO Y DESTRUIDO');
    } else {
      console.log('🔇 No hay audio activo para detener');
    }
    
    // Detener TODOS los elementos de audio en la página como medida adicional
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach((audio, index) => {
      if (!audio.paused) {
        console.log(`🔇 Deteniendo audio adicional ${index + 1}`);
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      }
    });
    
    console.log('🔇 ✅ DETENCIÓN COMPLETA FINALIZADA');
  }

  /**
   * Ajusta el volumen de todos los audios
   * @param {number} volume - Volumen entre 0 y 1
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
    console.log(`🎵 Volumen ajustado a: ${this.volume}`);
  }

  /**
   * Limpia la caché de audios
   */
  clearCache() {
    console.log('🎵 Limpiando caché de audios');
    this.audioCache.clear();
  }

  /**
   * Verifica si un archivo de audio existe
   * @param {string} audioPath - Ruta del archivo
   * @returns {Promise<boolean>} - true si el archivo existe
   */
  async checkAudioExists(audioPath) {
    try {
      const response = await fetch(audioPath, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Precarga un audio específico
   * @param {string} audioPath - Ruta del archivo
   */
  async preloadAudio(audioPath) {
    try {
      if (!this.audioCache.has(audioPath)) {
        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        audio.volume = this.volume;
        this.audioCache.set(audioPath, audio);
        console.log(`🎵 Audio precargado: ${audioPath}`);
      }
    } catch (error) {
      console.warn(`🎵 No se pudo precargar: ${audioPath}`, error);
    }
  }
}

// Instancia singleton del gestor de audio
const audioManager = new AudioManager();

/**
 * Función de conveniencia para reproducir audio de respuesta predefinida
 * @param {string} categoria - Categoría del audio
 * @param {string} identificador - Identificador específico
 * @param {string} subcategoria - Subcategoría (opcional)
 * @param {function} onEnded - Callback cuando termina
 * @param {function} onError - Callback en caso de error
 * @returns {Promise<boolean>} - true si se reproduce correctamente
 */
export async function playResponseAudio(categoria, identificador, subcategoria = null, onEnded = null, onError = null, onStart = null) {
  const audioPath = audioManager.getAudioPath(categoria, identificador, subcategoria);
  
  if (!audioPath) {
    console.warn(`🎵 No se encontró audio para: ${categoria}/${subcategoria || ''}/${identificador}`);
    if (onError) onError(new Error('Audio no encontrado'));
    return false;
  }

  return await audioManager.playAudio(audioPath, onEnded, onError, onStart);
}

/**
 * Detiene cualquier audio en reproducción
 */
export function stopCurrentAudio() {
  console.log('🔇 Llamada a stopCurrentAudio() - Deteniendo todo audio');
  audioManager.stopCurrentAudio();
}

/**
 * Ajusta el volumen global de los audios
 * @param {number} volume - Volumen entre 0 y 1
 */
export function setAudioVolume(volume) {
  audioManager.setVolume(volume);
}

/**
 * Verifica si hay un audio reproduciéndose
 * @returns {boolean}
 */
export function isAudioPlaying() {
  return audioManager.isPlaying;
}

/**
 * Precarga audios para mejor rendimiento
 * @param {Array<{categoria, identificador, subcategoria}>} audioList
 */
export async function preloadAudios(audioList) {
  console.log('🎵 Precargando audios...');
  
  for (const { categoria, identificador, subcategoria } of audioList) {
    const audioPath = audioManager.getAudioPath(categoria, identificador, subcategoria);
    if (audioPath) {
      await audioManager.preloadAudio(audioPath);
    }
  }
  
  console.log('🎵 Precarga de audios completada');
}

export default audioManager;