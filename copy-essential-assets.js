import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear directorios necesarios
const dirs = ['dist', 'dist/data', 'public/data'];
dirs.forEach(dir => {
  const fullPath = join(__dirname, dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }
});

// Función para copiar archivos con manejo de errores mejorado
function copyFileWithLog(src, dest) {
  try {
    const srcPath = join(__dirname, src);
    const destPath = join(__dirname, dest);
    
    // Asegurarse de que el directorio de destino exista
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    if (existsSync(srcPath)) {
      // Leer y escribir el archivo para asegurar la codificación correcta
      const content = readFileSync(srcPath, 'utf8');
      writeFileSync(destPath, content, 'utf8');
      console.log(`✅ Copiado: ${src} → ${dest}`);
      return true;
    } else {
      console.log(`⚠️  No encontrado: ${src}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error copiando ${src} a ${dest}:`, error.message);
    return false;
  }
}

// Archivos a copiar
const essentialFiles = [
  { src: 'public/favicon.ico', dest: 'dist/favicon.ico' },
  { src: 'public/data/preguntas.json', dest: 'dist/data/preguntas.json' },
  { src: 'public/data/respuestas.json', dest: 'dist/data/respuestas.json' },
  // Asegurarse de que los archivos también estén en public/data
  { src: 'src/data/Respuestas.json', dest: 'public/data/respuestas.json' },
  { src: 'public/data/preguntas.json', dest: 'src/data/preguntas.json' }
];

// Copiar archivos
let success = true;
essentialFiles.forEach(({ src, dest }) => {
  success = copyFileWithLog(src, dest) && success;
});

// Verificar archivos críticos
const criticalFiles = ['public/data/respuestas.json', 'public/data/preguntas.json'];
const missingFiles = criticalFiles.filter(file => !existsSync(join(__dirname, file)));

if (missingFiles.length > 0) {
  console.error('\n❌ ERROR: Faltan archivos críticos:', missingFiles.join(', '));
  console.log('\nSolución:');
  console.log('1. Asegúrate de que los siguientes archivos existan en tu proyecto:');
  console.log('   - src/data/Respuestas.json');
  console.log('   - public/data/preguntas.json (puedes copiarlo de src/data/ si existe)');
  console.log('\n2. Vuelve a ejecutar este script después de verificar los archivos.');
  process.exit(1);
}

console.log('\n🎉 Archivos esenciales copiados para despliegue web');