import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import VisualizadorMultimedia from "./VisualizadorMultimedia";
import audioManagerFinal from "../utils/audioManagerFinal";
import sincronizacionAudio from "../data/SincronizacionAudio.json";
import manualSyncManager from "../utils/manualSyncManager";
import audioSyncDetector from '../utils/audioSyncDetector';

// Clave para localStorage
const ESTILOS_GLOBALES_KEY = "malvin_estilos_globales";

// Función para cargar estilos desde localStorage con migración automática
function cargarEstilosGlobales() {
  try {
    const estilosGuardados = localStorage.getItem(ESTILOS_GLOBALES_KEY);
    if (estilosGuardados) {
      const estilos = JSON.parse(estilosGuardados);

      // Migración automática: corregir posiciones muy altas
      if (estilos.bottom && parseFloat(estilos.bottom) > 5) {
        console.log(
          "Migrando posición antigua a subtítulos:",
          estilos.bottom,
          "→ 1rem",
        );
        estilos.bottom = "1rem";
        // Guardar la corrección inmediatamente
        localStorage.setItem(ESTILOS_GLOBALES_KEY, JSON.stringify(estilos));
      }

      // Migración: asegurar valores mínimos para subtítulos
      if (!estilos.bottom || parseFloat(estilos.bottom) < 0) {
        estilos.bottom = "1rem";
      }
      if (!estilos.marginBottom) {
        estilos.marginBottom = "0.5rem";
      }

      return estilos;
    }
  } catch (error) {
    console.warn("Error cargando estilos desde localStorage:", error);
  }
  return null;
}

// Función para guardar estilos en localStorage
function guardarEstilosGlobales(estilos) {
  try {
    localStorage.setItem(ESTILOS_GLOBALES_KEY, JSON.stringify(estilos));
  } catch (error) {
    console.warn("Error guardando estilos en localStorage:", error);
  }
}

// Función mejorada para crear bloques de texto correctamente balanceados
function createOptimizedTextBlocks(text) {
  if (!text || text.trim() === '') {
    console.error('Texto vacío o indefinido recibido en createOptimizedTextBlocks');
    return ['Texto no disponible'];
  }

  const cleanText = text.trim();
  
  // NUEVA LÓGICA: Si el texto es corto (menos de 200 caracteres), no dividir
  if (cleanText.length <= 200) {
    console.log('📝 Texto corto detectado, mostrando como un solo bloque:', cleanText.length, 'caracteres');
    return [cleanText];
  }

  // Configuración optimizada para textos largos
  const TARGET_SENTENCES_PER_BLOCK = 2;
  const MAX_CHARS_PER_BLOCK = 220; // Aumentado para mostrar más contenido
  const MIN_CHARS_PER_BLOCK = 40; // Aumentado para evitar fragmentos muy pequeños

  // Paso 1: Proteger abreviaciones conocidas para evitar división incorrecta
  let processedText = text
    .replace(/\s+/g, " ")
    .trim()
    // Proteger abreviaciones comunes
    .replace(/E\.E\.S\./g, "E_E_S_")
    .replace(/N°(\d+)/g, "N_$1_")
    .replace(/Dr\./g, "Dr_")
    .replace(/Dra\./g, "Dra_")
    .replace(/Prof\./g, "Prof_")
    .replace(/Sr\./g, "Sr_")
    .replace(/Sra\./g, "Sra_");

  // Paso 2: Dividir en oraciones, pero siendo más cuidadoso
  const oraciones = [];
  const matches = processedText.match(/[^.!?]*[.!?]+/g) || [];

  for (let match of matches) {
    oraciones.push(match.trim());
  }

  // Agregar texto final si no termina en puntuación
  const textoRestante = processedText.replace(/[^.!?]*[.!?]+/g, "").trim();
  if (textoRestante) {
    oraciones.push(textoRestante + (textoRestante.match(/[.!?]$/) ? "" : "."));
  }

  // Paso 3: Restaurar abreviaciones y limpiar
  const oracionesLimpias = oraciones
    .map((oracion) =>
      oracion
        .trim()
        .replace(/E_E_S_/g, "E.E.S.")
        .replace(/N_(\d+)_/g, "N°$1")
        .replace(/Dr_/g, "Dr.")
        .replace(/Dra_/g, "Dra.")
        .replace(/Prof_/g, "Prof.")
        .replace(/Sr_/g, "Sr.")
        .replace(/Sra_/g, "Sra."),
    )
    .filter((oracion) => oracion.length > 0);

  // Paso 4: Crear bloques inteligentemente
  const bloques = [];
  let bloqueActual = "";
  let contadorOraciones = 0;

  for (let i = 0; i < oracionesLimpias.length; i++) {
    const oracion = oracionesLimpias[i];
    if (!oracion.trim()) continue;

    const bloquePrueba = bloqueActual ? `${bloqueActual} ${oracion}` : oracion;

    // Condiciones para finalizar bloque actual
    const esDemasiadoLargo = bloquePrueba.length > MAX_CHARS_PER_BLOCK;
    const tieneDosSentencias = contadorOraciones >= TARGET_SENTENCES_PER_BLOCK;
    const bloqueActualTieneContenido = bloqueActual.length > 0;

    if (
      (esDemasiadoLargo || tieneDosSentencias) &&
      bloqueActualTieneContenido
    ) {
      bloques.push(bloqueActual.trim());
      bloqueActual = oracion;
      contadorOraciones = 1;
    } else {
      bloqueActual = bloquePrueba;
      contadorOraciones++;
    }
  }

  // Agregar último bloque
  if (bloqueActual.trim()) {
    bloques.push(bloqueActual.trim());
  }

  // Paso 5: Post-procesamiento para optimizar bloques problemáticos
  const bloquesOptimizados = [];

  for (let i = 0; i < bloques.length; i++) {
    const bloque = bloques[i];
    const caracteres = bloque.length;
    const palabras = bloque.split(" ").length;

    // Detectar bloques problemáticos que necesitan combinación
    const esMuyCorto = caracteres < MIN_CHARS_PER_BLOCK || palabras < 6;
    const esFragmentoAbreviacion =
      /^[A-Z]\.\s*N°|^S\.\s*N°|^\w{1,3}[\s.]*$/.test(bloque.trim());
    const esInicioIncompleto =
      bloque.match(/E\.E\.S?\.$/) ||
      bloque.match(/de la E\.$/) ||
      bloque.match(/E\.\s*$/) ||
      bloque.match(/E\.E\.\s*$/);

    // Si es problemático y hay un siguiente bloque, intentar combinar
    if (
      (esMuyCorto || esFragmentoAbreviacion || esInicioIncompleto) &&
      i < bloques.length - 1
    ) {
      const siguienteBloque = bloques[i + 1];
      const combinado = `${bloque} ${siguienteBloque}`.trim();

      // Verificar que la combinación sea razonable
      if (combinado.length <= MAX_CHARS_PER_BLOCK * 1.2) {
        bloquesOptimizados.push(combinado);
        i++; // Saltar el siguiente bloque ya que lo combinamos
        continue;
      }
    }

    bloquesOptimizados.push(bloque);
  }

  // Paso 6: Verificación final y logging
  const bloquesFinal = bloquesOptimizados
    .filter((bloque) => bloque && bloque.trim().length > 0)
    .map((bloque) => bloque.trim());
  
  console.log('📊 Análisis de bloques creados:');
  bloquesFinal.forEach((bloque, index) => {
    console.log(`  Bloque ${index + 1}: ${bloque.length} caracteres - "${bloque.substring(0, 60)}..."`);
  });
  
  return bloquesFinal;
}

// Función para calcular tiempo de lectura con 120 palabras por minuto (más lento para mejor lectura)
function calculateReadingTime(text) {
  const wordsPerMinute = 120; // Reducido aún más para dar más tiempo de lectura
  const words = text.split(" ").length;
  const minutes = words / wordsPerMinute;
  // Aumentar el tiempo mínimo a 5 segundos y máximo a 18 segundos
  const seconds = Math.max(5, Math.min(18, Math.ceil(minutes * 60 * 1.8))); // Añadido 80% más de tiempo
  console.log(`⏱️ Tiempo de lectura para ${words} palabras: ${seconds} segundos`);
  return seconds * 1000; // Convertir a milisegundos
}

/**
 * Determina la información de audio basada en la pregunta
 * @param {Object} pregunta - Objeto de pregunta con pregunta y respuesta
 * @returns {Object|null} - Información de audio o null
 */
