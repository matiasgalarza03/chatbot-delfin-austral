/**
 * Cargador directo de archivos multimedia sin verificación async
 */

// Mapeo directo de archivos multimedia conocidos
const MULTIMEDIA_FILES = {
  'A': [
    {
      name: '1.Delfín Austral (Lagenorhynchus australis)-1.jpg',
      path: '/Imagenes-Videos.Respuestas/A) Delfin Austral/2.Naturaleza/1.Delfín Austral (Lagenorhynchus australis)-1.jpg',
      type: 'image',
      folder: '2.Naturaleza'
    },
    {
      name: '2.Delfín Austral (Lagenorhynchus australis)-2.jpeg',
      path: '/Imagenes-Videos.Respuestas/A) Delfin Austral/2.Naturaleza/2.Delfín Austral (Lagenorhynchus australis)-2.jpeg',
      type: 'image',
      folder: '2.Naturaleza'
    }
  ],
  'B': [
    {
      name: '1.Historia-1.jpeg',
      path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/1.Historia y Ubicación de la Escuela/1.Historia-1.jpeg',
      type: 'image',
      folder: '1.Historia y Ubicación de la Escuela'
    },
    {
      name: '2.Historia-2.jpeg',
      path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/1.Historia y Ubicación de la Escuela/2.Historia-2.jpeg',
      type: 'image',
      folder: '1.Historia y Ubicación de la Escuela'
    },
    {
      name: '1.Logo-1.jpeg',
      path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/3.Logo y Bandera Institucional/1.Logo-1.jpeg',
      type: 'image',
      folder: '3.Logo y Bandera Institucional'
    },
    {
      name: '2.Bandera-1.jpeg',
      path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/3.Logo y Bandera Institucional/2.Bandera-1.jpeg',
      type: 'image',
      folder: '3.Logo y Bandera Institucional'
    }
  ],
  'D': [
    {
      name: '1.Flora_Cortaderia selloana-1.png',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/1.Flora_Cortaderia selloana-1.png',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '2.Fauna_ Pingüino de Magallanes-1.jpg',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/2.Fauna_ Pingüino de Magallanes-1.jpg',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '3.Fauna_ Pingüino Rey-2.png',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/3.Fauna_ Pingüino Rey-2.png',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '4.Fauna_Lobos marinos sudamericanos-3.jpg',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/4.Fauna_Lobos marinos sudamericanos-3.jpg',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '5.Fauna_Elefantes marinos-4.png',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/5.Fauna_Elefantes marinos-4.png',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '6.Fauna_Albatros-5.jpeg',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/6.Fauna_Albatros-5.jpeg',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '7.Fauna_Petreles-6.jpeg',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/7.Fauna_Petreles-6.jpeg',
      type: 'image',
      folder: '6.Flora y Fauna'
    },
    {
      name: '1.Bandera.png',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/3.Bandera/1.Bandera.png',
      type: 'image',
      folder: '3.Bandera'
    },
    {
      name: '1.Luis Vernet.jpeg',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/4.Fundador/1.Luis Vernet.jpeg',
      type: 'image',
      folder: '4.Fundador'
    },
    {
      name: '1.John Davis.png',
      path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/1.Descubrimiento/1.John Davis.png',
      type: 'image',
      folder: '1.Descubrimiento'
    }
  ]
};

/**
 * Obtiene archivos multimedia directamente sin verificación async
 * @param {string} grupoId - ID del grupo (A, B, C, D)
 * @returns {Array} - Array de archivos multimedia
 */
export function getMultimediaFilesDirect(grupoId) {
  const files = MULTIMEDIA_FILES[grupoId] || [];
  console.log(`📁 Cargando ${files.length} archivos multimedia para grupo ${grupoId}:`, files);
  return files;
}

/**
 * Verifica si un grupo tiene archivos multimedia
 * @param {string} grupoId - ID del grupo
 * @returns {boolean} - True si tiene archivos
 */
export function hasMultimediaFilesDirect(grupoId) {
  const files = MULTIMEDIA_FILES[grupoId] || [];
  return files.length > 0;
}