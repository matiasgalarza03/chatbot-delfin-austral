// 🎵 SISTEMA DE AUDIO FINAL - SOLUCIÓN DEFINITIVA
// Este archivo reemplaza TODOS los sistemas de audio anteriores

class AudioManagerFinal {
  constructor() {
    // 🔒 SINGLETON: Asegurar que solo hay una instancia
    if (window.audioManagerFinalInstance) {
      console.log('⚠️ AudioManagerFinal ya existe, usando instancia existente');
      return window.audioManagerFinalInstance;
    }
    
    this.currentAudio = null;
    this.isPlaying = false;
    this.audioQueue = [];
    this.globalAudioRefs = [
      'window.malvinCurrentAudio',
      'window.currentPlayingAudio', 
      'window.malvinAudio'
    ];
    
    // Marcar como instancia global
    window.audioManagerFinalInstance = this;
    console.log('🔒 AudioManagerFinal: Instancia única creada');
  }

  // 🔇 DETENER TODO - Función ULTRA AGRESIVA
  stopAll() {
    console.log('🔇 AudioManagerFinal: DETENIENDO TODO AGRESIVAMENTE...');
    
    // 1. Detener audio actual
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
        this.currentAudio.load(); // Forzar recarga para limpiar buffer
        this.currentAudio.remove?.();
        this.currentAudio = null;
        console.log('✅ Audio actual detenido y limpiado');
      } catch (e) {
        console.log('⚠️ Error deteniendo audio actual:', e);
      }
    }

    // 2. Limpiar TODAS las referencias globales posibles
    try {
      const globalRefs = [
        'malvinCurrentAudio',
        'currentPlayingAudio', 
        'malvinAudio',
        'audioElement',
        'currentAudio',
        'playingAudio'
      ];
      
      globalRefs.forEach(ref => {
        if (window[ref]) {
          try {
            if (window[ref].pause) window[ref].pause();
            if (window[ref].load) window[ref].load();
            window[ref] = null;
            console.log(`✅ Referencia global ${ref} limpiada`);
          } catch (e) {
            console.log(`⚠️ Error limpiando ${ref}:`, e);
          }
        }
      });
    } catch (e) {
      console.log('⚠️ Error limpiando referencias globales:', e);
    }

    // 3. DETENER TODOS los elementos audio del DOM de forma agresiva
    const allAudios = document.querySelectorAll('audio');
    console.log(`🔍 Encontrados ${allAudios.length} elementos audio en DOM`);
    
    allAudios.forEach((audio, index) => {
      try {
        // Detener reproducción
        audio.pause();
        audio.currentTime = 0;
        
        // Limpiar fuentes
        audio.src = '';
        audio.srcObject = null;
        
        // Forzar recarga para limpiar buffers
        audio.load();
        
        // Eliminar eventos
        audio.onloadedmetadata = null;
        audio.onended = null;
        audio.onerror = null;
        audio.onplay = null;
        audio.onpause = null;
        
        // Remover del DOM
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
        
        console.log(`✅ Audio DOM ${index + 1} completamente eliminado`);
      } catch (e) {
        console.log(`⚠️ Error eliminando audio ${index + 1}:`, e);
      }
    });

    // 4. Detener Web Audio API si está en uso
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        const contexts = [];
        // Buscar contextos de audio activos
        if (window.audioContext) contexts.push(window.audioContext);
        if (window.webkitAudioContext) contexts.push(window.webkitAudioContext);
        
        contexts.forEach(ctx => {
          if (ctx && ctx.state !== 'closed') {
            ctx.suspend().then(() => {
              console.log('✅ Contexto de audio suspendido');
            }).catch(e => {
              console.log('⚠️ Error suspendiendo contexto:', e);
            });
          }
        });
      }
    } catch (e) {
      console.log('⚠️ Error con Web Audio API:', e);
    }

    // 5. Detener Speech Synthesis si está activo
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('✅ Speech Synthesis cancelado');
      }
    } catch (e) {
      console.log('⚠️ Error cancelando Speech Synthesis:', e);
    }

    // 6. Resetear estado interno
    this.isPlaying = false;
    this.audioQueue = [];
    
    console.log('🔇 ✅ AudioManagerFinal: TODO DETENIDO AGRESIVAMENTE');
  }

  // 🎵 MAPEO CORRECTO DE PREGUNTAS A AUDIOS
  getAudioPath(pregunta) {
    if (!pregunta?.pregunta) return null;
    
    const q = pregunta.pregunta.toLowerCase().trim();
    console.log('🔍 Mapeando pregunta:', q);
    
    // === DELFÍN AUSTRAL ===
    if (q === '¡hola!') {
      return '/audios/respuestas_predefinidas/delfin_austral/01_presentacion.mp3';
    }
    if (q === '¿qué eres?') {
      return '/audios/respuestas_predefinidas/delfin_austral/02_naturaleza.mp3';
    }
    if (q === '¿para qué fuiste creado?') {
      return '/audios/respuestas_predefinidas/delfin_austral/03_proposito.mp3';
    }
    if (q === '¿qué puedes hacer?') {
      return '/audios/respuestas_predefinidas/delfin_austral/04_funcionalidades.mp3';
    }
    
    // === ESCUELA SECUNDARIA ===
    if (q === '¿cuándo se fundó la escuela y dónde se encuentra ubicada?') {
      return '/audios/respuestas_predefinidas/escuela_secundaria/01_historia_ubicacion.mp3';
    }
    if (q.includes('por qué se llama "malvinas argentinas"') || 
        (q.includes('malvinas argentinas') && q.includes('proyectos'))) {
      return '/audios/respuestas_predefinidas/escuela_secundaria/02_nombre_proyectos.mp3';
    }
    if (q.includes('quiénes diseñaron el logo') && q.includes('escuela')) {
      return '/audios/respuestas_predefinidas/escuela_secundaria/03_logo_bandera.mp3';
    }
    if (q.includes('quiénes forman el equipo directivo') || 
        q.includes('equipo directivo')) {
      return '/audios/respuestas_predefinidas/escuela_secundaria/04_equipo_directivo.mp3';
    }
    if (q.includes('cuenta con espacios dedicados') || 
        q.includes('espacios educativos')) {
      return '/audios/respuestas_predefinidas/escuela_secundaria/05_espacios_educativos.mp3';
    }
    
    // === MUSEO ESCOLAR ===
    if (q === '¿qué es el museo escolar?' || 
        (q.includes('museo escolar') && q.includes('qué es'))) {
      return '/audios/respuestas_predefinidas/museo_escolar/01_definicion.mp3';
    }
    if (q.includes('cuáles son los objetivos del museo') || 
        (q.includes('museo') && q.includes('objetivos'))) {
      return '/audios/respuestas_predefinidas/museo_escolar/02_objetivos.mp3';
    }
    if (q.includes('qué actividades se realizan') || 
        (q.includes('museo') && q.includes('actividades'))) {
      return '/audios/respuestas_predefinidas/museo_escolar/03_actividades.mp3';
    }
    if (q.includes('qué recursos están disponibles') || 
        (q.includes('museo') && q.includes('recursos'))) {
      return '/audios/respuestas_predefinidas/museo_escolar/04_recursos.mp3';
    }
    
    // === MALVINAS - CONTEXTO GEOGRÁFICO HISTÓRICO ===
    // ⚠️ MAPEO EXACTO PRIORITARIO - DEBE IR ANTES DE CUALQUIER MAPEO ALTERNATIVO
    
    // Mapeo exacto por preguntas específicas (EXACTAMENTE como están en Respuestas.json)
    if (q === '¿quién descubrió las islas malvinas?') {
      console.log('🎵 MALVINAS: Reproduciendo descubrimiento');
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/01_descubrimiento.mp3';
    }
    if (q === '¿cuál es la historia territorial de las malvinas antes de 1982?') {
      console.log('🎵 MALVINAS: Reproduciendo historia territorial');
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/02_historia.mp3';
    }
    if (q === '¿cual es la bandera actual de las islas malvinas?') {
      console.log('🎵 MALVINAS: Reproduciendo bandera');
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/03_bandera.mp3';
    }
    if (q === '¿quién es considerado el fundador de la presencia argentina en malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/04_fundador.mp3';
    }
    if (q === '¿quién fue el primer gobernador británico de las malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/05_primer_gobernador.mp3';
    }
    if (q === '¿qué tipos de plantas existen en las islas malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/06_flora.mp3';
    }
    if (q === '¿qué animales habitan en las malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/07_fauna.mp3';
    }
    if (q === '¿cuáles son las principales actividades económicas de las malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/08_actividades_economicas.mp3';
    }
    
    // === MALVINAS - CONFLICTO ARMADO 1982 ===
    
    if (q === '¿cuándo y cómo comenzó la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/09_inicio_conflicto.mp3';
    }
    if (q === '¿qué conflictos destacaron durante la guerra, incluyendo los menos conocidos?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/10_conflictos_destacados.mp3';
    }
    if (q === '¿cómo concluyó la guerra y cuál fue la batalla final?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/11_conclusion_guerra.mp3';
    }
    if (q === '¿cuál fue el impacto del hundimiento del ara general belgrano?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/12_impacto_ARA_General_belgrano.mp3';
    }
    if (q === '¿qué armamento utilizaron argentina y reino unido durante la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/13_armamento.mp3';
    }
    if (q === '¿cuál fue el arma más efectiva de argentina?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/14_arma_mas_efectiva_Argentina.mp3';
    }
    if (q === '¿quiénes son considerados héroes en la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/15_heroes_Malvinas.mp3';
    }
    if (q === '¿cuál fue el rol de los pilotos argentinos en el conflicto?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/16_rol_pilotos.mp3';
    }
    if (q === '¿qué desafíos enfrentaron los pilotos durante las operaciones?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/17_desafios_pilotos.mp3';
    }
    if (q === '¿cuántas bajas y heridos hubo en ambos bandos durante la guerra?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/18_bajas_heridos.mp3';
    }
    if (q === '¿cómo se financiaron argentina y reino unido durante el conflicto?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/19_suministros_economicos.mp3';
    }
    if (q === '¿hubo sanciones económicas durante la guerra?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/20_sanciones_economicas.mp3';
    }
    // DETECCIÓN ESPECÍFICA PARA SECTORES GEOGRÁFICOS - FORZADA
    console.log('🔍 DEBUG: Verificando pregunta para audio:', q);
    
    if (q.includes('sectores') || q.includes('geográficos') || q.includes('Sectores') || q.includes('Geográficos')) {
      console.log('🎯 DETECTADA pregunta sobre sectores geográficos');
      console.log('🎵 FORZANDO audio: 21_principales_sectores_geográficos.mp3');
      console.log('📁 Intentando ruta: /src/assets/audios/respuestas_predefinidas/malvinas/conflicto_armado/21_principales_sectores_geográficos.mp3');
      return '/src/assets/audios/respuestas_predefinidas/malvinas/conflicto_armado/21_principales_sectores_geográficos.mp3';
    }
    
    // Detección exacta
    const qLower = q.toLowerCase();
    if (qLower === '¿cuáles son los principales sectores geográficos de las islas malvinas?' || 
        qLower.includes('cuáles son los principales sectores geográficos') ||
        qLower.includes('principales sectores geográficos de las islas malvinas') ||
        qLower.includes('sectores geográficos de las islas malvinas') ||
        qLower.includes('principales sectores geográficos')) {
      console.log('🎵 Audio ENCONTRADO para sectores geográficos:', q);
      console.log('🎵 Ruta del audio: /audios/respuestas_predefinidas/malvinas/conflicto_armado/21_principales_sectores_geográficos.mp3');
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/21_principales_sectores_geográficos.mp3';
    }
    if (q === '¿participaron perros en la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/22_participacion_perros.mp3';
    }
    if (q === '¿por qué no se menciona su participación en muchos relatos históricos?') {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/23_relatos_historicos_perros.mp3';
    }
    
    // === MALVINAS - IMPACTO SOCIAL Y CULTURAL ===
    
    if (q === '¿cómo se informaba sobre la guerra de malvinas en argentina mientras ocurría?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/24_relato_durante_conflicto.mp3';
    }
    if (q === '¿qué rol jugaron los medios locales frente a la censura nacional?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/25_medios_locales.mp3';
    }
    if (q === '¿cómo retrataron los periódicos argentinos la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/26_periodicos_argentinos.mp3';
    }
    if (q === '¿hubo diferencias entre medios nacionales y regionales?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/27_diferencias_regionales.mp3';
    }
    if (q === '¿cómo respondió la sociedad argentina con donaciones durante la guerra?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/28_respuesta_social.mp3';
    }
    if (q === '¿qué simbolizaban estas donaciones para la sociedad?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/29_simbolismo_donaciones.mp3';
    }
    if (q === '¿cómo participaron los estudiantes argentinos mediante cartas durante la guerra de malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/30_participacion_estudiantil.mp3';
    }
    if (q === '¿qué simbolizaban estas cartas para los soldados?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/31_simbolismo_soldados.mp3';
    }
    if (q === '¿qué relatos contienen las cartas escritas por veteranos de la guerra?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/32_relatos_veteranos.mp3';
    }
    if (q === '¿cómo afectaron estas cartas a las familias?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/33_impacto_familias.mp3';
    }
    if (q === '¿qué cartas dejaron los soldados que murieron en combate?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/34_ultimas_cartas.mp3';
    }
    if (q === '¿cómo se preservan hoy estas cartas?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/35_preservacion_cartas.mp3';
    }
    if (q === '¿cómo comunicaban los familiares su apoyo a los soldados en malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/36_comunicacion_apoyo.mp3';
    }
    if (q === '¿qué dificultades enfrentaron para mantener contacto?') {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/37_dificultades_contacto.mp3';
    }
    
    // === MALVINAS - LEGADO Y REALIDAD ACTUAL ===
    
    if (q === '¿cuál es la situación actual de las islas malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/38_situacion_actual.mp3';
    }
    if (q === '¿cómo y cuándo se creó el cementerio de darwin en malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/39_creacion_cementerio.mp3';
    }
    if (q === '¿cómo se identificaron los restos de los soldados argentinos en darwin?') {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/40_identificacion_restos.mp3';
    }
    if (q === '¿cuál es la importancia de la pesca en las islas malvinas?') {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/41_importancia_economica.mp3';
    }
    if (q === '¿cómo afecta esto a las relaciones argentino-británicas?') {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/42_relaciones_argentino_britanicas.mp3';
    }
    
    // === MAPEO ALTERNATIVO POR PALABRAS CLAVE - MALVINAS ===
    
    // Contexto Geográfico
    if (q.includes('descubrimiento') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/01_descubrimiento.mp3';
    }
    if (q.includes('historia') && q.includes('malvinas') && q.includes('1982')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/02_historia.mp3';
    }
    if (q.includes('bandera') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/03_bandera.mp3';
    }
    if (q.includes('luis vernet') || (q.includes('fundador') && q.includes('malvinas'))) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/04_fundador.mp3';
    }
    if (q.includes('primer gobernador') && q.includes('británico')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/05_primer_gobernador.mp3';
    }
    if (q.includes('flora') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/06_flora.mp3';
    }
    if (q.includes('fauna') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/07_fauna.mp3';
    }
    if (q.includes('actividades económicas') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/contexto_geografico/08_actividades_economicas.mp3';
    }
    
    // Conflicto Armado
    if (q.includes('guerra') && q.includes('malvinas') && q.includes('comenzó')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/09_inicio_conflicto.mp3';
    }
    if (q.includes('belgrano') && q.includes('hundimiento')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/12_impacto_ARA_General_belgrano.mp3';
    }
    if (q.includes('armamento') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/13_armamento.mp3';
    }
    if (q.includes('héroes') || q.includes('heroes')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/15_heroes_Malvinas.mp3';
    }
    if (q.includes('pilotos') && q.includes('rol')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/16_rol_pilotos.mp3';
    }
    if (q.includes('bajas') || q.includes('heridos')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/18_bajas_heridos.mp3';
    }
    if (q.includes('perros') && q.includes('guerra')) {
      return '/audios/respuestas_predefinidas/malvinas/conflicto_armado/22_participacion_perros.mp3';
    }
    
    // Impacto Social
    if (q.includes('medios') && q.includes('comunicación')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/24_relato_durante_conflicto.mp3';
    }
    if (q.includes('periódicos') && q.includes('argentinos')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/26_periodicos_argentinos.mp3';
    }
    if (q.includes('donaciones') && q.includes('sociedad')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/28_respuesta_social.mp3';
    }
    if (q.includes('cartas') && q.includes('estudiantes')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/30_participacion_estudiantil.mp3';
    }
    if (q.includes('cartas') && q.includes('veteranos')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/32_relatos_veteranos.mp3';
    }
    if (q.includes('cartas') && q.includes('familiares')) {
      return '/audios/respuestas_predefinidas/malvinas/impacto_social/36_comunicacion_apoyo.mp3';
    }
    
    // Legado Actual
    if (q.includes('situación actual') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/38_situacion_actual.mp3';
    }
    if (q.includes('cementerio') && q.includes('darwin')) {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/39_creacion_cementerio.mp3';
    }
    if (q.includes('identificación') && q.includes('restos')) {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/40_identificacion_restos.mp3';
    }
    if (q.includes('pesca') && q.includes('malvinas')) {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/41_importancia_economica.mp3';
    }
    if (q.includes('relaciones') && q.includes('argentino-británicas')) {
      return '/audios/respuestas_predefinidas/malvinas/legado_actual/42_relaciones_argentino_britanicas.mp3';
    }
    
    // === MAPEO ALTERNATIVO POR PALABRAS CLAVE (SOLO PARA NO-MALVINAS) ===
    
    // Delfín Austral - mapeo alternativo
    if (q.includes('hola') || q.includes('saludo')) {
      return '/audios/respuestas_predefinidas/delfin_austral/01_presentacion.mp3';
    }
    if (q.includes('qué eres') || q.includes('que eres')) {
      return '/audios/respuestas_predefinidas/delfin_austral/02_naturaleza.mp3';
    }
    if (q.includes('para qué') || q.includes('propósito') || q.includes('creado')) {
      return '/audios/respuestas_predefinidas/delfin_austral/03_proposito.mp3';
    }
    if (q.includes('puedes hacer') || q.includes('funcionalidades')) {
      return '/audios/respuestas_predefinidas/delfin_austral/04_funcionalidades.mp3';
    }
    
    // Escuela - mapeo alternativo MUY ESPECÍFICO (evitar conflictos con Malvinas)
    if (!q.includes('malvinas')) {
      if (q.includes('fundó') && q.includes('escuela')) {
        return '/audios/respuestas_predefinidas/escuela_secundaria/01_historia_ubicacion.mp3';
      }
      if (q.includes('ubicada') && q.includes('escuela')) {
        return '/audios/respuestas_predefinidas/escuela_secundaria/01_historia_ubicacion.mp3';
      }
      if (q.includes('directivo') || q.includes('director')) {
        return '/audios/respuestas_predefinidas/escuela_secundaria/04_equipo_directivo.mp3';
      }
      if (q.includes('espacios') && q.includes('escuela')) {
        return '/audios/respuestas_predefinidas/escuela_secundaria/05_espacios_educativos.mp3';
      }
    }
    
    // Escuela - mapeo específico para "malvinas argentinas" (nombre de la escuela)
    if (q.includes('malvinas argentinas') || q.includes('nombre')) {
      return '/audios/respuestas_predefinidas/escuela_secundaria/02_nombre_proyectos.mp3';
    }
    
    // Museo - mapeo alternativo
    if (q.includes('museo')) {
      if (q.includes('qué es') || q.includes('definición')) {
        return '/audios/respuestas_predefinidas/museo_escolar/01_definicion.mp3';
      }
      if (q.includes('objetivo')) {
        return '/audios/respuestas_predefinidas/museo_escolar/02_objetivos.mp3';
      }
      if (q.includes('actividad')) {
        return '/audios/respuestas_predefinidas/museo_escolar/03_actividades.mp3';
      }
      if (q.includes('recurso')) {
        return '/audios/respuestas_predefinidas/museo_escolar/04_recursos.mp3';
      }
      // Por defecto, si contiene "museo" pero no coincide
      return '/audios/respuestas_predefinidas/museo_escolar/01_definicion.mp3';
    }
    
    console.log('❌ No se encontró audio para:', q);
    return null;
  }

  // 🎵 REPRODUCIR AUDIO - Función principal
  async play(pregunta, onLoaded = null, onEnded = null) {
    console.log('🎵 AudioManagerFinal: Iniciando reproducción');
    
    // 0. Verificar que no hay otra reproducción en curso
    if (this.isPlaying) {
      console.log('⚠️ Ya hay un audio reproduciéndose, deteniendo primero');
      this.stopAll();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 1. Detener todo primero de forma agresiva
    this.stopAll();
    
    // 2. Obtener ruta de audio
    const audioPath = this.getAudioPath(pregunta);
    if (!audioPath) {
      console.log('❌ No hay audio disponible para esta pregunta');
      return null;
    }
    
    console.log('🎵 Reproduciendo:', audioPath);
    
    // 3. Esperar un momento para asegurar limpieza completa
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // 4. Crear nuevo audio
      this.currentAudio = new Audio(audioPath);
      this.currentAudio.volume = 0.8;
      this.currentAudio.preload = 'auto';
      
      // 5. Configurar eventos
      this.currentAudio.onloadedmetadata = () => {
        console.log(`🎵 Audio cargado - Duración: ${this.currentAudio.duration.toFixed(2)}s`);
        this.isPlaying = true;
        if (onLoaded) onLoaded(this.currentAudio.duration);
      };
      
      this.currentAudio.onended = () => {
        console.log('🎵 Audio terminado naturalmente');
        this.currentAudio = null;
        this.isPlaying = false;
        if (onEnded) onEnded();
      };
      
      this.currentAudio.onerror = (error) => {
        console.error('❌ Error de audio:', error);
        this.currentAudio = null;
        this.isPlaying = false;
      };
      
      // 6. Guardar referencia global (para compatibilidad)
      window.malvinCurrentAudio = this.currentAudio;
      
      // 7. Reproducir
      await this.currentAudio.play();
      console.log('🎵 ✅ Reproducción iniciada correctamente');
      
      return this.currentAudio;
      
    } catch (error) {
      console.error('❌ Error general reproduciendo audio:', error);
      this.currentAudio = null;
      this.isPlaying = false;
      throw error;
    }
  }

  // 🔍 Obtener estado actual
  getCurrentAudio() {
    return this.currentAudio;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

// Instancia única
const audioManagerFinal = new AudioManagerFinal();

export default audioManagerFinal;