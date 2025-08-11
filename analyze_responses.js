import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para dividir texto en oraciones como en el componente React
function splitSentences(text) {
  if (!text) return [];

  let normalized = text
    .replace(/\s+/g, " ")
    .replace(/([.!?])\s*\n/g, "$1 ")
    .trim();

  const sentences = [];
  const strongPunctuation = normalized.match(
    /[^.!?:]+[.!?:]+(?=\s*[A-Z]|$)|[^.!?:]+$/g,
  );

  if (strongPunctuation) {
    strongPunctuation.forEach((sentence) => {
      sentence = sentence.trim();
      if (sentence.length > 120) {
        const subParts = sentence.split(/[,;](?=\s)/);
        let currentPart = "";

        subParts.forEach((part, index) => {
          part = part.trim();
          if (currentPart.length + part.length < 120) {
            currentPart += (currentPart ? ", " : "") + part;
          } else {
            if (currentPart) sentences.push(currentPart);
            currentPart = part;
          }

          if (index === subParts.length - 1 && currentPart) {
            sentences.push(currentPart);
          }
        });
      } else {
        sentences.push(sentence);
      }
    });
  }

  return sentences.filter((s) => s.length > 0);
}

// Función para construir bloques de subtítulos
function buildBlocks(sentences, maxLines = 2, maxCharsPerLine = 55) {
  const blocks = [];
  let currentBlock = "";
  let currentLines = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const wordsInSentence = sentence.split(/\s+/);
    let testLine = "";
    let linesNeeded = 0;

    for (const word of wordsInSentence) {
      if (testLine.length + word.length + 1 <= maxCharsPerLine) {
        testLine += (testLine ? " " : "") + word;
      } else {
        linesNeeded++;
        testLine = word;
      }
    }
    if (testLine) linesNeeded++;

    if (currentLines + linesNeeded > maxLines && currentBlock) {
      blocks.push(currentBlock.trim());
      currentBlock = sentence;
      currentLines = linesNeeded;
    } else {
      currentBlock += (currentBlock ? " " : "") + sentence;
      currentLines += linesNeeded;

      if (currentLines >= maxLines) {
        blocks.push(currentBlock.trim());
        currentBlock = "";
        currentLines = 0;
      }
    }
  }

  if (currentBlock.trim()) {
    blocks.push(currentBlock.trim());
  }

  return blocks.length > 0 ? blocks : [sentences.join(" ")];
}

// Función para calcular tiempo de lectura
function calculateReadingTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(3000, Math.min(7000, words * 300)); // 300ms por palabra
}

// Función para analizar una respuesta individual
function analyzeResponse(text, path = "") {
  if (!text || typeof text !== "string") {
    return {
      path,
      status: "invalid",
      issues: ["Texto vacío o no válido"],
      suggestions: [],
    };
  }

  const sentences = splitSentences(text);
  const blocks = buildBlocks(sentences);
  const issues = [];
  const suggestions = [];

  // Análisis de longitud total
  if (text.length > 800) {
    issues.push(`Texto muy largo (${text.length} caracteres)`);
    suggestions.push("Considerar dividir en respuestas más cortas");
  }

  // Análisis de número de bloques
  if (blocks.length > 8) {
    issues.push(`Demasiados bloques de subtítulos (${blocks.length})`);
    suggestions.push("Reducir contenido o crear respuestas separadas");
  }

  // Análisis de bloques individuales
  blocks.forEach((block, index) => {
    const lines = Math.ceil(block.length / 55);
    const readingTime = calculateReadingTime(block);

    if (lines > 2) {
      issues.push(`Bloque ${index + 1} muy largo (${lines} líneas estimadas)`);
      suggestions.push(`Dividir bloque ${index + 1} en segmentos más pequeños`);
    }

    if (readingTime > 7000) {
      issues.push(
        `Bloque ${index + 1} tiempo de lectura muy largo (${readingTime}ms)`,
      );
      suggestions.push(`Reducir contenido del bloque ${index + 1}`);
    }

    // Detectar palabras muy largas que podrían no caber
    const words = block.split(/\s+/);
    words.forEach((word) => {
      if (word.length > 20) {
        issues.push(`Palabra muy larga encontrada: "${word}"`);
        suggestions.push("Considerar abreviar palabras técnicas largas");
      }
    });
  });

  // Análisis de estructura
  if (sentences.length === 1 && text.length > 200) {
    issues.push("Oración única muy larga");
    suggestions.push("Agregar puntuación para dividir mejor el contenido");
  }

  return {
    path,
    originalLength: text.length,
    sentencesCount: sentences.length,
    blocksCount: blocks.length,
    estimatedDuration: blocks.reduce(
      (total, block) => total + calculateReadingTime(block),
      0,
    ),
    blocks,
    issues,
    suggestions,
    status:
      issues.length === 0
        ? "good"
        : issues.length <= 2
          ? "warning"
          : "critical",
  };
}