function determineAudioInfo(pregunta) {
  console.log('🔍 INICIANDO MAPEO DE AUDIO');
  console.log('📝 Pregunta completa recibida:', pregunta);
  
  // Obtener el texto de la pregunta
  const preguntaText = pregunta.pregunta?.toLowerCase() || '';
  console.log('🔤 Texto de pregunta procesado:', preguntaText);
  
  // 🎯 MAPEO DIRECTO BASADO EN PREGUNTAS EXACTAS DEL JSON
  
  // ===== DELFÍN AUSTRAL =====
  if (preguntaText === '¡hola!') {
    console.log('✅ MAPEO EXACTO: delfin_austral -> presentacion');
    return { categoria: 'delfin_austral', identificador: 'presentacion' };
  }
  if (preguntaText === '¿qué eres?') {
    console.log('✅ MAPEO EXACTO: delfin_austral -> naturaleza');
    return { categoria: 'delfin_austral', identificador: 'naturaleza' };
  }
  if (preguntaText === '¿para qué fuiste creado?') {
    console.log('✅ MAPEO EXACTO: delfin_austral -> proposito');
    return { categoria: 'delfin_austral', identificador: 'proposito' };
  }
  if (preguntaText === '¿qué puedes hacer?') {
    console.log('✅ MAPEO EXACTO: delfin_austral -> funcionalidades');
    return { categoria: 'delfin_austral', identificador: 'funcionalidades' };
  }
  
  // ===== ESCUELA SECUNDARIA =====
  if (preguntaText === '¿cuándo se fundó la escuela y dónde se encuentra ubicada?') {
    console.log('✅ MAPEO EXACTO: escuela_secundaria -> historia_ubicacion');
    return { categoria: 'escuela_secundaria', identificador: 'historia_ubicacion' };
  }
  if (preguntaText.includes('por qué se llama "malvinas argentinas"')) {
    console.log('✅ MAPEO EXACTO: escuela_secundaria -> nombre_proyectos');
    return { categoria: 'escuela_secundaria', identificador: 'nombre_proyectos' };
  }
  if (preguntaText.includes('quiénes diseñaron el logo')) {
    console.log('✅ MAPEO EXACTO: escuela_secundaria -> logo_bandera');
    return { categoria: 'escuela_secundaria', identificador: 'logo_bandera' };
  }
  if (preguntaText.includes('quiénes forman el equipo directivo')) {
    console.log('✅ MAPEO EXACTO: escuela_secundaria -> equipo_directivo');
    return { categoria: 'escuela_secundaria', identificador: 'equipo_directivo' };
  }
  if (preguntaText.includes('cuenta con espacios dedicados')) {
    console.log('✅ MAPEO EXACTO: escuela_secundaria -> espacios_educativos');
    return { categoria: 'escuela_secundaria', identificador: 'espacios_educativos' };
  }
  
  // ===== MUSEO ESCOLAR - MAPEO MEJORADO =====
  console.log('🏛️ Verificando preguntas de Museo Escolar...');
  
  // Mapeo exacto basado en las preguntas del JSON
  if (preguntaText === '¿qué es el museo escolar?') {
    console.log('✅ MAPEO EXACTO: museo_escolar -> definicion');
    return { categoria: 'museo_escolar', identificador: 'definicion' };
  }
  if (preguntaText.includes('cuáles son los objetivos del museo')) {
    console.log('✅ MAPEO EXACTO: museo_escolar -> objetivos');
    return { categoria: 'museo_escolar', identificador: 'objetivos' };
  }
  if (preguntaText.includes('qué actividades se realizan')) {
    console.log('✅ MAPEO EXACTO: museo_escolar -> actividades');
    return { categoria: 'museo_escolar', identificador: 'actividades' };
  }
  if (preguntaText.includes('qué recursos están disponibles')) {
    console.log('✅ MAPEO EXACTO: museo_escolar -> recursos');
    return { categoria: 'museo_escolar', identificador: 'recursos' };
  }
  
  // Mapeo por palabras clave para museo escolar
  if (preguntaText.includes('museo')) {
    console.log('🎯 DETECTADO: Pregunta contiene "museo" - Aplicando mapeo por palabras clave');
    
    if (preguntaText.includes('qué es') || preguntaText.includes('que es') || preguntaText.includes('definición')) {
      console.log('✅ MAPEO POR CLAVE: museo_escolar -> definicion');
      return { categoria: 'museo_escolar', identificador: 'definicion' };
    }
    if (preguntaText.includes('objetivo') || preguntaText.includes('objetivos') || preguntaText.includes('propósito')) {
      console.log('✅ MAPEO POR CLAVE: museo_escolar -> objetivos');
      return { categoria: 'museo_escolar', identificador: 'objetivos' };
    }
    if (preguntaText.includes('actividad') || preguntaText.includes('actividades') || preguntaText.includes('hace')) {
      console.log('✅ MAPEO POR CLAVE: museo_escolar -> actividades');
      return { categoria: 'museo_escolar', identificador: 'actividades' };
    }
    if (preguntaText.includes('recurso') || preguntaText.includes('recursos') || preguntaText.includes('disponible')) {
      console.log('✅ MAPEO POR CLAVE: museo_escolar -> recursos');
      return { categoria: 'museo_escolar', identificador: 'recursos' };
    }
    
    // Si contiene "museo" pero no coincide con patrones específicos, usar el primer audio
    console.log('⚠️ MAPEO DE EMERGENCIA: museo_escolar -> definicion (por defecto)');
    return { categoria: 'museo_escolar', identificador: 'definicion' };
  }
  
  // ===== MAPEO ALTERNATIVO POR PALABRAS CLAVE =====
  
  // Delfín Austral - mapeo alternativo
  if (preguntaText.includes('hola') || preguntaText.includes('saludo') || preguntaText.includes('presentación')) {
    console.log('✅ MAPEO ALTERNATIVO: delfin_austral -> presentacion');
    return { categoria: 'delfin_austral', identificador: 'presentacion' };
  }
  if (preguntaText.includes('qué eres') || preguntaText.includes('que eres') || preguntaText.includes('naturaleza')) {
    console.log('✅ MAPEO ALTERNATIVO: delfin_austral -> naturaleza');
    return { categoria: 'delfin_austral', identificador: 'naturaleza' };
  }
  if (preguntaText.includes('para qué') || preguntaText.includes('propósito') || preguntaText.includes('creado')) {
    console.log('✅ MAPEO ALTERNATIVO: delfin_austral -> proposito');
    return { categoria: 'delfin_austral', identificador: 'proposito' };
  }
  if (preguntaText.includes('puedes hacer') || preguntaText.includes('funcionalidades') || preguntaText.includes('capacidades')) {
    console.log('✅ MAPEO ALTERNATIVO: delfin_austral -> funcionalidades');
    return { categoria: 'delfin_austral', identificador: 'funcionalidades' };
  }
  
  // Escuela Secundaria - mapeo alternativo
  if (preguntaText.includes('fundó') || preguntaText.includes('ubicada') || preguntaText.includes('historia')) {
    console.log('✅ MAPEO ALTERNATIVO: escuela_secundaria -> historia_ubicacion');
    return { categoria: 'escuela_secundaria', identificador: 'historia_ubicacion' };
  }
  if (preguntaText.includes('malvinas argentinas') || preguntaText.includes('nombre') || preguntaText.includes('proyectos')) {
    console.log('✅ MAPEO ALTERNATIVO: escuela_secundaria -> nombre_proyectos');
    return { categoria: 'escuela_secundaria', identificador: 'nombre_proyectos' };
  }
  if (preguntaText.includes('logo') || preguntaText.includes('bandera') || preguntaText.includes('diseñaron')) {
    console.log('✅ MAPEO ALTERNATIVO: escuela_secundaria -> logo_bandera');
    return { categoria: 'escuela_secundaria', identificador: 'logo_bandera' };
  }
  if (preguntaText.includes('equipo directivo') || preguntaText.includes('directivo') || preguntaText.includes('director')) {
    console.log('✅ MAPEO ALTERNATIVO: escuela_secundaria -> equipo_directivo');
    return { categoria: 'escuela_secundaria', identificador: 'equipo_directivo' };
  }
  if (preguntaText.includes('espacios') || preguntaText.includes('educativos') || preguntaText.includes('instalaciones')) {
    console.log('✅ MAPEO ALTERNATIVO: escuela_secundaria -> espacios_educativos');
    return { categoria: 'escuela_secundaria', identificador: 'espacios_educativos' };
  }
  
  // ===== MALVINAS - MAPEO COMPLETO PARA LAS 4 SUBSECCIONES =====
  
  // 1. Contexto Geográfico Histórico - malvinas_contexto_geografico
  if (preguntaText.includes('contexto geográfico') || preguntaText.includes('contexto geografico')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> historia');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'historia' };
  }
  if (preguntaText.includes('descubrimiento') || preguntaText.includes('descubiertas') || preguntaText.includes('descubrió')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> descubrimiento');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'descubrimiento' };
  }
  if (preguntaText.includes('historia') && preguntaText.includes('malvinas')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> historia');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'historia' };
  }
  if (preguntaText.includes('bandera') && preguntaText.includes('malvinas')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> bandera');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'bandera' };
  }
  if (preguntaText.includes('luis vernet') || (preguntaText.includes('fundador') && preguntaText.includes('malvinas'))) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> fundador');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'fundador' };
  }
  if (preguntaText.includes('primer gobernador') || preguntaText.includes('james onslow')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> primer_gobernador');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'primer_gobernador' };
  }
  if (preguntaText.includes('flora') && preguntaText.includes('malvinas')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> flora');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'flora' };
  }
  if (preguntaText.includes('fauna') && preguntaText.includes('malvinas')) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> fauna');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'fauna' };
  }
  if (preguntaText.includes('actividades económicas') || (preguntaText.includes('economía') && preguntaText.includes('malvinas'))) {
    console.log('✅ MAPEO: malvinas_contexto_geografico -> actividades_economicas');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'actividades_economicas' };
  }
  
  // 2. Conflicto Armado 1982 - malvinas_conflicto_armado
  if (preguntaText.includes('conflicto armado') || preguntaText.includes('guerra de 1982') || preguntaText.includes('guerra malvinas')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> inicio_conflicto');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'inicio_conflicto' };
  }
  if (preguntaText.includes('inicio') && (preguntaText.includes('conflicto') || preguntaText.includes('guerra'))) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> inicio_conflicto');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'inicio_conflicto' };
  }
  if (preguntaText.includes('conflictos destacados') || preguntaText.includes('batallas importantes')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> conflictos_destacados');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'conflictos_destacados' };
  }
  if (preguntaText.includes('conclusión') && preguntaText.includes('guerra')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> conclusion_guerra');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'conclusion_guerra' };
  }
  if (preguntaText.includes('belgrano') || preguntaText.includes('impacto belgrano')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> impacto_belgrano');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'impacto_belgrano' };
  }
  if (preguntaText.includes('armamento') || preguntaText.includes('armas utilizadas')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> armamento');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'armamento' };
  }
  if (preguntaText.includes('arma más efectiva') || preguntaText.includes('exocet')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> arma_mas_efectiva');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'arma_mas_efectiva' };
  }
  if (preguntaText.includes('héroes') || preguntaText.includes('heroes')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> heroes');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'heroes' };
  }
  if (preguntaText.includes('rol') && preguntaText.includes('pilotos')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> rol_pilotos');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'rol_pilotos' };
  }
  if (preguntaText.includes('desafíos') && preguntaText.includes('pilotos')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> desafios_pilotos');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'desafios_pilotos' };
  }
  
  // 🎯 MAPEO ESPECÍFICO PARA SUBSECCIÓN "DESARROLLO Y CONSECUENCIAS DEL CONFLICTO"
  if (preguntaText.includes('principales sectores geográficos') || preguntaText.includes('sectores geográficos') || preguntaText.includes('Sectores') || preguntaText.includes('Geográficos')) {
    console.log('🚨 AUDIO DEBUG: MAPEO DETECTADO para sectores geográficos');
    console.log('🔍 Pregunta detectada:', preguntaText);
    console.log('🎵 Debería reproducir: 21_principales_sectores_geográficos.mp3');
    console.log('📁 Archivo debe estar en: /audios/respuestas_predefinidas/malvinas/conflicto_armado/');
    return { categoria: 'malvinas_desarrollo_conflicto', identificador: 'principales_sectores' };
  }
  if (preguntaText.includes('desarrollo del conflicto') || preguntaText.includes('desarrollo conflicto')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> desarrollo_conflicto');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'desarrollo_conflicto' };
  }
  if (preguntaText.includes('consecuencias del conflicto') || preguntaText.includes('consecuencias conflicto')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> consecuencias_conflicto');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'consecuencias_conflicto' };
  }
  if (preguntaText.includes('batallas destacadas') || preguntaText.includes('batallas más destacadas')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> batallas_destacadas');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'batallas_destacadas' };
  }
  if (preguntaText.includes('armamento utilizado') || preguntaText.includes('tipo de armamento')) {
    console.log('✅ MAPEO: malvinas_conflicto_armado -> armamento_utilizado');
    return { categoria: 'malvinas_conflicto_armado', identificador: 'armamento_utilizado' };
  }
  
  // 3. Impacto Social y Cultural - malvinas_impacto_social
  if (preguntaText.includes('impacto social') || preguntaText.includes('impacto cultural')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> respuesta_social');
    return { categoria: 'malvinas_impacto_social', identificador: 'respuesta_social' };
  }
  if (preguntaText.includes('relato durante') || preguntaText.includes('durante conflicto')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> relato_durante_conflicto');
    return { categoria: 'malvinas_impacto_social', identificador: 'relato_durante_conflicto' };
  }
  if (preguntaText.includes('medios locales') || preguntaText.includes('prensa local')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> medios_locales');
    return { categoria: 'malvinas_impacto_social', identificador: 'medios_locales' };
  }
  if (preguntaText.includes('periódicos argentinos') || preguntaText.includes('periodicos argentinos')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> periodicos_argentinos');
    return { categoria: 'malvinas_impacto_social', identificador: 'periodicos_argentinos' };
  }
  if (preguntaText.includes('cartas') && preguntaText.includes('soldados')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> participacion_estudiantil');
    return { categoria: 'malvinas_impacto_social', identificador: 'participacion_estudiantil' };
  }
  if (preguntaText.includes('donaciones') || preguntaText.includes('respuesta social')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> respuesta_social');
    return { categoria: 'malvinas_impacto_social', identificador: 'respuesta_social' };
  }
  if (preguntaText.includes('veteranos') || preguntaText.includes('relatos veteranos')) {
    console.log('✅ MAPEO: malvinas_impacto_social -> relatos_veteranos');
    return { categoria: 'malvinas_impacto_social', identificador: 'relatos_veteranos' };
  }
  
  // 4. Legado y Realidad Actual - malvinas_legado_actual
  if (preguntaText.includes('legado') || preguntaText.includes('realidad actual')) {
    console.log('✅ MAPEO: malvinas_legado_actual -> situacion_actual');
    return { categoria: 'malvinas_legado_actual', identificador: 'situacion_actual' };
  }
  if (preguntaText.includes('situación actual') || preguntaText.includes('situacion actual')) {
    console.log('✅ MAPEO: malvinas_legado_actual -> situacion_actual');
    return { categoria: 'malvinas_legado_actual', identificador: 'situacion_actual' };
  }
  if (preguntaText.includes('cementerio') || preguntaText.includes('darwin')) {
    console.log('✅ MAPEO: malvinas_legado_actual -> creacion');
    return { categoria: 'malvinas_legado_actual', identificador: 'creacion' };
  }
  if (preguntaText.includes('identificación') && preguntaText.includes('restos')) {
    console.log('✅ MAPEO: malvinas_legado_actual -> identificacion_restos');
    return { categoria: 'malvinas_legado_actual', identificador: 'identificacion_restos' };
  }
  if (preguntaText.includes('pesca') || preguntaText.includes('importancia económica')) {
    console.log('✅ MAPEO: malvinas_legado_actual -> importancia_economica');
    return { categoria: 'malvinas_legado_actual', identificador: 'importancia_economica' };
  }
  if (preguntaText.includes('relaciones') && (preguntaText.includes('británicas') || preguntaText.includes('britanicas'))) {
    console.log('✅ MAPEO: malvinas_legado_actual -> relaciones_argentino_britanicas');
    return { categoria: 'malvinas_legado_actual', identificador: 'relaciones_argentino_britanicas' };
  }
  
  // Mapeo genérico para Malvinas (por subsección más probable)
  if (preguntaText.includes('malvinas') && !preguntaText.includes('escuela') && !preguntaText.includes('argentinas')) {
    console.log('✅ MAPEO GENÉRICO: Detectada pregunta sobre Malvinas -> contexto_geografico/historia');
    return { categoria: 'malvinas_contexto_geografico', identificador: 'historia' };
  }
  
  console.log('🎵 ❌ NO SE ENCONTRÓ MAPEO DE AUDIO PARA:', pregunta.pregunta);
  console.log('🔍 Texto procesado:', preguntaText);
  return null;
}

