import React, { useState, useEffect } from 'react';
import { getMultimediaFiles, getGrupoDisplayName, getTemaDisplayName } from '../utils/multimediaUtils';
import { getAllMultimediaFiles } from '../utils/multimediaScanner';
import { getMultimediaFilesDirect } from '../utils/multimediaLoader';

/**
 * Modal para mostrar imágenes y videos de un tema específico
 * Props:
 *  - isOpen: boolean - Si el modal está abierto
 *  - onClose: function - Función para cerrar el modal
 *  - tema: string - Nombre del tema para buscar multimedia
 *  - grupoId: string - ID del grupo (A, B, C, D)
 */
export default function MultimediaModal({ isOpen, onClose, tema, grupoId }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    if (isOpen && grupoId) {
      loadMediaFiles();
    }
  }, [isOpen, grupoId]);

  const loadMediaFiles = () => {
    setLoading(true);
    try {
      console.log('🎬 Cargando archivos multimedia para grupo:', grupoId);
      
      // Verificar que grupoId existe
      if (!grupoId) {
        console.error('❌ No se proporcionó grupoId');
        setMediaFiles([]);
        setLoading(false);
        return;
      }
      
      // Usar el cargador directo que no depende de verificaciones async
      const files = getMultimediaFilesDirect(grupoId);
      
      console.log('📁 Archivos cargados directamente:', files);
      setMediaFiles(files);
      setCurrentIndex(0);
      
      if (files.length === 0) {
        console.warn('⚠️ No se encontraron archivos para el grupo:', grupoId);
      }
    } catch (error) {
      console.error('❌ Error cargando archivos multimedia:', error);
      setMediaFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
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
            🎬 Reproductor Multimedia - {getGrupoDisplayName(grupoId)}
          </h2>
          <p style={styles.subtitle}>
            {getTemaDisplayName(tema)}
          </p>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Cargando multimedia...</p>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div style={styles.noContent}>
            <p>📂 No se encontraron imágenes o videos para este tema</p>
            <p style={styles.noContentSubtext}>
              Verificando en: /Imagenes-Videos.Respuestas/{getGrupoDisplayName(grupoId)}/
            </p>
            <button 
              style={styles.retryButton}
              onClick={loadMediaFiles}
            >
              🔄 Reintentar búsqueda
            </button>
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
                  onError={(e) => {
                    console.error('Error cargando video:', e.target.src);
                  }}
                >
                  <source src={mediaFiles[currentIndex].path} type="video/mp4" />
                  <source src={mediaFiles[currentIndex].path} type="video/webm" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <img
                  src={mediaFiles[currentIndex]?.path}
                  alt={mediaFiles[currentIndex]?.name}
                  style={styles.media}
                  onLoad={() => {
                    console.log('✅ Imagen cargada exitosamente:', mediaFiles[currentIndex]?.path);
                  }}
                  onError={(e) => {
                    console.error('❌ Error cargando imagen:', e.target.src);
                    console.error('❌ Archivo que falló:', mediaFiles[currentIndex]);
                    // Mostrar mensaje de error más informativo
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.color = '#dc2626';
                    e.target.style.textAlign = 'center';
                    e.target.style.padding = '20px';
                    e.target.style.borderRadius = '8px';
                    e.target.style.border = '2px dashed #dc2626';
                    e.target.alt = `❌ No se pudo cargar: ${mediaFiles[currentIndex]?.name}`;
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

            <div style={styles.fileName}>
              {mediaFiles[currentIndex]?.name}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    maxWidth: '800px',
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
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
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
  noContentSubtext: {
    fontSize: '14px',
    marginTop: '16px',
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'monospace',
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
    marginBottom: '12px',
  },
  navButton: {
    backgroundColor: '#0369a1',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#0284c7',
    },
  },
  counter: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  fileName: {
    fontSize: '12px',
    color: '#888',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '12px',
    ':hover': {
      backgroundColor: '#2563eb',
    },
  },
};

// Agregar la animación CSS para el spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);