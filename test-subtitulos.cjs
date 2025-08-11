// Script de prueba para el sistema de subtítulos optimizado
// Ejecutar con: node test-subtitulos.js

// Funciones copiadas del componente RespuestaPredefinida.jsx
function createOptimizedTextBlocks(text) {
  if (!text) return [];

  // Configuración optimizada para bloques de 2 oraciones
  const TARGET_SENTENCES_PER_BLOCK = 2;
  const MAX_CHARS_PER_BLOCK = 180; // Más permisivo para evitar cortes raros
  const MIN_WORDS_PER_BLOCK = 12; // Mínimo de palabras para un bloque

  // Normalizar texto y manejar abreviaciones comunes
  let normalizedText = text
    .replace(/\s+/g, " ")
    .replace(/E\.E\.S\./g, "E.E.S") // Proteger abreviaciones temporalmente
    .replace(/N°/g, "Nº") // Proteger números
    .replace(/([.!?])\s*/g, "$1 ")
    .trim();

  // Dividir en oraciones, pero siendo cuidadoso con abreviaciones
  const sentences = [];
  const parts = normalizedText.split(/([.!?]+)/);

  let currentSentence = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    if (part.match(/[.!?]+/)) {
      currentSentence += part;
      // Verificar si es una abreviación común que no debería terminar oración
      if (!currentSentence.match(/E\.E\.S\.|Dr\.|Sr\.|Sra\.|etc\.$/)) {
        sentences.push(currentSentence.trim());
        currentSentence = "";
      }
    } else {
      currentSentence += (currentSentence ? " " : "") + part;
    }
  }

  // Agregar último fragmento si existe
  if (currentSentence.trim()) {
    sentences.push(
      currentSentence.trim() + (currentSentence.match(/[.!?]$/) ? "" : "."),
    );
  }

  // Restaurar abreviaciones
  const cleanedSentences = sentences.map((s) =>
    s.replace(/E\.E\.S/g, "E.E.S.").replace(/Nº/g, "N°"),
  );

  const blocks = [];
  let currentBlock = "";
  let sentenceCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const testBlock = currentBlock ? `${currentBlock} ${sentence}` : sentence;

    // Si agregar esta oración excede los límites, finalizar el bloque actual
    if (
      sentenceCount >= TARGET_SENTENCES_PER_BLOCK ||
      (testBlock.length > MAX_CHARS_PER_BLOCK && currentBlock)
    ) {
      if (currentBlock) {
        blocks.push(currentBlock.trim());
        currentBlock = sentence;
        sentenceCount = 1;
      } else {
        // Si una sola oración es muy larga, dividirla
        blocks.push(...splitLongSentence(sentence, MAX_CHARS_PER_BLOCK));
        currentBlock = "";
        sentenceCount = 0;
      }
    } else {
      currentBlock = testBlock;
      sentenceCount++;
    }
  }

  // Agregar último bloque si existe
  if (currentBlock) {
    blocks.push(currentBlock.trim());
  }

  // Post-procesamiento: combinar bloques muy cortos con el siguiente si es posible
  const optimizedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const wordCount = block.split(" ").length;

    // Si el bloque tiene muy pocas palabras y no es el último, intentar combinarlo
    if (wordCount < MIN_WORDS_PER_BLOCK && i < blocks.length - 1) {
      const nextBlock = blocks[i + 1];
      const combined = `${block} ${nextBlock}`;

      if (
        combined.length <= MAX_CHARS_PER_BLOCK &&
        combined.split(" ").length <= 35
      ) {
        optimizedBlocks.push(combined);
        i++; // Saltar el siguiente bloque ya que lo combinamos
        continue;
      }
    }

    optimizedBlocks.push(block);
  }

  return optimizedBlocks.filter((block) => block.length > 0);
}

// Función para corregir problemas de división conocidos
function fixKnownDivisionProblems(blocks) {
  const fixedBlocks = [];

  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const nextBlock = blocks[i + 1];

    // Detectar fragmentos problemáticos que deben combinarse
    const problematicPatterns = [
      // Caso específico: "E.E." seguido de "S. N°3"
      { current: /E\.E\.\s*$/, next: /^S\.\s*N°/ },
      // Fragmentos muy cortos que terminan con abreviaciones
      { current: /\bDr\.\s*$/, next: /^[A-Z]/ },
      { current: /\bSr\.\s*$/, next: /^[A-Z]/ },
      { current: /\bSra\.\s*$/, next: /^[A-Z]/ },
      // Bloques que terminan de forma incompleta
      { current: /\bde\s+la\s*$/, next: /^[A-Z]/ },
      { current: /\bdel\s*$/, next: /^[A-Z]/ },
      { current: /\by\s*$/, next: /^[A-Z]/ },
    ];

    let shouldCombine = false;

    if (nextBlock) {
      // Verificar patrones problemáticos
      for (const pattern of problematicPatterns) {
        if (
          pattern.current.test(currentBlock) &&
          pattern.next.test(nextBlock)
        ) {
          shouldCombine = true;
          console.log(
            `🔧 Corrigiendo división problemática: "${currentBlock}" + "${nextBlock}"`,
          );
          break;
        }
      }

      // También combinar si el bloque actual es muy corto (menos de 15 caracteres)
      // y no termina con puntuación fuerte
      if (currentBlock.length < 15 && !currentBlock.match(/[.!?]$/)) {
        shouldCombine = true;
        console.log(
          `🔧 Combinando bloque muy corto: "${currentBlock}" + "${nextBlock}"`,
        );
      }
    }

    if (shouldCombine && nextBlock) {
      // Combinar bloques problemáticos
      const combinedBlock = `${currentBlock} ${nextBlock}`;
      fixedBlocks.push(combinedBlock);
      i++; // Saltar el siguiente bloque ya que lo combinamos
    } else {
      fixedBlocks.push(currentBlock);
    }
  }

  return fixedBlocks;
}

