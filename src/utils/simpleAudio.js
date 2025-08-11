// 🎵 SISTEMA DE AUDIO COMPLETAMENTE NUEVO Y SIMPLE
// Este archivo reemplaza TODOS los sistemas de audio anteriores

class SimpleAudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
  }

  // Detener CUALQUIER audio que esté reproduciéndose
  stopAll() {
    console.log('🔇 SimpleAudio: Deteniendo todo...');
    
    // Detener el audio actual si existe
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
        this.currentAudio = null;
        this.isPlaying = false;
        console.log('🔇 Audio actual detenido');
      } catch (e) {
        console.log('Error deteniendo audio actual:', e);
      }
    }

    // Encontrar y detener TODOS los elementos de audio en el DOM
    const allAudios = document.querySelectorAll('audio');
    console.log(`🔇 Encontrados ${allAudios.length} audios en el DOM`);
    
    allAudios.forEach((audio, index) => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.remove();
        console.log(`🔇 Audio DOM ${index + 1} eliminado`);
      } catch (e) {
        console.log(`Error eliminando audio ${index + 1}:`, e);
      }
    });

    // Limpiar referencias globales
    window.currentPlayingAudio = null;
    window.malvinAudio = null;
    
    console.log('🔇 ✅ SimpleAudio: Todo detenido');
  }

  // Reproducir un audio específico
  async play(audioPath, onLoaded = null, onEnded = null) {
    console.log('🎵 SimpleAudio: Reproduciendo', audioPath);
    
    // Primero detener todo
    this.stopAll();
    
    // Esperar un momento para asegurar limpieza
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      // Crear nuevo audio
      this.currentAudio = new Audio(audioPath);
      this.currentAudio.volume = 0.8;
      this.currentAudio.preload = 'auto';
      
      // Configurar eventos
      this.currentAudio.onloadedmetadata = () => {
        console.log(`🎵 SimpleAudio: Cargado - ${this.currentAudio.duration.toFixed(2)}s`);
        this.isPlaying = true;
        if (onLoaded) onLoaded(this.currentAudio.duration);
      };
      
      this.currentAudio.onended = () => {
        console.log('🎵 SimpleAudio: Terminado');
        this.currentAudio = null;
        this.isPlaying = false;
        if (onEnded) onEnded();
      };
      
      this.currentAudio.onerror = (error) => {
        console.error('❌ SimpleAudio: Error', error);
        this.currentAudio = null;
        this.isPlaying = false;
      };
      
      // Reproducir
      await this.currentAudio.play();
      console.log('🎵 ✅ SimpleAudio: Reproduciéndose');
      
      return this.currentAudio;
      
    } catch (error) {
      console.error('❌ SimpleAudio: Error general', error);
      this.currentAudio = null;
      this.isPlaying = false;
      throw error;
    }
  }

  // Obtener el audio actual
  getCurrentAudio() {
    return this.currentAudio;
  }

  // Verificar si está reproduciéndose
  getIsPlaying() {
    return this.isPlaying;
  }
}

// Instancia única
const simpleAudio = new SimpleAudioManager();

export default simpleAudio;