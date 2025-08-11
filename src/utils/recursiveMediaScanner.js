// Mapeo de grupos a carpetas
const GRUPO_FOLDERS = {
  'A': 'A) Delfin Austral',
  'B': 'B) Escuela Secundaria N° 3 Malvinas Argentinas',
  'C': 'C) Museo Escolar',
  'D': 'D) Malvinas'
};

// Codificar caracteres especiales en las rutas
function encodePath(path) {
  return path.split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/')
    .replace(/'/g, '%27');
}

// Extensiones de archivos multimedia soportadas
const MULTIMEDIA_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'];

/**
 * Escanea un directorio específico en busca de archivos multimedia
 * @param {string} basePath - Ruta base de la carpeta
 * @param {string} relativePath - Ruta relativa para búsqueda
 * @returns {Promise<Array>} - Array de archivos multimedia encontrados
 */
async function scanDirectory(basePath, relativePath = '') {
  const fullPath = relativePath 
    ? `${basePath}/${relativePath}`.replace(/\/\//g, '/')
    : basePath;
    
  try {
    // Codificar cada segmento de la ruta individualmente
    const encodedPath = fullPath.split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/')
      .replace(/'/g, '%27');
      
    console.log(`🔍 Intentando acceder a: ${encodedPath}`);
    const response = await fetch(encodedPath, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.warn(`❌ Error al acceder al directorio (${response.status}): ${encodedPath}`);
      return [];
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(text, 'text/html');
    const links = Array.from(html.getElementsByTagName('a'))
      .map(link => link.getAttribute('href'))
      .filter(Boolean)
      .filter(href => !['../', './', ''].includes(href));
    
    const results = [];
    
    for (const href of links) {
      // Determinar si es directorio o archivo
      if (href.endsWith('/')) {
        // Es un directorio, buscar recursivamente
        const subDir = relativePath 
          ? `${relativePath}${href}`
          : href;
        const subResults = await scanDirectory(basePath, subDir);
        results.push(...subResults);
      } else {
        // Es un archivo, verificar si es multimedia
        const extension = href.split('.').pop().toLowerCase();
        if (MULTIMEDIA_EXTENSIONS.includes(extension)) {
          const filePath = relativePath 
            ? `${relativePath}${href}`
            : href;
            
          results.push({
            url: `${basePath}/${filePath}`.replace(/\/\//g, '/'),
            relativePath: filePath,
            nombre: href,
            tipo: ['mp4', 'webm', 'mov'].includes(extension) ? 'video' : 'imagen',
            extension
          });
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error al escanear directorio ${fullPath}:`, error);
    return [];
  }
}

/**
 * Escanea recursivamente un directorio en busca de archivos multimedia
 * @param {string} dirPath - Ruta del directorio a escanear
 * @returns {Promise<Array>} - Array de objetos con información de los archivos multimedia encontrados
 */
export async function scanDirectoryForMedia(dirPath) {
  if (!dirPath) {
    console.warn('⚠️ No se proporcionó una ruta para escanear');
    return [];
  }

  try {
    // Normalizar la ruta y codificar cada segmento
    const normalizedPath = dirPath
      .split('/')
      .filter(part => part.trim() !== '')
      .map(part => encodeURIComponent(part).replace(/'/g, '%27'))
      .join('/');
      
    console.log(`🔍 Escaneando directorio: ${normalizedPath}`);
    
    // Escanear el directorio
    const results = await scanDirectory(normalizedPath);
    
    // Filtrar resultados inválidos
    const validResults = results.filter(file => {
      if (!file || !file.url) {
        console.warn('⚠️ Se encontró un archivo sin URL válida:', file);
        return false;
      }
      return true;
    });
    
    console.log(`✅ Encontrados ${validResults.length} archivos válidos en ${normalizedPath}`);
    
    if (validResults.length === 0) {
      console.warn(`⚠️ No se encontraron archivos multimedia en: ${normalizedPath}`);
    }
    
    return validResults;
  } catch (error) {
    console.error(`❌ Error en scanDirectoryForMedia para ${dirPath}:`, error);
    // Si hay un error, intentar con la ruta sin codificar como último recurso
    if (dirPath !== dirPath.split('/').map(part => decodeURIComponent(part)).join('/')) {
      console.log('🔄 Intentando con la ruta sin codificar...');
      try {
        const unencodedPath = dirPath.split('/').map(part => decodeURIComponent(part)).join('/');
        const results = await scanDirectory(unencodedPath);
        console.log(`✅ Encontrados ${results.length} archivos en ruta sin codificar`);
        return results.filter(file => file && file.url);
      } catch (retryError) {
        console.error('❌ Error al intentar con la ruta sin codificar:', retryError);
      }
    }
    return [];
  }
}

/**
 * Codifica una ruta para uso en URL, manejando correctamente los espacios y caracteres especiales
 * @param {string} path - Ruta a codificar
 * @returns {string} Ruta codificada
 */
function encodePathForUrl(path) {
  // Primero dividimos por / para manejar cada segmento individualmente
  return path.split('/')
    .map(segment => {
      // Reemplazar espacios por %20 y otros caracteres especiales
      let encoded = encodeURIComponent(segment);
      // Asegurarse de que los paréntesis se codifiquen correctamente
      encoded = encoded.replace(/\(/g, '%28').replace(/\)/g, '%29');
      return encoded;
    })
    .join('/');
}

/**
 * Obtiene los archivos multimedia para una sección específica
 * @param {string} grupoId - ID del grupo (A, B, C, D)
 * @param {string} temaActual - Tema actual (opcional)
 * @returns {Promise<Array>} - Array de archivos multimedia encontrados
 */
export async function obtenerArchivosMultimedia(grupoId, temaActual = '') {
  if (!grupoId) {
    console.warn('⚠️ No se proporcionó un ID de grupo');
    return [];
  }
  
  const carpetaGrupo = GRUPO_FOLDERS[grupoId];
  if (!carpetaGrupo) {
    console.warn(`⚠️ Grupo no encontrado: ${grupoId}`);
    return [];
  }
  
  // Construir la ruta base sin codificar
  const rutaBase = `Imagenes-Videos.Respuestas/${carpetaGrupo}`;
  console.log(`📂 Ruta base: ${rutaBase}`);
  
  try {
    console.log(`🔍 Buscando archivos multimedia para grupo: ${grupoId} (${carpetaGrupo})`);
    
    // Función auxiliar para buscar archivos en una ruta
    const buscarArchivosEnRuta = async (ruta) => {
      console.log(`  🔍 Escaneando: ${ruta}`);
      try {
        const archivos = await scanDirectoryForMedia(ruta);
        if (archivos.length > 0) {
          console.log(`  ✅ Encontrados ${archivos.length} archivos en: ${ruta}`);
          return archivos;
        }
      } catch (error) {
        console.warn(`  ⚠️ Error al escanear ${ruta}:`, error.message);
      }
      return [];
    };
    
    // Si hay un tema específico, intentar con diferentes variaciones
    if (temaActual) {
      console.log(`📂 Buscando en tema: ${temaActual}`);
      
      // Crear diferentes variaciones del tema para intentar
      const variantesTema = [
        temaActual, // Original
        temaActual.replace(/[^\w\s]/gi, ' ').trim(), // Sin caracteres especiales
        temaActual.toLowerCase(), // Minúsculas
        temaActual.replace(/\s+/g, ' ').trim(), // Espacios normalizados
        temaActual.replace(/\./g, ' ').trim(), // Sin puntos
        temaActual.replace(/\([^)]*\)/g, '').trim() // Sin paréntesis y su contenido
      ];
      
      // Eliminar duplicados
      const variantesUnicas = [...new Set(variantesTema)];
      console.log('🔄 Probando variantes de ruta:', variantesUnicas);
      
      // Probar cada variante hasta encontrar archivos
      for (const variante of variantesUnicas) {
        if (!variante) continue; // Saltar variantes vacías
        
        // Crear la ruta con la variante del tema
        const rutaTema = `${rutaBase}/${variante}`.replace(/\s+/g, ' ').trim();
        
        // Buscar archivos en esta ruta
        const archivos = await buscarArchivosEnRuta(rutaTema);
        if (archivos.length > 0) {
          return archivos;
        }
      }
      
      console.log('⚠️ No se encontraron archivos en las rutas de tema, intentando en el grupo principal...');
    }
    
    // Si no se encontraron archivos en el tema o no hay tema, buscar en el grupo principal
    console.log(`🔍 Buscando en el grupo principal: ${rutaBase}`);
    const archivosEnGrupo = await buscarArchivosEnRuta(rutaBase);
    
    if (archivosEnGrupo.length > 0) {
      return archivosEnGrupo;
    }
    
    // Último intento: buscar recursivamente en todo el directorio del grupo
    console.log('🔍 Realizando búsqueda recursiva en el directorio del grupo...');
    const archivosRecursivos = await scanDirectoryForMedia(rutaBase);
    
    if (archivosRecursivos.length > 0) {
      console.log(`✅ Encontrados ${archivosRecursivos.length} archivos en búsqueda recursiva`);
      return archivosRecursivos;
    }
    
    console.warn('⚠️ No se encontraron archivos multimedia en ninguna ubicación');
    return [];
    
  } catch (error) {
    console.error('❌ Error en obtenerArchivosMultimedia:', error);
    return [];
  }
}

/**
 * Verifica si un grupo tiene archivos multimedia disponibles
 * @param {string} grupoId - ID del grupo
 * @returns {Promise<boolean>} - True si hay archivos multimedia disponibles
 */
export async function tieneArchivosMultimedia(grupoId) {
  if (!grupoId) return false;
  
  const archivos = await obtenerArchivosMultimedia(grupoId);
  return archivos.length > 0;
}