function splitLongSentence(sentence, maxLength) {
  const segments = [];
  const words = sentence.split(" ");
  let currentSegment = "";

  for (let word of words) {
    const testSegment = currentSegment ? `${currentSegment} ${word}` : word;

    if (testSegment.length <= maxLength) {
      currentSegment = testSegment;
    } else {
      if (currentSegment) {
        segments.push(currentSegment.trim());
      }
      currentSegment = word;
    }
  }

  if (currentSegment) {
    segments.push(currentSegment.trim());
  }

  return segments;
}

// Función para contar oraciones en un texto
function countSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.length;
}

function calculateReadingTime(text) {
  const wordsPerMinute = 170; // Velocidad solicitada
  const words = text.split(" ").length;
  const minutes = words / wordsPerMinute;
  const seconds = Math.max(2.5, Math.min(9, minutes * 60)); // Entre 2.5 y 9 segundos
  return seconds;
}

// Ejemplos de respuestas para probar
const testResponses = [
  {
    id: "presentacion",
    texto:
      "¡Hola! Soy Malvín fuí creado para acompañarte en el Museo Escolar de la Escuela de Educación Secundaria N°3 Malvinas Argentinas. Estoy aquí para enseñarte sobre las Islas Malvinas, nuestra historia, y ayudarte a descubrir los objetos del inventario del museo. ¡Comencemos a explorar juntos!",
  },
  {
    id: "naturaleza_que_eres",
    pregunta: "¿Qué eres?",
    texto:
      "Soy un chatbot 3D interactivo diseñado como parte del Museo Escolar de la E.E.S. N°3 Malvinas Argentinas. Mi apariencia está basada en un delfín Austral (Lagenorhynchus australis), una especie que habita en las aguas frías del Atlántico Sur, cerca de las Islas Malvinas. Fui creado para representar la conexión entre la historia de Malvinas y la identidad de esta escuela, combinando animaciones, audio, texto, imagen y video para enseñarte de forma interactiva.",
  },
  {
    id: "texto_corto",
    texto: "¡Hola! ¿Cómo estás?",
  },
  {
    id: "texto_medio",
    texto:
      "La guerra terminó el 14 de junio de 1982 con la rendición argentina en Puerto Argentino. Las tropas argentinas no pudieron resistir el avance británico.",
  },
  {
    id: "historia_malvinas",
    texto:
      "Las Islas Malvinas fueron descubiertas por navegantes europeos en el siglo XVI. Los españoles las llamaron Islas Malvinas, mientras que los británicos las denominaron Falkland Islands. Durante siglos, fueron objeto de disputa entre diferentes potencias coloniales, incluyendo España, Francia y Gran Bretaña. La soberanía argentina se basa en la herencia del territorio colonial español y la ocupación efectiva posterior a la independencia.",
  },
];

