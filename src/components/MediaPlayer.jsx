import React, { useState, useEffect } from 'react';

/**
 * Reproductor multimedia completamente nuevo desde cero
 * Mapea correctamente cada archivo multimedia a su tema específico
 */

// Mapeo completo y preciso de archivos multimedia por tema
const MULTIMEDIA_DATABASE = {
  // GRUPO A - DELFÍN AUSTRAL
  'A': {
    'naturaleza': [
      {
        name: 'Delfín Austral (Lagenorhynchus australis)-1.jpg',
        path: '/Imagenes-Videos.Respuestas/A) Delfin Austral/2.Naturaleza/1.Delfín Austral (Lagenorhynchus australis)-1.jpg',
        type: 'image',
        description: 'Delfín Austral en su hábitat natural'
      },
      {
        name: 'Delfín Austral (Lagenorhynchus australis)-2.jpeg',
        path: '/Imagenes-Videos.Respuestas/A) Delfin Austral/2.Naturaleza/2.Delfín Austral (Lagenorhynchus australis)-2.jpeg',
        type: 'image',
        description: 'Características del Delfín Austral'
      }
    ]
  },

  // GRUPO B - ESCUELA SECUNDARIA
  'B': {
    'historia_ubicacion': [
      {
        name: 'Historia-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/1.Historia y Ubicación de la Escuela/1.Historia-1.jpeg',
        type: 'image',
        description: 'Historia de la Escuela Secundaria N° 3'
      },
      {
        name: 'Historia-2.jpeg',
        path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/1.Historia y Ubicación de la Escuela/2.Historia-2.jpeg',
        type: 'image',
        description: 'Ubicación y desarrollo histórico'
      }
    ],
    'logo_bandera': [
      {
        name: 'Logo-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/3.Logo y Bandera Institucional/1.Logo-1.jpeg',
        type: 'image',
        description: 'Logo institucional de la escuela'
      },
      {
        name: 'Bandera-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/B) Escuela Secundaria N° 3 Malvinas Argentinas/3.Logo y Bandera Institucional/2.Bandera-1.jpeg',
        type: 'image',
        description: 'Bandera institucional'
      }
    ]
  },

  // GRUPO D - MALVINAS
  'D': {
    // Contexto Geográfico e Histórico
    'contexto_geografico': [
      // Descubrimiento
      {
        name: 'John Davis.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/1.Descubrimiento/1.John Davis.png',
        type: 'image',
        description: 'John Davis - Descubridor de las Malvinas'
      },
      // Bandera
      {
        name: 'Bandera.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/3.Bandera/1.Bandera.png',
        type: 'image',
        description: 'Bandera de las Islas Malvinas'
      },
      // Fundador
      {
        name: 'Luis Vernet.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/4.Fundador/1.Luis Vernet.jpeg',
        type: 'image',
        description: 'Luis Vernet - Primer gobernador argentino'
      }
    ],
    
    'flora_fauna': [
      {
        name: 'Flora_Cortaderia selloana-1.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/1.Flora_Cortaderia selloana-1.png',
        type: 'image',
        description: 'Cortaderia selloana - Flora de Malvinas'
      },
      {
        name: 'Fauna_ Pingüino de Magallanes-1.jpg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/2.Fauna_ Pingüino de Magallanes-1.jpg',
        type: 'image',
        description: 'Pingüino de Magallanes'
      },
      {
        name: 'Fauna_ Pingüino Rey-2.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/3.Fauna_ Pingüino Rey-2.png',
        type: 'image',
        description: 'Pingüino Rey'
      },
      {
        name: 'Fauna_Lobos marinos sudamericanos-3.jpg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/4.Fauna_Lobos marinos sudamericanos-3.jpg',
        type: 'image',
        description: 'Lobos marinos sudamericanos'
      },
      {
        name: 'Fauna_Elefantes marinos-4.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/5.Fauna_Elefantes marinos-4.png',
        type: 'image',
        description: 'Elefantes marinos'
      },
      {
        name: 'Fauna_Albatros-5.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/6.Fauna_Albatros-5.jpeg',
        type: 'image',
        description: 'Albatros'
      },
      {
        name: 'Fauna_Petreles-6.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/1.Contexto Geográfico e Histórico de las Islas Malvinas/6.Flora y Fauna/7.Fauna_Petreles-6.jpeg',
        type: 'image',
        description: 'Petreles'
      }
    ],

    // Desarrollo del Conflicto Armado (1982)
    'desarrollo_conflicto': [
      // El inicio del conflicto bélico con Inglaterra
      {
        name: 'El inicio del conflicto bélico con Inglaterra-1.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/1.El inicio del conflicto bélico con Inglaterra/1.El inicio del conflicto bélico con Inglaterra-1.mp4',
        type: 'video',
        description: 'Inicio del conflicto bélico - Video documental'
      },
      {
        name: 'El inicio del conflicto bélico con Inglaterra-2.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/1.El inicio del conflicto bélico con Inglaterra/2.El inicio del conflicto bélico con Inglaterra-2.jpeg',
        type: 'image',
        description: 'Imágenes del inicio del conflicto'
      },
      {
        name: 'El inicio del conflicto bélico con Inglaterra-4.mov',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/1.El inicio del conflicto bélico con Inglaterra/4.El inicio del conflicto bélico con Inglaterra-4.mov',
        type: 'video',
        description: 'Documentos históricos del conflicto'
      }
    ],

    'conflictos_destacados': [
      // Operación Rosario
      {
        name: 'Operación Rosario-1.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Conflictos más destacados durante la guerra/1.Operación Rosario-1.mp4',
        type: 'video',
        description: 'Operación Rosario - Video histórico'
      },
      {
        name: 'Operación Rosario-2.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Conflictos más destacados durante la guerra/2.Operación Rosario-2.jpeg',
        type: 'image',
        description: 'Imágenes de la Operación Rosario'
      },
      // Hundimiento del HMS Sheffield
      {
        name: 'Hundimiento del HMS Sheffield-1.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Conflictos más destacados durante la guerra/17.Hundimiento del HMS Sheffield-1.png',
        type: 'image',
        description: 'Hundimiento del HMS Sheffield'
      },
      // Batalla de San Carlos Water
      {
        name: 'Batalla de San Carlos Water-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Conflictos más destacados durante la guerra/19.Batalla de San Carlos Water-1.jpeg',
        type: 'image',
        description: 'Batalla de San Carlos Water'
      },
      // Combate Monte Longdon
      {
        name: 'Combate Monte Longdon-3.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/2.Conflictos más destacados durante la guerra/32.Combate Monte Longdon-3.mp4',
        type: 'video',
        description: 'Combate del Monte Longdon'
      }
    ],

    'armamento_utilizado': [
      // Armamento Argentino
      {
        name: 'A-4 Skyhawk-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/3.Armamento utilizado en la guerra de Malvinas por el bando argentino y el bando inglés /1.Aviación ARG_A-4 Skyhawk-1.jpeg',
        type: 'image',
        description: 'Avión A-4 Skyhawk argentino'
      },
      {
        name: 'Crucero ARA General Belgrano-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/3.Armamento utilizado en la guerra de Malvinas por el bando argentino y el bando inglés /5.Marina ARG_Crucero ARA General Belgrano-1.jpeg',
        type: 'image',
        description: 'Crucero ARA General Belgrano'
      },
      // Armamento Británico
      {
        name: 'Avion Harrier-1.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/3.Armamento utilizado en la guerra de Malvinas por el bando argentino y el bando inglés /11.Aviación RU_Avion Harrier-1.jpeg',
        type: 'image',
        description: 'Avión Harrier británico'
      }
    ],

    'heroes_guerra': [
      {
        name: 'Tripulantes del ARA General Belgrano.jpeg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/4.Héroes de la guerra de Malvinas/1.Tripulantes del ARA General Belgrano.jpeg',
        type: 'image',
        description: 'Tripulantes del ARA General Belgrano'
      },
      {
        name: 'Oscar Poltronieri-1.jpg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/4.Héroes de la guerra de Malvinas/7.Oscar Poltronieri-1.jpg',
        type: 'image',
        description: 'Oscar Poltronieri - Héroe de Malvinas'
      },
      {
        name: 'Pilotos argentinos-2.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/2.Desarrollo y Consecuencias del Conflicto Armado (1982)/4.Héroes de la guerra de Malvinas/11.Pilotos argentinos-2.mp4',
        type: 'video',
        description: 'Pilotos argentinos en Malvinas'
      }
    ],

    // Impacto Social y Cultural
    'impacto_social': [
      // Medios de comunicación
      {
        name: 'Medios de comunicación-1.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/3.Impacto Social y Cultural de la Guerra en Argentina/1.Relato de la guerra de Malvinas en los medios de comunicación argentinos durante el conflicto /1.Medios de comunicación-1.mp4',
        type: 'video',
        description: 'Medios de comunicación durante la guerra'
      },
      {
        name: 'Periodicos-1.jpg',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/3.Impacto Social y Cultural de la Guerra en Argentina/1.Relato de la guerra de Malvinas en los medios de comunicación argentinos durante el conflicto /3.Periodicos-1.jpg',
        type: 'image',
        description: 'Periódicos de la época'
      },
      // Donaciones
      {
        name: 'Donaciones-1.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/3.Impacto Social y Cultural de la Guerra en Argentina/2.Donaciones y movilización social durante la guerra /1.Donaciones-1.mp4',
        type: 'video',
        description: 'Donaciones y movilización social'
      },
      // Cartas de niños
      {
        name: 'Carta de niña a soldado-1.png',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/3.Impacto Social y Cultural de la Guerra en Argentina/3.Cartas que escribían los chicos de las escuelas para los soldados/1.Carta de niña a soldado-1.png',
        type: 'image',
        description: 'Carta de niña a soldado'
      }
    ],

    // Legado y Realidad Actual
    'legado_memoria': [
      {
        name: 'Situación actual de las islas Malvinas-1.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/4.Legado y Realidad Actual de las Islas Malvinas/1.Las Malvinas en la actualidad/1.Situación actual de las islas Malvinas-1.mp4',
        type: 'video',
        description: 'Situación actual de las Malvinas'
      },
      {
        name: 'Cementerio de Darwin.mp4',
        path: '/Imagenes-Videos.Respuestas/D) Malvinas/4.Legado y Realidad Actual de las Islas Malvinas/2.Creación del cementerio en Malvinas/1.Cementerio de Darwin.mp4',
        type: 'video',
        description: 'Cementerio de Darwin en Malvinas'
      }
    ]
  }
};

