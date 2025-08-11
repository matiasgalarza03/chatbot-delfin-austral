/**
 * Utilidades para manejar archivos multimedia
 */

// Mapeo de IDs de grupo a nombres de carpetas
export const grupoToFolder = {
  'A': 'A) Delfin Austral',
  'B': 'B) Escuela Secundaria N° 3 Malvinas Argentinas', 
  'C': 'C) Museo Escolar',
  'D': 'D) Malvinas',
  'delfin_austral': 'A) Delfin Austral',
  'escuela_secundaria': 'B) Escuela Secundaria N° 3 Malvinas Argentinas', 
  'museo_escolar': 'C) Museo Escolar',
  'malvinas': 'D) Malvinas'
};

// Mapeo de temas a subcarpetas
export const temaToSubfolder = {
  // Delfín Austral
  'presentacion': '1.Presentación',
  'naturaleza': '2.Naturaleza', 
  'proposito': '3.Propósito',
  'funcionalidades': '4.Funcionalidades',
  
  // Escuela Secundaria
  'historia_ubicacion': '1.Historia y Ubicación de la Escuela',
  'nombre_proyectos': '2.Nombre de la Escuela y Proyectos Destacados',
  'logo_bandera': '3.Logo y Bandera Institucional',
  'equipo_directivo': '4.Equipo Directivo',
  'espacios_educativos': '5.Espacios Educativos',
  
  // Museo Escolar
  'museo_escolar': '1.Museo Escolar',
  'objetivos_museo': '2.Objetivos del Museo Escolar',
  'actividades_museo': '3.Actividades del Museo Escolar',
  'recursos_museo': '4.Recursos del Museo Escolar',
  
  // Malvinas - Contexto Geográfico
  'contexto_geografico': '1.Contexto Geográfico e Histórico de las Islas Malvinas',
  'ubicacion_geografia': '1.Contexto Geográfico e Histórico de las Islas Malvinas/1.Ubicación y Geografía',
  'historia_descubrimiento': '1.Contexto Geográfico e Histórico de las Islas Malvinas/2.Historia y Descubrimiento',
  'primeros_asentamientos': '1.Contexto Geográfico e Histórico de las Islas Malvinas/3.Primeros Asentamientos',
  'disputa_soberania': '1.Contexto Geográfico e Histórico de las Islas Malvinas/4.Disputa de Soberanía',
  'primer_gobernador': '1.Contexto Geográfico e Histórico de las Islas Malvinas/5.Primer Gobernador Britanico',
  'flora_fauna': '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna',
  'actividades_economicas': '1.Contexto Geográfico e Histórico de las Islas Malvinas/7.Actividades Económicas',
  'bandera_escudo': '1.Contexto Geográfico e Histórico de las Islas Malvinas/8.Bandera y Escudo',
  
  // Malvinas - Desarrollo del Conflicto
  'desarrollo_conflicto': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)',
  'antecedentes_conflicto': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/1.Antecedentes del Conflicto',
  'operacion_rosario': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Operación Rosario (2 de abril de 1982)',
  'armamento_utilizado': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/3.Armamento utilizado en la guerra de Malvinas por el bando argentino y el bando inglés',
  'batallas_principales': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/4.Batallas Principales',
  'hundimiento_belgrano': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/5.Hundimiento del ARA General Belgrano',
  'batalla_goose_green': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/6.Batalla de Goose Green',
  'desembarco_san_carlos': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/7.Desembarco en San Carlos',
  'batalla_monte_longdon': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/8.Batalla del Monte Longdon',
  'rendicion_argentina': '2.Desarrollo y Consecuencias del Conflicto Armado (1982)/9.Rendición Argentina (14 de junio de 1982)',
  
  // Malvinas - Legado y Memoria
  'legado_memoria': '3.Legado y Memoria del Conflicto',
  'heroes_caidos': '3.Legado y Memoria del Conflicto/1.Héroes Caídos',
  'monumentos_memoriales': '3.Legado y Memoria del Conflicto/2.Monumentos y Memoriales',
  'veteranos_guerra': '3.Legado y Memoria del Conflicto/3.Veteranos de Guerra',
  'impacto_sociedad': '3.Legado y Memoria del Conflicto/4.Impacto en la Sociedad Argentina',
  'reclamo_soberania': '3.Legado y Memoria del Conflicto/5.Reclamo de Soberanía Actual'
};

