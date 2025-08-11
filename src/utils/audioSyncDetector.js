// 🎵 DETECTOR DE SINCRONIZACIÓN AUTOMÁTICA AUDIO-TEXTO
// Sistema para sincronizar subtítulos con el momento exacto del audio

class AudioSyncDetector {
  constructor() {
    this.audioElement = null;
    this.isListening = false;
    this.syncCallbacks = [];
    this.currentAudioTime = 0;
    this.syncPoints = new Map();
  }

  // Configurar elemento de audio para monitoreo
  setAudioElement(audioElement) {
    this.audioElement = audioElement;
    this.setupAudioListeners();
  }

  // Configurar listeners del audio
  setupAudioListeners() {
    if (!this.audioElement) return;

    // Monitorear tiempo actual del audio
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentAudioTime = this.audioElement.currentTime * 1000; // Convertir a ms
      this.checkSyncPoints();
    });

    // Detectar cuando inicia el audio
    this.audioElement.addEventListener('play', () => {
      this.isListening = true;
      console.log('🎵 AudioSyncDetector: Iniciando monitoreo de sincronización');
    });

    // Detectar cuando para el audio
    this.audioElement.addEventListener('pause', () => {
      this.isListening = false;
      console.log('🎵 AudioSyncDetector: Pausando monitoreo');
    });

    this.audioElement.addEventListener('ended', () => {
      this.isListening = false;
      console.log('🎵 AudioSyncDetector: Audio terminado');
    });
  }

  // Configurar puntos de sincronización para una respuesta específica
  setSyncPoints(pregunta, textBlocks, audioSyncData) {
    const preguntaKey = this.generateQuestionKey(pregunta);
    
    if (audioSyncData && audioSyncData.bloques) {
      // Usar datos de sincronización específicos
      const syncPoints = audioSyncData.bloques.map((bloque, index) => ({
        timeMs: bloque.inicio,
        blockIndex: index,
        text: bloque.texto,
        duration: bloque.duracion
      }));
      
      this.syncPoints.set(preguntaKey, syncPoints);
      console.log(`🎯 Puntos de sincronización configurados para: ${pregunta.pregunta}`);
      console.log('📊 Puntos:', syncPoints);
    } else {
      // Generar puntos de sincronización automáticos
      this.generateAutomaticSyncPoints(preguntaKey, textBlocks);
    }
  }

  // Generar puntos de sincronización automáticos basados en análisis de texto
  generateAutomaticSyncPoints(preguntaKey, textBlocks) {
    const syncPoints = [];
    let currentTime = 0;
    
    textBlocks.forEach((block, index) => {
      // Calcular duración basada en longitud del texto y velocidad de habla
      const wordCount = block.split(' ').length;
      const duration = this.calculateSpeechDuration(block, 0.90); // Velocidad 0.90
      
      syncPoints.push({
        timeMs: currentTime,
        blockIndex: index,
        text: block,
        duration: duration
      });
      
      currentTime += duration;
    });
    
    this.syncPoints.set(preguntaKey, syncPoints);
    console.log(`🤖 Puntos automáticos generados para: ${preguntaKey}`);
    console.log('📊 Puntos:', syncPoints);
  }

  // Calcular duración de habla basada en texto y velocidad
  calculateSpeechDuration(text, speed = 1.0) {
    const wordCount = text.split(' ').length;
    const charactersCount = text.length;
    
    // Fórmula mejorada para velocidad 0.90 (lenta)
    const baseWordsPerMinute = 140; // Palabras por minuto base
    const adjustedWPM = baseWordsPerMinute * speed; // Ajustar por velocidad
    const wordsPerMs = adjustedWPM / 60000; // Convertir a ms
    
    // Calcular duración base
    let duration = wordCount / wordsPerMs;
    
    // Ajustes adicionales para puntuación y pausas
    const commas = (text.match(/,/g) || []).length;
    const periods = (text.match(/\./g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    
    // Agregar tiempo para pausas naturales
    duration += commas * 200; // 200ms por coma
    duration += periods * 400; // 400ms por punto
    duration += questions * 300; // 300ms por pregunta
    
    // Factor de seguridad para velocidad lenta
    duration *= 1.15; // 15% más tiempo para asegurar sincronización
    
    return Math.round(duration);
  }

  // Verificar si es momento de cambiar de bloque
  checkSyncPoints() {
    if (!this.isListening) return;
    
    for (const [preguntaKey, syncPoints] of this.syncPoints.entries()) {
      const currentPoint = this.getCurrentSyncPoint(syncPoints);
      if (currentPoint) {
        this.triggerSyncCallback(currentPoint);
      }
    }
  }

  // Obtener el punto de sincronización actual
  getCurrentSyncPoint(syncPoints) {
    for (let i = 0; i < syncPoints.length; i++) {
      const point = syncPoints[i];
      const nextPoint = syncPoints[i + 1];
      
      if (this.currentAudioTime >= point.timeMs && 
          (!nextPoint || this.currentAudioTime < nextPoint.timeMs)) {
        return point;
      }
    }
    return null;
  }

  // Disparar callback de sincronización
  triggerSyncCallback(syncPoint) {
    this.syncCallbacks.forEach(callback => {
      callback(syncPoint);
    });
  }

  // Registrar callback para cambios de sincronización
  onSyncChange(callback) {
    this.syncCallbacks.push(callback);
  }

  // Limpiar callbacks
  clearCallbacks() {
    this.syncCallbacks = [];
  }

  // Generar clave única para pregunta
  generateQuestionKey(pregunta) {
    return pregunta.pregunta.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  // Obtener tiempo actual del audio
  getCurrentTime() {
    return this.currentAudioTime;
  }

  // Verificar si está sincronizando
  isActive() {
    return this.isListening;
  }

  // Limpiar detector
  cleanup() {
    this.isListening = false;
    this.syncCallbacks = [];
    this.syncPoints.clear();
    this.audioElement = null;
  }
}

// Instancia global del detector
const audioSyncDetector = new AudioSyncDetector();

export default audioSyncDetector;