/**
 * Obtiene archivos multimedia para un grupo y tema específico
 */
function getMediaForTopic(grupoId, temaId) {
  const grupo = MULTIMEDIA_DATABASE[grupoId];
  if (!grupo) return [];
  
  // Si no hay tema específico, devolver todos los archivos del grupo
  if (!temaId || temaId === grupoId) {
    return Object.values(grupo).flat();
  }
  
  return grupo[temaId] || [];
}

/**
 * Componente MediaPlayer - Reproductor multimedia desde cero
 */
export default function MediaPlayer({ isOpen, onClose, grupoId, temaId }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && grupoId) {
      loadMedia();
    }
  }, [isOpen, grupoId, temaId]);

  const loadMedia = () => {
    setLoading(true);
    console.log('🎬 Cargando multimedia para:', { grupoId, temaId });
    
    const files = getMediaForTopic(grupoId, temaId);
    console.log('📁 Archivos encontrados:', files.length);
    
    setMediaFiles(files);
    setCurrentIndex(0);
    setLoading(false);
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const getGrupoName = (id) => {
    const names = {
      'A': 'Delfín Austral',
      'B': 'Escuela Secundaria N° 3 Malvinas Argentinas',
      'C': 'Museo Escolar',
      'D': 'Malvinas'
    };
    return names[id] || id;
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        <div style={styles.header}>
          <h2 style={styles.title}>
            🎬 Reproductor Multimedia
          </h2>
          <p style={styles.subtitle}>
            {getGrupoName(grupoId)}
          </p>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Cargando multimedia...</p>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div style={styles.noContent}>
            <p>📂 No se encontraron archivos multimedia para este tema</p>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.mediaContainer}>
              {mediaFiles[currentIndex]?.type === 'video' ? (
                <video
                  key={mediaFiles[currentIndex].path}
                  style={styles.media}
                  controls
                  preload="metadata"
                >
                  <source src={mediaFiles[currentIndex].path} type="video/mp4" />
                  <source src={mediaFiles[currentIndex].path} type="video/mov" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <img
                  src={mediaFiles[currentIndex]?.path}
                  alt={mediaFiles[currentIndex]?.description}
                  style={styles.media}
                  onLoad={() => console.log('✅ Imagen cargada:', mediaFiles[currentIndex]?.name)}
                  onError={(e) => {
                    console.error('❌ Error cargando:', e.target.src);
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.color = '#dc2626';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.style.padding = '20px';
                    e.target.alt = `❌ Error: ${mediaFiles[currentIndex]?.name}`;
                  }}
                />
              )}
            </div>

            {mediaFiles.length > 1 && (
              <div style={styles.controls}>
                <button style={styles.navButton} onClick={prevMedia}>
                  ← Anterior
                </button>
                <span style={styles.counter}>
                  {currentIndex + 1} de {mediaFiles.length}
                </span>
                <button style={styles.navButton} onClick={nextMedia}>
                  Siguiente →
                </button>
              </div>
            )}

            <div style={styles.description}>
              <strong>{mediaFiles[currentIndex]?.name}</strong>
              <br />
              <span style={styles.descriptionText}>
                {mediaFiles[currentIndex]?.description}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '8px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  header: {
    marginBottom: '24px',
    paddingRight: '50px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#666',
    fontStyle: 'italic',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0369a1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  noContent: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mediaContainer: {
    width: '100%',
    maxHeight: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  media: {
    maxWidth: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  navButton: {
    backgroundColor: '#19376d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  counter: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
    minWidth: '80px',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    maxWidth: '600px',
  },
  descriptionText: {
    color: '#666',
    fontSize: '12px',
  },
};

// CSS para la animación del spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  styleSheet.setAttribute('data-spinner', 'true');
  document.head.appendChild(styleSheet);
}