import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Crear directorios necesarios
const dirs = ['dist', 'dist/data'];
dirs.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Copiar solo archivos esenciales
const essentialFiles = [
  { src: 'public/favicon.ico', dest: 'dist/favicon.ico' },
  { src: 'public/data/preguntas.json', dest: 'dist/data/preguntas.json' },
  { src: 'public/data/respuestas.json', dest: 'dist/data/respuestas.json' }
];

essentialFiles.forEach(({ src, dest }) => {
  try {
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`✅ Copiado: ${src} → ${dest}`);
    } else {
      console.log(`⚠️  No encontrado: ${src}`);
    }
  } catch (error) {
    console.log(`❌ Error copiando ${src}:`, error.message);
  }
});

console.log('🎉 Archivos esenciales copiados para despliegue web');