/**
 * Verifica si existen archivos multimedia para un tema específico
 * @param {string} grupoId - ID del grupo (A, B, C, D, etc.)
 * @param {string} temaId - ID del tema o nombre del tema
 * @returns {Promise<boolean>} - True si existen archivos multimedia
 */
export async function hasMultimediaFiles(grupoId, temaId) {
  try {
    const folderName = grupoToFolder[grupoId];
    
    if (!folderName) {
      console.log('No se encontró carpeta para el grupo:', grupoId);
      return false;
    }

    // Para grupos simples (sin subtemas), verificar directamente en la carpeta del grupo
    let basePath = `/Imagenes-Videos.Respuestas/${folderName}`;
    
    // Si hay un tema específico, intentar encontrar la subcarpeta correspondiente
    if (temaId && temaId !== grupoId) {
      const subfolderName = temaToSubfolder[temaId];
      if (subfolderName) {
        basePath += `/${subfolderName}`;
      }
    }

    console.log('Verificando multimedia en:', basePath);

    // Lista de archivos comunes a verificar basada en la estructura real
    const commonFiles = [
      // Archivos numerados
      '1.jpg', '1.jpeg', '1.png', '2.jpg', '2.jpeg', '2.png', '3.jpg', '3.jpeg', '3.png',
      '4.jpg', '4.jpeg', '4.png', '5.jpg', '5.jpeg', '5.png', '6.jpg', '6.jpeg', '6.png',
      '7.jpg', '7.jpeg', '7.png',
      
      // Archivos específicos de Escuela Secundaria
      'Logo-1.jpeg', 'Bandera-1.jpeg', 'Historia-1.jpeg', 'Historia-2.jpeg',
      
      // Archivos específicos de Delfín Austral
      'Delfín Austral (Lagenorhynchus australis)-1.jpg',
      'Delfín Austral (Lagenorhynchus australis)-2.jpeg',
      
      // Archivos específicos de Malvinas - Flora y Fauna
      'Flora_Cortaderia selloana-1.png',
      'Fauna_ Pingüino de Magallanes-1.jpg',
      'Fauna_ Pingüino Rey-2.png',
      'Fauna_Lobos marinos sudamericanos-3.jpg',
      'Fauna_Elefantes marinos-4.png',
      'Fauna_Albatros-5.jpeg',
      'Fauna_Petreles-6.jpeg',
      
      // Otros archivos de Malvinas
      'Bandera.png', 'Luis Vernet.jpeg', 'John Davis.png',
      
      // Videos
      '1.mp4', '2.mp4', 'video.mp4', '1.webm', '2.webm'
    ];

    // Verificar si al menos un archivo existe
    for (const fileName of commonFiles) {
      try {
        const response = await fetch(`${basePath}/${fileName}`, { method: 'HEAD' });
        if (response.ok) {
          console.log('Archivo multimedia encontrado:', `${basePath}/${fileName}`);
          return true;
        }
      } catch (error) {
        // Continuar con el siguiente archivo
      }
    }

    console.log('No se encontraron archivos multimedia en:', basePath);
    return false;
  } catch (error) {
    console.error('Error verificando archivos multimedia:', error);
    return false;
  }
}

/**
 * Obtiene la lista de archivos multimedia para un tema
 * @param {string} grupoId - ID del grupo
 * @param {string} temaId - ID del tema
 * @returns {Promise<Array>} - Array de objetos con información de archivos
 */