export default function RespuestaPredefinida({
  pregunta,
  onVolver,
  onRespuestaCompleta,
  onVisualizadorAbierto,
  onShowInventoryModal,
}) {
  // Validación temprana para evitar errores
  if (!pregunta || !pregunta.pregunta || !pregunta.respuesta) {
    console.error('❌ RespuestaPredefinida: Datos de pregunta inválidos:', pregunta);
    return null;
  }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mostrarVisualizador, setMostrarVisualizador] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [audioSyncDuration, setAudioSyncDuration] = useState(null); // Duración real del audio
  const [respuestaEnProceso, setRespuestaEnProceso] = useState(false); // Evitar múltiples llamadas
  
  // 🎯 ESTADOS PARA SINCRONIZACIÓN MANUAL
  const [modoSincronizacionManual, setModoSincronizacionManual] = useState(false);
  const [ajusteManualActual, setAjusteManualActual] = useState(0);
  const [mostrarIndicadorAjuste, setMostrarIndicadorAjuste] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false); // Controlar inicio de subtítulos
  
  // Detectar si es la pregunta del buscador de inventario
  const esBuscadorInventario = pregunta && (
    (pregunta.pregunta && pregunta.pregunta.includes("Buscador de artículos del Inventario")) ||
    pregunta.isInventorySearch
  );
  
  // Abrir modal del inventario si es la pregunta correspondiente
  useEffect(() => {
    if (esBuscadorInventario && onShowInventoryModal) {
      console.log('🏛️ Detectado buscador de inventario, abriendo modal en 1 segundo...');
      // Pequeño delay para que se vea la respuesta antes de abrir el modal
      const timer = setTimeout(() => {
        console.log('🏛️ Abriendo modal de inventario ahora...');
        onShowInventoryModal();
      }, 1000); // 1 segundo después de mostrar la respuesta
      
      return () => clearTimeout(timer);
    }
  }, [esBuscadorInventario, onShowInventoryModal]);
  
  const [textosEditados, setTextosEditados] = useState({});
  const [edicionGlobal, setEdicionGlobal] = useState(true);
  const [estilosGlobales, setEstilosGlobales] = useState(() => {
    const estilosGuardados = cargarEstilosGlobales();
    return (
      estilosGuardados || {
        width: "900px",
        fontSize: "1.6rem",
        lineHeight: "1.4",
        bottom: "1rem",
        marginBottom: "0.5rem",
      }
    );
  });
  const [estilosIndividuales, setEstilosIndividuales] = useState({});

  const estilosDefecto = {
    width: "900px",
    fontSize: "1.6rem",
    lineHeight: "1.4",
    bottom: "1rem",
    marginBottom: "0.5rem",
  };

  // Obtener estilos actuales (globales o individuales)
  const estilosActuales = edicionGlobal
    ? estilosGlobales
    : estilosIndividuales[currentIdx] || estilosGlobales;

  // Crear bloques optimizados
  const textBlocks = useMemo(() => {
    const blocks = createOptimizedTextBlocks(pregunta.respuesta);
    console.log(`📝 Respuesta dividida en ${blocks.length} bloques:`, blocks);
    return blocks;
  }, [pregunta.respuesta]);

  const currentBlock = textBlocks[currentIdx] || "";
  const currentDisplayText = textosEditados[currentIdx] || currentBlock;
  const advanceTimeout = useRef();
  const shiftPressCount = useRef(0);
  const shiftTimer = useRef(null);


  // 🎵 SISTEMA DE AUDIO FINAL CON SINCRONIZACIÓN ESPECÍFICA
  const [lastProcessedQuestion, setLastProcessedQuestion] = useState('');
  const audioProcessingRef = useRef(false); // Bandera para evitar ejecuciones múltiples
  const [sincronizacionEspecifica, setSincronizacionEspecifica] = useState(null);
  
  // 🎯 Función para obtener configuración de sincronización específica
  const obtenerSincronizacion = useCallback((pregunta) => {
    const q = pregunta.pregunta.toLowerCase().trim();
    
    // Mapeo de preguntas a claves de sincronización
    const mapeoSincronizacion = {
      // Delfín Austral
      '¡hola!': { categoria: 'delfin_austral', clave: 'presentacion' },
      '¿qué eres?': { categoria: 'delfin_austral', clave: 'naturaleza' },
      '¿para qué fuiste creado?': { categoria: 'delfin_austral', clave: 'proposito' },
      '¿qué puedes hacer?': { categoria: 'delfin_austral', clave: 'funcionalidades' },
      
      // Escuela Secundaria
      '¿cuándo se fundó la escuela y dónde se encuentra ubicada?': { categoria: 'escuela_secundaria', clave: 'historia_ubicacion' },
      '¿por qué se llama "malvinas argentinas" y qué proyectos importantes ha desarrollado?': { categoria: 'escuela_secundaria', clave: 'nombre_proyectos' },
      '¿la escuela cuenta con espacios dedicados a exhibir su historia y trabajos estudiantiles?': { categoria: 'escuela_secundaria', clave: 'espacios_historia_trabajos' },
      '¿quiénes diseñaron el logo y la bandera de la escuela y qué simbolizan?': { categoria: 'escuela_secundaria', clave: 'logo_bandera' },
      '¿quiénes forman el equipo directivo de la escuela?': { categoria: 'escuela_secundaria', clave: 'equipo_directivo' },
      '¿la escuela cuenta con espacios dedicados a la educación técnica?': { categoria: 'escuela_secundaria', clave: 'espacios_educativos' },
      
      // Museo Escolar
      '¿qué es el museo escolar?': { categoria: 'museo_escolar', clave: 'definicion' },
      '¿cuáles son los objetivos del museo escolar?': { categoria: 'museo_escolar', clave: 'objetivos' },
      '¿qué actividades se realizan en el museo escolar?': { categoria: 'museo_escolar', clave: 'actividades' },
      '¿qué recursos están disponibles en el museo escolar?': { categoria: 'museo_escolar', clave: 'recursos' },
      
      // Malvinas - Contexto Geográfico Histórico
      '¿quién descubrió las islas malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'descubrimiento' },
      '¿cuál es la historia territorial de las malvinas antes de 1982?': { categoria: 'malvinas_contexto_geografico', clave: 'historia' },
      '¿cual es la bandera actual de las islas malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'bandera' },
      '¿quién es considerado el fundador de la presencia argentina en malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'fundador' },
      '¿quién fue el primer gobernador británico de las malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'primer_gobernador' },
      '¿qué tipos de plantas existen en las islas malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'flora' },
      '¿qué animales habitan en las malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'fauna' },
      '¿cuáles son las principales actividades económicas de las malvinas?': { categoria: 'malvinas_contexto_geografico', clave: 'actividades_economicas' },
      
      // Malvinas - Desarrollo y Consecuencias del Conflicto Armado (1982)
      '¿cuándo comenzó la guerra de malvinas?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'inicio_conflicto' },
      '¿cuándo y cómo comenzó la guerra de malvinas?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'inicio_conflicto' },
      '¿cuándo terminó el conflicto?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'consecuencias_conflicto' },
      '¿cómo se desarrolló el conflicto?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'desarrollo_conflicto' },
      '¿cuáles fueron las batallas más importantes?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'batallas_destacadas' },
      '¿qué armamento se utilizó en la guerra?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'armamento_utilizado' },
      '¿cuál fue el impacto del hundimiento del ara general belgrano?': { categoria: 'malvinas_conflicto_armado', clave: 'impacto_belgrano' },
      '¿qué armamento utilizaron argentina y reino unido durante la guerra de malvinas?': { categoria: 'malvinas_conflicto_armado', clave: 'armamento' },
      '¿cuál fue el arma más efectiva de argentina?': { categoria: 'malvinas_conflicto_armado', clave: 'arma_mas_efectiva' },
      '¿quiénes son considerados héroes en la guerra de malvinas?': { categoria: 'malvinas_conflicto_armado', clave: 'heroes' },
      '¿cuál fue el rol de los pilotos argentinos en el conflicto?': { categoria: 'malvinas_conflicto_armado', clave: 'rol_pilotos' },
      '¿qué desafíos enfrentaron los pilotos durante las operaciones?': { categoria: 'malvinas_conflicto_armado', clave: 'desafios_pilotos' },
      '¿cuántas bajas y heridos hubo en ambos bandos durante la guerra?': { categoria: 'malvinas_conflicto_armado', clave: 'bajas_heridos' },
      '¿cómo se financiaron argentina y reino unido durante el conflicto?': { categoria: 'malvinas_conflicto_armado', clave: 'suministros_economicos' },
      '¿hubo sanciones económicas durante la guerra?': { categoria: 'malvinas_conflicto_armado', clave: 'sanciones_economicas' },
      '¿cuáles son los principales sectores geográficos de las islas malvinas?': { categoria: 'malvinas_desarrollo_conflicto', clave: 'principales_sectores' },
      '¿participaron perros en la guerra de malvinas?': { categoria: 'malvinas_conflicto_armado', clave: 'participacion_perros' },
      '¿por qué no se menciona su participación en muchos relatos históricos?': { categoria: 'malvinas_conflicto_armado', clave: 'memoria_historica_perros' },
      
      // Malvinas - Impacto Social y Cultural
      '¿cómo se informaba sobre la guerra de malvinas en argentina mientras ocurría?': { categoria: 'malvinas_impacto_social', clave: 'relato_durante_conflicto' },
      '¿qué rol jugaron los medios locales frente a la censura nacional?': { categoria: 'malvinas_impacto_social', clave: 'medios_locales' },
      '¿cómo retrataron los periódicos argentinos la guerra de malvinas?': { categoria: 'malvinas_impacto_social', clave: 'periodicos_argentinos' },
      '¿hubo diferencias entre medios nacionales y regionales?': { categoria: 'malvinas_impacto_social', clave: 'diferencias_regionales' },
      '¿cómo respondió la sociedad argentina con donaciones durante la guerra?': { categoria: 'malvinas_impacto_social', clave: 'respuesta_social' },
      '¿qué simbolizaban estas donaciones para la sociedad?': { categoria: 'malvinas_impacto_social', clave: 'simbolismo' },
      '¿cómo participaron los estudiantes argentinos mediante cartas durante la guerra de malvinas?': { categoria: 'malvinas_impacto_social', clave: 'participacion_estudiantil' },
      '¿qué simbolizaban estas cartas para los soldados?': { categoria: 'malvinas_impacto_social', clave: 'simbolismo_soldados' },
      '¿qué relatos contienen las cartas escritas por veteranos de la guerra?': { categoria: 'malvinas_impacto_social', clave: 'relatos_veteranos' },
      '¿cómo afectaron estas cartas a las familias?': { categoria: 'malvinas_impacto_social', clave: 'impacto_familias' },
      '¿qué cartas dejaron los soldados que murieron en combate?': { categoria: 'malvinas_impacto_social', clave: 'ultimas_cartas' },
      '¿cómo se preservan hoy estas cartas?': { categoria: 'malvinas_impacto_social', clave: 'preservacion' },
      '¿cómo comunicaban los familiares su apoyo a los soldados en malvinas?': { categoria: 'malvinas_impacto_social', clave: 'comunicacion_apoyo' },
      '¿qué dificultades enfrentaron para mantener contacto?': { categoria: 'malvinas_impacto_social', clave: 'dificultades_contacto' },
      
      // Malvinas - Legado y Realidad Actual
      '¿cuál es la situación actual de las islas malvinas?': { categoria: 'malvinas_legado_actual', clave: 'situacion_actual' },
      '¿cómo y cuándo se creó el cementerio de darwin en malvinas?': { categoria: 'malvinas_legado_actual', clave: 'creacion' },
      '¿cómo se identificaron los restos de los soldados argentinos en darwin?': { categoria: 'malvinas_legado_actual', clave: 'identificacion_restos' },
      '¿cuál es la importancia de la pesca en las islas malvinas?': { categoria: 'malvinas_legado_actual', clave: 'importancia_economica' },
      '¿cómo afecta esto a las relaciones argentino-británicas?': { categoria: 'malvinas_legado_actual', clave: 'relaciones_argentino_britanicas' }
    };
    
    const mapeo = mapeoSincronizacion[q];
    if (mapeo && sincronizacionAudio[mapeo.categoria] && sincronizacionAudio[mapeo.categoria][mapeo.clave]) {
      console.log('🎯 Sincronización específica encontrada:', mapeo);
      return sincronizacionAudio[mapeo.categoria][mapeo.clave];
    }
    
    console.log('⚠️ No se encontró sincronización específica para:', q);
    return null;
  }, []);
  
  useEffect(() => {
    if (!pregunta?.pregunta) return;
    
    // 🚫 EVITAR EJECUCIONES MÚLTIPLES - DOBLE PROTECCIÓN
    if (pregunta.pregunta === lastProcessedQuestion) {
      console.log('🚫 PREGUNTA YA PROCESADA, IGNORANDO');
      return;
    }
    
    if (audioProcessingRef.current) {
      console.log('🚫 AUDIO YA EN PROCESAMIENTO, IGNORANDO');
      return;
    }
    
    console.log('🎵 === PROCESANDO NUEVA PREGUNTA CON SINCRONIZACIÓN ESPECÍFICA ===');
    console.log('📝 Pregunta:', pregunta.pregunta);
    
    // Marcar como en procesamiento
    audioProcessingRef.current = true;
    setLastProcessedQuestion(pregunta.pregunta);
    
    // 🎯 Obtener configuración de sincronización específica
    const configSincronizacion = obtenerSincronizacion(pregunta);
    setSincronizacionEspecifica(configSincronizacion);
    
    // 🎵 REPRODUCIR AUDIO CON SISTEMA FINAL
    audioManagerFinal.play(
      pregunta,
      // onLoaded
      (duration) => {
        if (configSincronizacion) {
          console.log('🎯 Usando sincronización específica - Duración:', configSincronizacion.duracionTotal + 'ms');
          setAudioSyncDuration(configSincronizacion.duracionTotal);
        } else {
          console.log('⚠️ Usando duración de audio detectada:', duration * 1000 + 'ms');
          setAudioSyncDuration(duration * 1000);
        }
        setAudioStarted(true);
        console.log('🎵 ✅ AUDIO ÚNICO CARGADO CON SINCRONIZACIÓN');
        audioProcessingRef.current = false; // Marcar como completado
      },
      // onEnded
      () => {
        console.log('🎵 Audio terminado naturalmente');
        setAudioStarted(false);
        setSincronizacionEspecifica(null);
        audioProcessingRef.current = false; // Marcar como completado
      }
    ).catch(error => {
      console.error('❌ Error reproduciendo audio:', error);
      setSincronizacionEspecifica(null);
      audioProcessingRef.current = false; // Marcar como completado en caso de error
    });
    
  }, [pregunta.pregunta, obtenerSincronizacion]); // ✅ SOLO pregunta.pregunta como dependencia

  // Detector de doble Shift para modo edición
  const handleKeyDown = useCallback((event) => {
    if (event.key === "Shift") {
      shiftPressCount.current += 1;

      if (shiftTimer.current) {
        clearTimeout(shiftTimer.current);
      }

      if (shiftPressCount.current === 2) {
        const nuevoModoEdicion = !modoEdicion;
        
        // Si estamos saliendo del modo edición, guardar cambios
        if (modoEdicion && !nuevoModoEdicion) {
          guardarCambiosPermanentes();
        }
        
        setModoEdicion(nuevoModoEdicion);
        shiftPressCount.current = 0;
      } else {
        shiftTimer.current = setTimeout(() => {
          shiftPressCount.current = 0;
        }, 500);
      }
    }
  }, []);

  // Event listener para teclado
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (shiftTimer.current) {
        clearTimeout(shiftTimer.current);
      }
    };
  }, [handleKeyDown]);

  // 🎯 SISTEMA DE SINCRONIZACIÓN PERFECTA MEJORADO
  useEffect(() => {
    if (!textBlocks.length || modoEdicion) {
      console.log('⏸️ Avance pausado:', { textBlocksLength: textBlocks.length, modoEdicion });
      return;
    }

    if (advanceTimeout.current) {
      clearTimeout(advanceTimeout.current);
      console.log('⏰ Timeout anterior cancelado');
    }

    console.log(`📍 Bloque actual: ${currentIdx + 1}/${textBlocks.length} - "${currentDisplayText.substring(0, 50)}..."`);

    if (currentIdx >= textBlocks.length - 1) {
      // Último bloque - MANTENER ABIERTO PARA LECTURA COMPLETA
      console.log('🏁 ÚLTIMO BLOQUE - Manteniendo abierto para lectura completa');
      console.log('📖 Usuario puede leer tranquilamente sin presión de tiempo');
      return;
    }

    // 🎵 CÁLCULO DE TIEMPO MEJORADO PARA SINCRONIZACIÓN PERFECTA
    let readingTime;
    
    if (audioSyncDuration && audioStarted && textBlocks.length > 0) {
      // ✅ MODO SINCRONIZADO CON AUDIO - SINCRONIZACIÓN PERFECTA
      
      if (sincronizacionEspecifica && sincronizacionEspecifica.bloques) {
        // 🎯 SINCRONIZACIÓN ESPECÍFICA - Usar tiempos exactos por bloque CON AJUSTE DE BUFFER
        console.log('🎯 Usando sincronización específica con bloques definidos');
        
        const bloqueActual = sincronizacionEspecifica.bloques[currentIdx];
        if (bloqueActual) {
          // 🔧 AJUSTE LENTO: Los subtítulos van más lentos que el audio
          const bufferSeguridad = 500; // 500ms de buffer adicional
          const factorSeguridad = 1.15; // 15% más tiempo que el audio (más lento)
          readingTime = (bloqueActual.duracion * factorSeguridad) + bufferSeguridad;
          
          console.log(`🎯 ✅ SINCRONIZACIÓN LENTA:`);
          console.log(`   📊 Bloque ${currentIdx + 1}: ${bloqueActual.duracion}ms (original) × ${factorSeguridad} + ${bufferSeguridad}ms = ${readingTime}ms`);
          console.log(`   📝 Texto esperado: "${bloqueActual.texto.substring(0, 50)}..."`);
          console.log(`   📝 Texto actual: "${currentDisplayText.substring(0, 50)}..."`);
          console.log(`   ⏱️ Tiempo total más lento: ${(readingTime/1000).toFixed(2)}s`);
        } else {
          // Fallback mejorado si no hay bloque específico
          const timePerBlock = audioSyncDuration / textBlocks.length;
          const currentBlockLength = currentDisplayText.length;
          const averageBlockLength = textBlocks.reduce((sum, block) => sum + block.length, 0) / textBlocks.length;
          const lengthRatio = currentBlockLength / averageBlockLength;
          
          // Aplicar factor de seguridad LENTO
          const factorFallback = 1.2; // 20% más tiempo que el audio (más lento)
          const bufferFallback = 400; // 400ms de buffer adicional
          readingTime = (timePerBlock * Math.max(1.0, Math.min(1.3, lengthRatio)) * factorFallback) + bufferFallback;
          console.log(`⚠️ Fallback LENTO - Bloque ${currentIdx + 1}: ${readingTime.toFixed(2)}ms`);
        }
      } else {
        // 📊 SINCRONIZACIÓN GENÉRICA MEJORADA - Más conservadora
        console.log('📊 Usando sincronización genérica mejorada');
        const timePerBlock = audioSyncDuration / textBlocks.length;
        const currentBlockLength = currentDisplayText.length;
        const averageBlockLength = textBlocks.reduce((sum, block) => sum + block.length, 0) / textBlocks.length;
        const lengthRatio = currentBlockLength / averageBlockLength;
        
        // 🔧 AJUSTE CRÍTICO LENTO: Los subtítulos van más lentos que el audio
        const factorSeguridad = 1.18; // 18% más tiempo que el audio (más lento)
        const bufferGenerico = 450; // 450ms de buffer adicional
        readingTime = (timePerBlock * Math.max(1.0, Math.min(1.3, lengthRatio)) * factorSeguridad) + bufferGenerico;
        
        console.log(`🎵 ✅ SINCRONIZACIÓN GENÉRICA MEJORADA:`);
        console.log(`   📊 Audio total: ${(audioSyncDuration/1000).toFixed(2)}s`);
        console.log(`   📊 Tiempo base por bloque: ${(timePerBlock/1000).toFixed(2)}s`);
        console.log(`   📊 Factor de seguridad: ${factorSeguridad}x`);
        console.log(`   📊 Buffer adicional: ${bufferGenerico}ms`);
        console.log(`   📊 Longitud bloque actual: ${currentBlockLength} chars`);
        console.log(`   📊 Longitud promedio: ${averageBlockLength.toFixed(0)} chars`);
        console.log(`   📊 Ratio de ajuste: ${lengthRatio.toFixed(2)}`);
        console.log(`   ⏱️ Tiempo final bloque ${currentIdx + 1}: ${(readingTime/1000).toFixed(2)}s`);
      }
      
    } else {
      // 🚫 SIN AUDIO - Usar tiempo de lectura MÁS LENTO
      console.log('🚫 SIN SINCRONIZACIÓN DE AUDIO - Usando tiempo de lectura más lento');
      readingTime = calculateReadingTime(currentDisplayText) * 1.4; // 40% más tiempo de lectura
    }

    // 🎯 APLICAR AJUSTE MANUAL SI EXISTE
    const duracionFinal = manualSyncManager.calcularDuracionAjustada(readingTime, pregunta, currentIdx);
    
    // 🚀 PROGRAMAR AVANCE AL SIGUIENTE BLOQUE CON TIEMPO AJUSTADO (INCLUYENDO AJUSTES MANUALES)
    advanceTimeout.current = setTimeout(() => {
      console.log(`➡️ AVANZANDO CON SINCRONIZACIÓN EQUILIBRADA: Bloque ${currentIdx + 1} → ${currentIdx + 2}/${textBlocks.length}`);
      setCurrentIdx((idx) => {
        const nextIdx = idx + 1;
        console.log(`✅ Índice actualizado: ${idx} → ${nextIdx}`);
        
        // 🔧 VERIFICACIÓN: Si llegamos al final, marcar respuesta como completa
        if (nextIdx >= textBlocks.length) {
          console.log('🏁 RESPUESTA COMPLETADA - Todos los bloques mostrados');
          if (onRespuestaCompleta) {
            setTimeout(() => {
              console.log('📞 Llamando onRespuestaCompleta');
              onRespuestaCompleta();
            }, 500);
          }
        }
        
        return nextIdx;
      });
    }, duracionFinal);

    return () => {
      if (advanceTimeout.current) {
        clearTimeout(advanceTimeout.current);
        advanceTimeout.current = null;
        console.log('🧹 Cleanup: timeout cancelado y limpiado');
      }
    };
  }, [
    currentIdx,
    textBlocks.length,
    onRespuestaCompleta,
    modoEdicion,
    currentDisplayText,
    audioSyncDuration,
    audioStarted,
    sincronizacionEspecifica,
  ]);

  useEffect(() => {
    if (onVisualizadorAbierto) onVisualizadorAbierto(mostrarVisualizador);
  }, [mostrarVisualizador, onVisualizadorAbierto]);

  // Guardar estilos globales en localStorage cuando cambien
  useEffect(() => {
    guardarEstilosGlobales(estilosGlobales);
  }, [estilosGlobales]);

  // 🎯 ESTABLECER RESPUESTA EN PROCESO CUANDO HAY BLOQUES DE TEXTO
  useEffect(() => {
    if (textBlocks.length > 0 && currentIdx < textBlocks.length) {
      setRespuestaEnProceso(true);
      console.log('🎯 RESPUESTA EN PROCESO ACTIVADA - Sincronización manual disponible');
    } else {
      setRespuestaEnProceso(false);
      console.log('🎯 RESPUESTA COMPLETADA - Sincronización manual desactivada');
    }
  }, [textBlocks.length, currentIdx]);

  // 🎯 MANEJO DE TECLAS G y H PARA SINCRONIZACIÓN MANUAL MEJORADO
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Solo funcionar si no estamos en modo edición y hay bloques de texto
      if (modoEdicion || textBlocks.length === 0) {
        console.log(`🚫 TECLA IGNORADA: ${event.key} - Modo edición: ${modoEdicion}, Bloques: ${textBlocks.length}`);
        return;
      }
      
      console.log(`🎯 TECLA DETECTADA: ${event.key}, Modo edición: ${modoEdicion}, Bloque actual: ${currentIdx + 1}/${textBlocks.length}`);

      const key = event.key.toLowerCase();
      
      // 🎯 NAVEGACIÓN ENTRE BLOQUES: TAB + FLECHAS IZQUIERDA/DERECHA
      if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          // Tab + Shift: Ir al bloque anterior
          const nuevoIdx = Math.max(0, currentIdx - 1);
          if (nuevoIdx !== currentIdx) {
            setCurrentIdx(nuevoIdx);
            console.log(`⬅️ TAB+SHIFT: Navegando al bloque anterior ${nuevoIdx + 1}/${textBlocks.length}`);
            console.log(`📝 Bloque actual: "${textBlocks[nuevoIdx]?.substring(0, 50)}..."`);
          }
        } else {
          // Tab solo: Ir al bloque siguiente
          const nuevoIdx = Math.min(textBlocks.length - 1, currentIdx + 1);
          if (nuevoIdx !== currentIdx) {
            setCurrentIdx(nuevoIdx);
            console.log(`➡️ TAB: Navegando al bloque siguiente ${nuevoIdx + 1}/${textBlocks.length}`);
            console.log(`📝 Bloque actual: "${textBlocks[nuevoIdx]?.substring(0, 50)}..."`);
          }
        }
        return;
      }

      // 🎯 NAVEGACIÓN CON TAB + FLECHAS (alternativa)
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.ctrlKey) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') {
          // Ctrl + Flecha Izquierda: Bloque anterior
          const nuevoIdx = Math.max(0, currentIdx - 1);
          if (nuevoIdx !== currentIdx) {
            setCurrentIdx(nuevoIdx);
            console.log(`⬅️ CTRL+FLECHA IZQUIERDA: Bloque ${nuevoIdx + 1}/${textBlocks.length}`);
          }
        } else {
          // Ctrl + Flecha Derecha: Bloque siguiente
          const nuevoIdx = Math.min(textBlocks.length - 1, currentIdx + 1);
          if (nuevoIdx !== currentIdx) {
            setCurrentIdx(nuevoIdx);
            console.log(`➡️ CTRL+FLECHA DERECHA: Bloque ${nuevoIdx + 1}/${textBlocks.length}`);
          }
        }
        return;
      }
      
      // 🆕 CTRL + G: Decrementar duración de TODA la respuesta
      if (event.ctrlKey && key === 'g') {
        event.preventDefault();
        const nuevoAjuste = manualSyncManager.decrementarDuracionGlobal(pregunta, textBlocks.length);
        setAjusteManualActual(nuevoAjuste);
        setModoSincronizacionManual(true);
        setMostrarIndicadorAjuste(true);
        setEsAjusteGlobal(true);
        
        // Mostrar indicador más tiempo para ajustes globales
        setTimeout(() => {
          setMostrarIndicadorAjuste(false);
          setEsAjusteGlobal(false);
        }, 3000);
        
        console.log(`🔧 CTRL+G - Decrementar duración GLOBAL: ${nuevoAjuste}ms por bloque`);
        
        // Aplicar ajuste inmediato si estamos reproduciendo
        aplicarAjusteInmediato();
        
      // 🆕 CTRL + H: Incrementar duración de TODA la respuesta  
      } else if (event.ctrlKey && key === 'h') {
        event.preventDefault();
        const nuevoAjuste = manualSyncManager.incrementarDuracionGlobal(pregunta, textBlocks.length);
        setAjusteManualActual(nuevoAjuste);
        setModoSincronizacionManual(true);
        setMostrarIndicadorAjuste(true);
        setEsAjusteGlobal(true);
        
        // Mostrar indicador más tiempo para ajustes globales
        setTimeout(() => {
          setMostrarIndicadorAjuste(false);
          setEsAjusteGlobal(false);
        }, 3000);
        
        console.log(`🔧 CTRL+H - Incrementar duración GLOBAL: ${nuevoAjuste}ms por bloque`);
        
        // Aplicar ajuste inmediato si estamos reproduciendo
        aplicarAjusteInmediato();
        
      } else if (key === 'g' && currentIdx < textBlocks.length) {
        // Tecla G: Decrementar duración del bloque actual
        event.preventDefault();
        const nuevoAjuste = manualSyncManager.decrementarDuracion(pregunta, currentIdx);
        setAjusteManualActual(nuevoAjuste);
        setModoSincronizacionManual(true);
        setMostrarIndicadorAjuste(true);
        
        // Ocultar indicador después de 2 segundos
        setTimeout(() => setMostrarIndicadorAjuste(false), 2000);
        
        console.log(`🔧 TECLA G - Decrementar duración bloque ${currentIdx + 1}: ${nuevoAjuste}ms`);
        console.log(`💾 Cambio guardado permanentemente en el proyecto`);
        
        // Aplicar ajuste inmediato si estamos reproduciendo
        aplicarAjusteInmediato();
        
      } else if (key === 'h' && currentIdx < textBlocks.length) {
        // Tecla H: Incrementar duración del bloque actual
        event.preventDefault();
        const nuevoAjuste = manualSyncManager.incrementarDuracion(pregunta, currentIdx);
        setAjusteManualActual(nuevoAjuste);
        setModoSincronizacionManual(true);
        setMostrarIndicadorAjuste(true);
        
        // Ocultar indicador después de 2 segundos
        setTimeout(() => setMostrarIndicadorAjuste(false), 2000);
        
        console.log(`🔧 TECLA H - Incrementar duración bloque ${currentIdx + 1}: ${nuevoAjuste}ms`);
        console.log(`💾 Cambio guardado permanentemente en el proyecto`);
        
        // Aplicar ajuste inmediato si estamos reproduciendo
        aplicarAjusteInmediato();
      }
    };

    // 🆕 Función para aplicar ajuste inmediato durante la reproducción
    const aplicarAjusteInmediato = () => {
      if (advanceTimeout.current && currentIdx < textBlocks.length) {
        clearTimeout(advanceTimeout.current);
        
        // Calcular duración base del bloque actual
        let readingTime = calculateReadingTime(currentDisplayText) * 1.4;
        if (audioSyncDuration) {
          const timePerBlock = audioSyncDuration / textBlocks.length;
          readingTime = timePerBlock * 1.18 + 450;
        }
        
        // Aplicar el ajuste manual específico para este bloque
        const duracionAjustada = manualSyncManager.calcularDuracionAjustada(readingTime, pregunta, currentIdx);
        
        console.log(`⏱️ DURACIÓN ACTUALIZADA INMEDIATAMENTE: ${(duracionAjustada/1000).toFixed(1)}s para bloque ${currentIdx + 1}`);
        
        // Programar nuevo timeout con la duración ajustada
        advanceTimeout.current = setTimeout(() => {
          setCurrentIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= textBlocks.length && onRespuestaCompleta) {
              setTimeout(() => onRespuestaCompleta(), 500);
            }
            return nextIdx;
          });
        }, duracionAjustada);
      }
    };

    // Agregar event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [modoEdicion, currentIdx, pregunta, textBlocks.length, currentDisplayText, audioSyncDuration, onRespuestaCompleta, advanceTimeout]);

  // Función para guardar texto editado del bloque actual
  const handleTextChange = (newText) => {
    setTextosEditados((prev) => ({
      ...prev,
      [currentIdx]: newText,
    }));
  };

  // Función para guardar cambios permanentemente
  const guardarCambiosPermanentes = async () => {
    if (Object.keys(textosEditados).length === 0) return;

    try {
      console.log('💾 Guardando cambios permanentes...', {
        pregunta: pregunta.pregunta,
        textosEditados
      });

      // Crear nueva respuesta con textos editados
      const nuevaRespuesta = textBlocks.map((bloque, index) => {
        return textosEditados[index] || bloque;
      }).join(' ');

      // Enviar al servidor para guardar en archivos
      const response = await fetch('http://localhost:5005/api/guardar-edicion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pregunta: pregunta.pregunta,
          nuevaRespuesta,
          textosEditados,
          categoria: obtenerCategoriaPregunta(pregunta)?.categoria,
          clave: obtenerCategoriaPregunta(pregunta)?.clave
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cambios guardados permanentemente:', result);
        
        // Actualizar la respuesta local
        pregunta.respuesta = nuevaRespuesta;
        
        // Mostrar notificación visual
        alert('💾 Cambios guardados permanentemente en los archivos del proyecto');
        
        // Limpiar textos editados
        setTextosEditados({});
      } else {
        console.error('❌ Error al guardar cambios');
        alert('❌ Error al guardar cambios. Verifica que el servidor de edición esté ejecutándose.');
      }
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
    }
  };

  return (
    <>
      {/* 🎯 ESTILOS CSS PARA ANIMACIONES DE SINCRONIZACIÓN MANUAL */}
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .manual-sync-indicator {
            animation: slideInRight 0.3s ease-out;
          }
          
          .manual-sync-controls {
            transition: all 0.3s ease;
          }
          
          .manual-sync-controls:hover {
            background: rgba(0, 0, 0, 0.9) !important;
            transform: scale(1.02);
          }
        `}
      </style>

      {/* Botón de volver */}
      <button
        onClick={() => {
          console.log('🔄 BOTÓN VOLVER - AudioManagerFinal');
          
          // 🔇 DETENER TODO CON SISTEMA FINAL
          audioManagerFinal.stopAll();
          
          // Cancelar timeouts
          if (advanceTimeout.current) {
            clearTimeout(advanceTimeout.current);
            advanceTimeout.current = null;
          }
          
          // Resetear estados
          setAudioSyncDuration(null);
          setAudioStarted(false);
          setRespuestaEnProceso(false);
          setCurrentIdx(0);
          setLastProcessedQuestion('');
          audioProcessingRef.current = false; // Resetear bandera de procesamiento
          
          console.log('🔇 ✅ Todo detenido con AudioManagerFinal');
          onVolver();
        }}
        title="Volver"
        style={{
          position: "fixed",
          top: "32px",
          left: "32px",
          zIndex: 100,
          pointerEvents: "auto",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid #0369a1",
          boxShadow: "rgba(2, 132, 199, 0.15) 0px 2px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease-out",
          padding: 0,
          pointerEvents: "auto", // IMPORTANTE: Hacer el botón interactivo
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "rgba(2, 132, 199, 0.25) 0px 4px 12px";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "rgba(2, 132, 199, 0.15) 0px 2px 8px";
        }}
      >
        <span
          style={{
            fontSize: "28px",
            display: "inline-block",
            transform: "rotate(180deg)",
            transition: "transform 0.3s ease-out",
            transformOrigin: "center center",
            lineHeight: 1,
            color: "#0369a1",
          }}
        >
          ➜
        </span>
      </button>

      {/* Indicador de modo edición */}
      {modoEdicion && (
        <div
          style={{
            position: "fixed",
            top: "32px",
            right: "32px",
            zIndex: 100,
            background: "rgba(255, 165, 0, 0.9)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "0.9rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
            animation: "pulse 2s infinite",
          }}
        >
          🎨 EDITANDO BLOQUE {currentIdx + 1}/{textBlocks.length}
        </div>
      )}

      {/* 🎯 INDICADOR DE SINCRONIZACIÓN MANUAL */}
      {mostrarIndicadorAjuste && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "32px",
            zIndex: 100,
            background: ajusteManualActual >= 0 ? "rgba(34, 197, 94, 0.95)" : "rgba(239, 68, 68, 0.95)",
            color: "white",
            padding: "16px 24px",
            borderRadius: "20px",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
            animation: "slideInRight 0.3s ease-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem" }}>
              {ajusteManualActual >= 0 ? "⬆️" : "⬇️"}
            </span>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.9, marginBottom: "2px" }}>
                BLOQUE {currentIdx + 1} - AJUSTE APLICADO
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                {ajusteManualActual >= 0 ? "+" : ""}{(ajusteManualActual / 1000).toFixed(1)}s
              </div>
              <div style={{ fontSize: "0.65rem", opacity: 0.8, marginTop: "2px", fontStyle: "italic" }}>
                ✅ Guardado para este bloque
              </div>
            </div>
          </div>
          
          {/* Controles disponibles */}
          <div style={{ 
            fontSize: "0.7rem", 
            opacity: 0.8, 
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            paddingTop: "6px",
            marginTop: "2px"
          }}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <span style={{ color: "#ffcccb" }}>G: -0.5s</span>
              <span style={{ color: "#c8e6c9" }}>H: +0.5s</span>
            </div>
          </div>
        </div>
      )}


      {/* Contenedor principal de subtítulos */}
      <div
        style={{
          position: "fixed",
          bottom: modoEdicion ? estilosActuales.bottom : "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "95%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: modoEdicion ? "2rem" : "0",
          background: modoEdicion
            ? "linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(30, 30, 30, 0.8))"
            : "none",
          borderRadius: modoEdicion ? "20px 20px 0 0" : "0",
          border: modoEdicion ? "2px solid rgba(255, 165, 0, 0.3)" : "none",
          transition: "all 0.3s ease",
          pointerEvents: "auto", // IMPORTANTE: Hacer el contenedor interactivo
        }}
      >
        {/* Modo edición */}
        {modoEdicion ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            {/* Panel de controles */}
            <div
              style={{
                position: "relative",
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                width: "100%",
              }}
            >
              {/* Botón de Toggle Edición Global/Individual */}
              <button
                onClick={() => setEdicionGlobal(!edicionGlobal)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "15px",
                  background: edicionGlobal ? "#10b981" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease",
                }}
                title={
                  edicionGlobal
                    ? "Cambiar a edición individual"
                    : "Cambiar a edición global"
                }
              >
                {edicionGlobal ? "🌍 GLOBAL" : "📝 INDIVIDUAL"}
              </button>

              {/* Botón de Reset */}
              <button
                onClick={() => {
                  if (edicionGlobal) {
                    const valoresSubtitulos = {
                      ...estilosDefecto,
                      bottom: "1rem",
                      marginBottom: "0.5rem",
                    };
                    setEstilosGlobales(valoresSubtitulos);
                    guardarEstilosGlobales(valoresSubtitulos);
                  } else {
                    const valoresSubtitulos = {
                      ...estilosDefecto,
                      bottom: "1rem",
                      marginBottom: "0.5rem",
                    };
                    setEstilosIndividuales((prev) => ({
                      ...prev,
                      [currentIdx]: valoresSubtitulos,
                    }));
                  }
                  setTextosEditados((prev) => ({
                    ...prev,
                    [currentIdx]: currentBlock,
                  }));
                }}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "15px",
                  background: "#ff6b35",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(255, 107, 53, 0.4)",
                  transition: "all 0.2s ease",
                }}
                title="Resetear valores por defecto"
              >
                ↺
              </button>

              {/* Controls */}
              {[
                {
                  label: "Ancho",
                  prop: "width",
                  min: 400,
                  max: 1200,
                  step: 50,
                  unit: "px",
                },
                {
                  label: "Tamaño",
                  prop: "fontSize",
                  min: 1,
                  max: 3,
                  step: 0.1,
                  unit: "rem",
                },
                {
                  label: "Interlineado",
                  prop: "lineHeight",
                  min: 1,
                  max: 2.5,
                  step: 0.1,
                  unit: "",
                },
                {
                  label: "📍 Altura desde abajo",
                  prop: "bottom",
                  min: 0,
                  max: 20,
                  step: 0.5,
                  unit: "rem",
                },
                {
                  label: "📏 Espaciado inferior",
                  prop: "marginBottom",
                  min: 0,
                  max: 5,
                  step: 0.25,
                  unit: "rem",
                },
              ].map(({ label, prop, min, max, step, unit }) => (
                <label
                  key={prop}
                  style={{
                    color: "white",
                    fontSize: "0.9rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "120px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{label}</span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={parseFloat(estilosActuales[prop])}
                    onChange={(e) => {
                      const newValue = e.target.value + (unit || "");
                      if (edicionGlobal) {
                        setEstilosGlobales((prev) => ({
                          ...prev,
                          [prop]: newValue,
                        }));
                      } else {
                        setEstilosIndividuales((prev) => ({
                          ...prev,
                          [currentIdx]: {
                            ...(prev[currentIdx] || estilosGlobales),
                            [prop]: newValue,
                          },
                        }));
                      }
                    }}
                    style={{
                      accentColor: "#ff6b35",
                      width: "100px",
                    }}
                  />
                  <span
                    style={{
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                    }}
                  >
                    {estilosActuales[prop]}
                  </span>
                </label>
              ))}
            </div>

            {/* Información del modo de edición */}
            <div
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.85rem",
                textAlign: "center",
                marginBottom: "0.8rem",
                padding: "0.4rem 0.8rem",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {edicionGlobal ? (
                <div>
                  <div>
                    🌍 <strong>MODO GLOBAL:</strong> Los cambios se aplican a
                    todos los bloques de todas las respuestas
                  </div>
                  <div
                    style={{
                      marginTop: "0.3rem",
                      fontSize: "0.75rem",
                      opacity: 0.8,
                    }}
                  >
                    📍 Posicionado como subtítulos reales en la parte inferior
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    📝 <strong>MODO INDIVIDUAL:</strong> Los cambios solo
                    afectan al bloque actual
                  </div>
                  <div
                    style={{
                      marginTop: "0.3rem",
                      fontSize: "0.75rem",
                      opacity: 0.8,
                    }}
                  >
                    🎯 Editando únicamente este bloque
                  </div>
                </div>
              )}
            </div>

            {/* Vista previa del texto editado */}
            <div
              style={{
                fontSize: estilosActuales.fontSize,
                lineHeight: estilosActuales.lineHeight,
                color: "white",
                textAlign: "center",
                width: estilosActuales.width,
                minHeight: "3rem",
                padding: "1rem 1.5rem",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "16px",
                border: "2px solid rgba(255, 107, 53, 0.5)",
                backdropFilter: "blur(8px)",
                textShadow: "none",
                fontWeight: "600",
                letterSpacing: "0.5px",
                wordWrap: "break-word",
                transition: "all 0.2s ease",
              }}
            >
              {currentDisplayText}
            </div>

            {/* Editor de texto */}
            <textarea
              value={currentDisplayText}
              onChange={(e) => handleTextChange(e.target.value)}
              style={{
                width: estilosActuales.width,
                height: "120px",
                fontSize: "1rem",
                lineHeight: "1.4",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                border: "2px solid rgba(255, 107, 53, 0.5)",
                borderRadius: "12px",
                padding: "1rem",
                textAlign: "left",
                resize: "vertical",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(5px)",
              }}
              placeholder="Edita el texto del bloque actual aquí..."
            />

            {/* Instrucciones */}
            <div
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.85rem",
                textAlign: "center",
                display: "flex",
                gap: "2rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "0.5rem",
              }}
            >
              <span>📝 Shift + Shift para continuar</span>
              <span>↺ Reset {edicionGlobal ? "global" : "bloque"}</span>
              <span>🌍/📝 Cambiar modo edición</span>
              <span>
                🎬 Bloque {currentIdx + 1} de {textBlocks.length}
              </span>
              <span>📍 Posición de subtítulos optimizada</span>
              <span style={{ color: "#22c55e" }}>🎵 G/H: Sincronización manual</span>
            </div>
            
            {/* 🎯 INFORMACIÓN ADICIONAL SOBRE SINCRONIZACIÓN MANUAL */}
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.75rem",
                textAlign: "center",
                marginTop: "0.8rem",
                padding: "0.8rem",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <div style={{ marginBottom: "0.4rem", fontWeight: "600", color: "#22c55e" }}>
                🎵 SINCRONIZACIÓN MANUAL DISPONIBLE
              </div>
              <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <span>🔴 <strong>G:</strong> Reducir duración (-0.5s)</span>
                <span>🟢 <strong>H:</strong> Aumentar duración (+0.5s)</span>
                <span>💾 Los ajustes se guardan automáticamente</span>
              </div>
              {manualSyncManager.obtenerEstadisticasAjustes(pregunta).bloquesAjustados > 0 && (
                <div style={{ marginTop: "0.4rem", color: "#fbbf24" }}>
                  📊 {manualSyncManager.obtenerEstadisticasAjustes(pregunta).bloquesAjustados} bloques con ajustes manuales
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Subtítulos reales en la parte inferior - ALTURA CONSISTENTE */
          <div
            style={{
              fontSize: estilosActuales.fontSize,
              lineHeight: estilosActuales.lineHeight,
              color: "white",
              textAlign: "center",
              width: estilosActuales.width,
              minHeight: "2rem", // Altura mínima consistente
              maxHeight: "6rem", // Altura máxima para evitar variaciones
              padding: "0.5rem 1rem",
              position: "relative",
              background: "none",
              border: "none",
              textShadow: "none",
              fontWeight: "600",
              letterSpacing: "0.6px",
              wordWrap: "break-word",
              transition: "all 0.2s ease",
              maxWidth: "95vw",
              margin: "0 auto",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              filter: "contrast(1.05) brightness(1.02)",
              fontOpticalSizing: "auto",
              marginBottom: estilosActuales.marginBottom,
              // Asegurar altura consistente usando flexbox
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentDisplayText}
          </div>
        )}

        {/* Visualizador multimedia */}
        {mostrarVisualizador && (
          <div style={{ marginTop: "1rem" }}>
            <VisualizadorMultimedia
              pregunta={pregunta.pregunta}
              archivo={pregunta.archivo}
              tipo={pregunta.tipo}
              info={pregunta.info}
              onClose={() => {
                setMostrarVisualizador(false);
                if (onVisualizadorAbierto) onVisualizadorAbierto(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