// Función para mostrar estadísticas detalladas
function analizarRespuesta(respuesta) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`📝 ANÁLISIS: ${respuesta.id.toUpperCase()}`);
  if (respuesta.pregunta) {
    console.log(`❓ PREGUNTA: "${respuesta.pregunta}"`);
  }
  console.log(`${"=".repeat(80)}`);

  console.log(`\n📄 TEXTO ORIGINAL:`);
  console.log(`"${respuesta.texto}"`);
  console.log(`\nLongitud: ${respuesta.texto.length} caracteres`);
  console.log(`Palabras: ${respuesta.texto.split(" ").length}`);

  const initialBlocks = createOptimizedTextBlocks(respuesta.texto);
  const blocks = fixKnownDivisionProblems(initialBlocks);

  console.log(`\n🔧 CORRECCIÓN DE DIVISIONES:`);
  if (initialBlocks.length !== blocks.length) {
    console.log(`   • Bloques iniciales: ${initialBlocks.length}`);
    console.log(`   • Bloques corregidos: ${blocks.length}`);
    console.log(
      `   • Correcciones aplicadas: ${initialBlocks.length - blocks.length}`,
    );
  } else {
    console.log(`   • No se requirieron correcciones`);
  }

  console.log(`\n🎬 BLOQUES GENERADOS: ${blocks.length}`);
  console.log(`${"─".repeat(60)}`);

  let tiempoTotal = 0;

  blocks.forEach((block, index) => {
    const tiempo = calculateReadingTime(block);
    const oraciones = countSentences(block);
    const palabras = block.split(" ").length;
    tiempoTotal += tiempo;

    console.log(`\n📺 Bloque ${index + 1}:`);
    console.log(`"${block}"`);
    console.log(`   ⏱️  Tiempo: ${tiempo.toFixed(1)}s`);
    console.log(`   📏 Caracteres: ${block.length}`);
    console.log(`   📝 Palabras: ${palabras}`);
    console.log(`   📄 Oraciones: ${oraciones}`);

    // Verificar si cumple las reglas
    const warnings = [];
    if (block.length > 160) warnings.push("⚠️  Muy largo");
    if (oraciones > 2) warnings.push("⚠️  Muchas oraciones");
    if (oraciones < 1) warnings.push("⚠️  Sin oraciones completas");
    if (tiempo > 9) warnings.push("⚠️  Tiempo excesivo");
    if (tiempo < 2.5) warnings.push("⚠️  Muy rápido");
    if (palabras < 5 && blocks.length > 1)
      warnings.push("⚠️  Muy pocas palabras");

    if (warnings.length > 0) {
      console.log(`   ${warnings.join(", ")}`);
    } else {
      console.log(`   ✅ Óptimo para subtítulos`);
    }
  });

  console.log(
    `⏱️  TIEMPO TOTAL DE REPRODUCCIÓN: ${tiempoTotal.toFixed(1)} segundos`,
  );
  console.log(
    `🎯 PROMEDIO POR BLOQUE: ${(tiempoTotal / blocks.length).toFixed(1)} segundos`,
  );

  // Estadísticas generales
  const caracteresPromedio =
    blocks.reduce((sum, block) => sum + block.length, 0) / blocks.length;
  const palabrasPromedio =
    blocks.reduce((sum, block) => sum + block.split(" ").length, 0) /
    blocks.length;
  const oracionesPromedio =
    blocks.reduce((sum, block) => sum + countSentences(block), 0) /
    blocks.length;

  console.log(`📊 ESTADÍSTICAS:`);
  console.log(
    `   • Caracteres promedio por bloque: ${caracteresPromedio.toFixed(1)}`,
  );
  console.log(
    `   • Palabras promedio por bloque: ${palabrasPromedio.toFixed(1)}`,
  );
  console.log(
    `   • Oraciones promedio por bloque: ${oracionesPromedio.toFixed(1)}`,
  );
  console.log(
    `   • Eficiencia (caracteres/segundo): ${(respuesta.texto.length / tiempoTotal).toFixed(1)}`,
  );
}

// Función principal
function ejecutarPruebas() {
  console.log(`\n🧪 SISTEMA DE PRUEBAS DE SUBTÍTULOS`);
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`\n🎯 CONFIGURACIÓN:`);
  console.log(`   • Objetivo: 2 oraciones por bloque`);
  console.log(`   • Máximo caracteres por bloque: 180`);
  console.log(`   • Mínimo palabras por bloque: 12`);
  console.log(`   • Velocidad de lectura: 170 palabras/minuto`);
  console.log(`   • Rango de tiempo: 2.5-9 segundos por bloque`);
  console.log(`   • Corrección automática de divisiones problemáticas`);
  console.log(`   • Sin corte de palabras, bloques completos`);

  testResponses.forEach(analizarRespuesta);

  console.log(`\n${"=".repeat(80)}`);
  console.log(`✅ PRUEBAS COMPLETADAS`);
  console.log(`${"=".repeat(80)}`);

  // Resumen general
  const totalBloques = testResponses.reduce(
    (sum, resp) => sum + createOptimizedTextBlocks(resp.texto).length,
    0,
  );
  const totalTiempo = testResponses.reduce((sum, resp) => {
    const blocks = createOptimizedTextBlocks(resp.texto);
    return (
      sum +
      blocks.reduce(
        (blockSum, block) => blockSum + calculateReadingTime(block),
        0,
      )
    );
  }, 0);

  console.log(`\n📈 RESUMEN GENERAL:`);
  console.log(`   • Total de respuestas analizadas: ${testResponses.length}`);
  console.log(`   • Total de bloques generados: ${totalBloques}`);
  console.log(
    `   • Tiempo total de reproducción: ${totalTiempo.toFixed(1)} segundos`,
  );
  console.log(
    `   • Promedio de bloques por respuesta: ${(totalBloques / testResponses.length).toFixed(1)}`,
  );
  console.log(
    `   • Promedio de tiempo por respuesta: ${(totalTiempo / testResponses.length).toFixed(1)} segundos`,
  );
}

// Ejecutar las pruebas
if (require.main === module) {
  ejecutarPruebas();
}

module.exports = {
  createOptimizedTextBlocks,
  fixKnownDivisionProblems,
  calculateReadingTime,
  countSentences,
  splitLongSentence,
};