// Función recursiva para analizar objeto JSON
function analyzeObject(obj, currentPath = "") {
  const results = [];

  if (typeof obj === "string") {
    // Es una respuesta de texto
    results.push(analyzeResponse(obj, currentPath));
  } else if (Array.isArray(obj)) {
    // Es un array, analizar cada elemento
    obj.forEach((item, index) => {
      results.push(...analyzeObject(item, `${currentPath}[${index}]`));
    });
  } else if (typeof obj === "object" && obj !== null) {
    // Es un objeto, buscar propiedades "respuesta"
    Object.keys(obj).forEach((key) => {
      if (key === "respuesta") {
        results.push(analyzeResponse(obj[key], `${currentPath}.${key}`));
      } else if (typeof obj[key] === "object") {
        results.push(
          ...analyzeObject(
            obj[key],
            currentPath ? `${currentPath}.${key}` : key,
          ),
        );
      }
    });
  }

  return results;
}

// Función principal
function analyzeResponses() {
  try {
    // Leer archivo de respuestas
    const responsesPath = path.join(
      __dirname,
      "src",
      "data",
      "Respuestas.json",
    );
    const responsesData = fs.readFileSync(responsesPath, "utf8");
    const responses = JSON.parse(responsesData);

    console.log("🔍 ANÁLISIS DE RESPUESTAS PARA SUBTÍTULOS\n");
    console.log("==========================================\n");

    // Analizar todas las respuestas
    const results = analyzeObject(responses);

    // Generar estadísticas
    const stats = {
      total: results.length,
      good: results.filter((r) => r.status === "good").length,
      warning: results.filter((r) => r.status === "warning").length,
      critical: results.filter((r) => r.status === "critical").length,
      invalid: results.filter((r) => r.status === "invalid").length,
      totalDuration: results.reduce(
        (sum, r) => sum + (r.estimatedDuration || 0),
        0,
      ),
      averageDuration: 0,
      totalBlocks: results.reduce((sum, r) => sum + (r.blocksCount || 0), 0),
    };

    stats.averageDuration = Math.round(stats.totalDuration / stats.total);

    // Mostrar estadísticas generales
    console.log("📊 ESTADÍSTICAS GENERALES:");
    console.log(`   Total de respuestas analizadas: ${stats.total}`);
    console.log(
      `   ✅ Estado bueno: ${stats.good} (${Math.round((stats.good / stats.total) * 100)}%)`,
    );
    console.log(
      `   ⚠️  Con advertencias: ${stats.warning} (${Math.round((stats.warning / stats.total) * 100)}%)`,
    );
    console.log(
      `   🚨 Críticas: ${stats.critical} (${Math.round((stats.critical / stats.total) * 100)}%)`,
    );
    console.log(
      `   ❌ Inválidas: ${stats.invalid} (${Math.round((stats.invalid / stats.total) * 100)}%)`,
    );
    console.log(
      `   🕐 Duración total estimada: ${Math.round(stats.totalDuration / 1000)} segundos`,
    );
    console.log(
      `   ⏱️  Duración promedio por respuesta: ${Math.round(stats.averageDuration / 1000)} segundos`,
    );
    console.log(`   📝 Total de bloques de subtítulos: ${stats.totalBlocks}\n`);

    // Mostrar respuestas problemáticas
    const problematicResponses = results.filter(
      (r) => r.status === "critical" || r.status === "warning",
    );

    if (problematicResponses.length > 0) {
      console.log("🚨 RESPUESTAS QUE NECESITAN ATENCIÓN:\n");

      problematicResponses.forEach((result, index) => {
        console.log(`${index + 1}. Ruta: ${result.path}`);
        console.log(
          `   Estado: ${result.status === "critical" ? "🚨 CRÍTICO" : "⚠️ ADVERTENCIA"}`,
        );
        console.log(`   Longitud: ${result.originalLength} caracteres`);
        console.log(`   Bloques: ${result.blocksCount}`);
        console.log(
          `   Duración: ${Math.round((result.estimatedDuration || 0) / 1000)} segundos`,
        );

        if (result.issues.length > 0) {
          console.log("   Problemas:");
          result.issues.forEach((issue) => console.log(`     - ${issue}`));
        }

        if (result.suggestions.length > 0) {
          console.log("   Sugerencias:");
          result.suggestions.forEach((suggestion) =>
            console.log(`     • ${suggestion}`),
          );
        }

        if (result.blocks && result.blocks.length > 0) {
          console.log("   Vista previa de bloques:");
          result.blocks.slice(0, 3).forEach((block, i) => {
            const preview =
              block.length > 80 ? block.substring(0, 80) + "..." : block;
            console.log(`     ${i + 1}: "${preview}"`);
          });
          if (result.blocks.length > 3) {
            console.log(`     ... y ${result.blocks.length - 3} bloques más`);
          }
        }

        console.log("");
      });
    }

    // Mostrar ejemplos de respuestas bien optimizadas
    const goodResponses = results
      .filter((r) => r.status === "good")
      .slice(0, 5);
    if (goodResponses.length > 0) {
      console.log("✅ EJEMPLOS DE RESPUESTAS BIEN OPTIMIZADAS:\n");

      goodResponses.forEach((result, index) => {
        console.log(`${index + 1}. Ruta: ${result.path}`);
        console.log(`   Bloques: ${result.blocksCount}`);
        console.log(
          `   Duración: ${Math.round((result.estimatedDuration || 0) / 1000)} segundos`,
        );
        console.log(
          `   Ejemplo: "${result.blocks?.[0]?.substring(0, 60) || ""}..."`,
        );
        console.log("");
      });
    }

    // Generar recomendaciones generales
    console.log("💡 RECOMENDACIONES GENERALES:\n");
    console.log("1. Las respuestas ideales tienen entre 200-400 caracteres");
    console.log("2. Cada bloque de subtítulos debe tener máximo 2 líneas");
    console.log("3. Duración óptima por bloque: 3-7 segundos");
    console.log("4. Evitar palabras técnicas muy largas (>20 caracteres)");
    console.log("5. Usar puntuación para crear pausas naturales");
    console.log("6. Máximo 8 bloques por respuesta para mantener atención");
    console.log(
      "7. Considerar dividir respuestas muy largas en múltiples preguntas\n",
    );

    // Guardar reporte detallado
    const reportPath = path.join(__dirname, "subtitle_analysis_report.json");
    const report = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      results: results,
      problematicResponses: problematicResponses.map((r) => ({
        path: r.path,
        status: r.status,
        issues: r.issues,
        suggestions: r.suggestions,
        originalLength: r.originalLength,
        blocksCount: r.blocksCount,
        estimatedDuration: r.estimatedDuration,
      })),
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte detallado guardado en: ${reportPath}`);
  } catch (error) {
    console.error("❌ Error al analizar respuestas:", error.message);
    process.exit(1);
  }
}

// Ejecutar análisis si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeResponses();
}

export { analyzeResponses, analyzeResponse, splitSentences, buildBlocks };