export async function getMultimediaFiles(grupoId, temaId) {
  try {
    const folderName = grupoToFolder[grupoId];
    
    if (!folderName) {
      console.log('No se encontró carpeta para el grupo:', grupoId);
      return [];
    }

    // Para grupos simples, buscar en toda la carpeta del grupo
    let basePath = `/Imagenes-Videos.Respuestas/${folderName}`;
    
    console.log('Buscando archivos multimedia en:', basePath);

    // Lista completa de archivos conocidos basada en la estructura real
    const knownFiles = [
      // Delfín Austral - Naturaleza
      '2.Naturaleza/1.Delfín Austral (Lagenorhynchus australis)-1.jpg',
      '2.Naturaleza/2.Delfín Austral (Lagenorhynchus australis)-2.jpeg',
      
      // Escuela Secundaria - Historia
      '1.Historia y Ubicación de la Escuela/1.Historia-1.jpeg',
      '1.Historia y Ubicación de la Escuela/2.Historia-2.jpeg',
      
      // Escuela Secundaria - Logo y Bandera
      '3.Logo y Bandera Institucional/1.Logo-1.jpeg',
      '3.Logo y Bandera Institucional/2.Bandera-1.jpeg',
      
      // Malvinas - Flora y Fauna
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/1.Flora_Cortaderia selloana-1.png',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/2.Fauna_ Pingüino de Magallanes-1.jpg',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/3.Fauna_ Pingüino Rey-2.png',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/4.Fauna_Lobos marinos sudamericanos-3.jpg',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/5.Fauna_Elefantes marinos-4.png',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/6.Fauna_Albatros-5.jpeg',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/7.Fauna_Petreles-6.jpeg',
      
      // Malvinas - Otros
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/3.Bandera/1.Bandera.png',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/4.Fundador/1.Luis Vernet.jpeg',
      '1.Contexto Geográfico e Histórico de las Islas Malvinas/1.Descubrimiento/1.John Davis.png'
    ];

    const files = [];

    // Verificar archivos conocidos
    for (const relativePath of knownFiles) {
      const fullPath = `${basePath}/${relativePath}`;
      try {
        const response = await fetch(fullPath, { method: 'HEAD' });
        if (response.ok) {
          const fileName = relativePath.split('/').pop();
          const isVideo = /\.(mp4|webm|mov)$/i.test(fileName);
          files.push({
            name: fileName,
            path: fullPath,
            type: isVideo ? 'video' : 'image',
            relativePath: relativePath
          });
        }
      } catch (error) {
        // El archivo no existe, continuar
      }
    }

    // También buscar archivos numerados genéricos
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'];
    for (let i = 1; i <= 10; i++) {
      for (const ext of extensions) {
        const fileName = `${i}.${ext}`;
        const filePath = `${basePath}/${fileName}`;
        
        try {
          const response = await fetch(filePath, { method: 'HEAD' });
          if (response.ok && !files.some(f => f.name === fileName)) {
            files.push({
              name: fileName,
              path: filePath,
              type: ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image'
            });
          }
        } catch (error) {
          // El archivo no existe, continuar
        }
      }
    }

    console.log(`Encontrados ${files.length} archivos multimedia para ${grupoId}`);
    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error obteniendo archivos multimedia:', error);
    return [];
  }
}

/**
 * Obtiene el nombre legible de un grupo
 * @param {string} grupoId - ID del grupo
 * @returns {string} - Nombre legible del grupo
 */
export function getGrupoDisplayName(grupoId) {
  const names = {
    'A': 'Delfín Austral',
    'B': 'Escuela Secundaria N° 3 Malvinas Argentinas',
    'C': 'Museo Escolar',
    'D': 'Malvinas',
    'delfin_austral': 'Delfín Austral',
    'escuela_secundaria': 'Escuela Secundaria N° 3 Malvinas Argentinas',
    'museo_escolar': 'Museo Escolar',
    'malvinas': 'Malvinas'
  };
  return names[grupoId] || grupoId;
}

/**
 * Obtiene el nombre legible de un tema
 * @param {string} temaId - ID del tema
 * @returns {string} - Nombre legible del tema
 */
export function getTemaDisplayName(temaId) {
  // Verificar si temaId es null o undefined
  if (!temaId) {
    return 'Contenido Multimedia';
  }
  
  const names = {
    // Delfín Austral
    'presentacion': 'Presentación',
    'naturaleza': 'Naturaleza',
    'proposito': 'Propósito',
    'funcionalidades': 'Funcionalidades',
    
    // Escuela Secundaria
    'historia_ubicacion': 'Historia y Ubicación de la Escuela',
    'nombre_proyectos': 'Nombre de la Escuela y Proyectos Destacados',
    'logo_bandera': 'Logo y Bandera Institucional',
    'equipo_directivo': 'Equipo Directivo',
    'espacios_educativos': 'Espacios Educativos',
    
    // Museo Escolar
    'museo_escolar': 'Museo Escolar',
    'objetivos_museo': 'Objetivos del Museo Escolar',
    'actividades_museo': 'Actividades del Museo Escolar',
    'recursos_museo': 'Recursos del Museo Escolar',
    
    // Malvinas
    'contexto_geografico': 'Contexto Geográfico e Histórico',
    'desarrollo_conflicto': 'Desarrollo y Consecuencias del Conflicto Armado (1982)',
    'legado_memoria': 'Legado y Memoria del Conflicto'
  };
  
  return names[temaId] || (typeof temaId === 'string' ? temaId.replace(/_/g, ' ') : String(temaId));
}