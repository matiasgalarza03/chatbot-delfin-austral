/**
 * Scanner mejorado de multimedia que busca recursivamente en todas las subcarpetas
 */

// Mapeo de grupos a carpetas
const GRUPO_FOLDERS = {
  'A': 'A) Delfin Austral',
  'B': 'B) Escuela Secundaria N° 3 Malvinas Argentinas',
  'C': 'C) Museo Escolar', 
  'D': 'D) Malvinas'
};

// Extensiones de archivos multimedia soportadas
const MULTIMEDIA_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'];

/**
 * Busca archivos multimedia en rutas específicas conocidas
 * @param {string} basePath - Ruta base de la carpeta
 * @returns {Promise<Array>} - Array de archivos encontrados
 */
async function scanSpecificPaths(basePath) {
  const files = [];
  const mainFolder = basePath.split('/').pop();
  
  // Rutas específicas donde sabemos que hay archivos (usando nombres exactos)
  const specificPaths = {
    'A) Delfin Austral': [
      {
        path: '2.Naturaleza',
        files: [
          '1.Delfín Austral (Lagenorhynchus australis)-1.jpg',
          '2.Delfín Austral (Lagenorhynchus australis)-2.jpeg'
        ]
      }
    ],
    'B) Escuela Secundaria N° 3 Malvinas Argentinas': [
      {
        path: '1.Historia y Ubicación de la Escuela',
        files: ['1.Historia-1.jpeg', '2.Historia-2.jpeg']
      },
      {
        path: '3.Logo y Bandera Institucional',
        files: ['1.Logo-1.jpeg', '2.Bandera-1.jpeg']
      }
    ],
    'D) Malvinas': [
      {
        path: '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna',
        files: [
          '1.Flora_Cortaderia selloana-1.png',
          '2.Fauna_ Pingüino de Magallanes-1.jpg',
          '3.Fauna_ Pingüino Rey-2.png',
          '4.Fauna_Lobos marinos sudamericanos-3.jpg',
          '5.Fauna_Elefantes marinos-4.png',
          '6.Fauna_Albatros-5.jpeg',
          '7.Fauna_Petreles-6.jpeg'
        ]
      },
      {
        path: '1.Contexto Geográfico e Histórico de las Islas Malvinas/3.Bandera',
        files: ['1.Bandera.png']
      },
      {
        path: '1.Contexto Geográfico e Histórico de las Islas Malvinas/4.Fundador',
        files: ['1.Luis Vernet.jpeg']
      },
      {
        path: '1.Contexto Geográfico e Histórico de las Islas Malvinas/1.Descubrimiento',
        files: ['1.John Davis.png']
      }
    ]
  };

  const pathsForFolder = specificPaths[mainFolder] || [];
  
  for (const pathInfo of pathsForFolder) {
    const fullSubPath = `${basePath}/${pathInfo.path}`;
    
    for (const fileName of pathInfo.files) {
      const filePath = `${fullSubPath}/${fileName}`;
      
      // No verificar con fetch, simplemente agregar los archivos conocidos
      const ext = fileName.split('.').pop().toLowerCase();
      files.push({
        name: fileName,
        path: filePath,
        type: ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image',
        folder: pathInfo.path,
        fullPath: filePath
      });
      console.log('📁 Archivo agregado:', filePath);
    }
  }

  // También buscar archivos numerados genéricos en subcarpetas principales
  const mainSubfolders = {
    'A) Delfin Austral': ['1.Presentación', '2.Naturaleza', '3.Propósito', '4.Funcionalidades'],
    'B) Escuela Secundaria N° 3 Malvinas Argentinas': [
      '1.Historia y Ubicación de la Escuela',
      '2.Nombre de la Escuela y Proyectos Destacados',
      '3.Logo y Bandera Institucional',
      '4.Equipo Directivo',
      '5.Espacios Educativos'
    ],
    'C) Museo Escolar': [
      '1.Museo Escolar',
      '2.Objetivos del Museo Escolar', 
      '3.Actividades del Museo Escolar',
      '4.Recursos del Museo Escolar'
    ],
    'D) Malvinas': [
      '1.Contexto Geográfico e Histórico de las Islas Malvinas',
      '2.Desarrollo y Consecuencias del Conflicto Armado (1982)',
      '3.Impacto Social y Cultural de la Guerra en Argentina',
      '4.Legado y Realidad Actual de las Islas Malvinas',
      '5.Recursos Adicionales'
    ]
  };

  const subfolders = mainSubfolders[mainFolder] || [];
  
  for (const subfolder of subfolders) {
    const subfolderPath = `${basePath}/${subfolder}`;
    
    // Buscar archivos numerados (1.jpg, 2.jpg, etc.)
    for (let i = 1; i <= 10; i++) {
      for (const ext of MULTIMEDIA_EXTENSIONS) {
        const fileName = `${i}.${ext}`;
        const filePath = `${subfolderPath}/${fileName}`;
        
        try {
          const response = await fetch(filePath, { method: 'HEAD' });
          if (response.ok) {
            // Evitar duplicados
            if (!files.some(f => f.path === filePath)) {
              files.push({
                name: fileName,
                path: filePath,
                type: ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image',
                folder: subfolder
              });
              console.log('✅ Archivo numerado encontrado:', filePath);
            }
          }
        } catch (error) {
          // Archivo no existe, continuar
        }
      }
    }
  }

  return files;
}

/**
 * Obtiene todos los archivos multimedia para un grupo específico
 * @param {string} grupoId - ID del grupo (A, B, C, D)
 * @returns {Promise<Array>} - Array de archivos multimedia
 */
export async function getAllMultimediaFiles(grupoId) {
  try {
    const folderName = GRUPO_FOLDERS[grupoId];
    if (!folderName) {
      console.log('Grupo no encontrado:', grupoId);
      return [];
    }

    const basePath = `/Imagenes-Videos.Respuestas/${folderName}`;
    console.log('Escaneando multimedia en:', basePath);

    const files = await scanSpecificPaths(basePath);
    console.log(`Encontrados ${files.length} archivos multimedia para grupo ${grupoId}`);
    
    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error escaneando archivos multimedia:', error);
    return [];
  }
}

/**
 * Verifica si un grupo tiene archivos multimedia
 * @param {string} grupoId - ID del grupo
 * @returns {Promise<boolean>} - True si tiene archivos multimedia
 */
export async function hasMultimediaFilesImproved(grupoId) {
  try {
    const files = await getAllMultimediaFiles(grupoId);
    return files.length > 0;
  } catch (error) {
    console.error('Error verificando multimedia:', error);
    return false;
  }
}