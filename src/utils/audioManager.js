// 🚫 AUDIOMANAGER COMPLETAMENTE DESHABILITADO
// Audio ahora manejado únicamente por RespuestaPredefinida.jsx

class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
  }

  async playAudio(audioPath, onEnded = null, onError = null, onStart = null) {
    console.log('🚫 audioManager.playAudio DESHABILITADO');
    return;
  }

  stopCurrentAudio() {
    console.log('🚫 audioManager.stopCurrentAudio DESHABILITADO');
    return;
  }

  getCurrentAudio() {
    return null;
  }

  getIsPlaying() {
    return false;
  }
}

// Instancia singleton
const audioManager = new AudioManager();

// Funciones deshabilitadas
export const handleAudio = async (audioPath, onEnded = null, onError = null, onStart = null) => {
  console.log('🚫 handleAudio DESHABILITADO - usando RespuestaPredefinida.jsx');
  return;
};

export const playResponseAudio = async (categoria, pregunta, onStart = null, onEnded = null, onError = null) => {
  console.log('🚫 playResponseAudio DESHABILITADO - usando RespuestaPredefinida.jsx');
  return;
};

export const stopCurrentAudio = () => {
  console.log('🚫 stopCurrentAudio DESHABILITADO');
  return;
};

export const getCurrentAudio = () => {
  return null;
};

export const getIsPlaying = () => {
  return false;
};

export default audioManager;