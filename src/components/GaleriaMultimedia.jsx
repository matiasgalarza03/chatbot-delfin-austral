import React, { useState, useEffect, useCallback } from 'react';
import VisualizadorMultimedia from './VisualizadorMultimedia';
import { obtenerArchivosMultimedia, tieneArchivosMultimedia } from '../utils/recursiveMediaScanner';

const GaleriaMultimedia = ({ grupoId, temaActual, onClose }) => {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  // Cargar archivos multimedia de forma recursiva
  const cargarArchivosMultimedia = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      
      if (!grupoId) {
        console.warn('⚠️ No se proporcionó un ID de grupo');
        setError('Error: No se especificó la sección de contenido.');
        setArchivos([]);
        return;
      }
      
      console.log(`🔍 Buscando archivos multimedia para grupo: ${grupoId}, tema: ${temaActual || 'ninguno'}`);
      
      try {
        // Primero verificar si el grupo tiene archivos multimedia
        const tieneMultimedia = await tieneArchivosMultimedia(grupoId);
        
        if (!tieneMultimedia) {
          console.log('ℹ️ No se encontraron archivos multimedia para este grupo');
          setError('No hay archivos multimedia disponibles para esta sección.');
          setArchivos([]);
          return;
        }
      } catch (checkError) {
        console.warn('⚠️ No se pudo verificar la disponibilidad de multimedia:', checkError);
        // Continuamos de todos modos, ya que el check podría fallar pero los archivos podrían estar accesibles
      }
      
      try {
        // Usar la función de utilidad para obtener archivos recursivamente
        const archivosEncontrados = await obtenerArchivosMultimedia(grupoId, temaActual);
        console.log(`✅ Se encontraron ${archivosEncontrados.length} archivos multimedia`);
        
        if (archivosEncontrados.length === 0) {
          const mensajeError = temaActual 
            ? `No se encontraron archivos multimedia para "${temaActual}"`
            : 'No se encontraron archivos multimedia en esta sección.';
          
          setError(mensajeError);
        } else {
          // Filtrar archivos inválidos y registrar advertencias
          const archivosValidos = archivosEncontrados.filter(archivo => {
            if (!archivo.url) {
              console.warn('⚠️ Archivo sin URL válida:', archivo);
              return false;
            }
            return true;
          });
          
          setArchivos(archivosValidos);
          
          if (archivosValidos.length === 0) {
            setError('No se pudieron cargar los archivos multimedia. Por favor, intente nuevamente.');
          }
        }
      } catch (fetchError) {
        console.error('❌ Error al obtener archivos multimedia:', fetchError);
        setError('No se pudieron cargar los archivos multimedia. Por favor, verifique su conexión e intente nuevamente.');
        setArchivos([]);
      }
    } catch (err) {
      console.error('❌ Error inesperado al cargar archivos multimedia:', err);
      setError('Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.');
      setArchivos([]);
    } finally {
      setCargando(false);
    }
  }, [grupoId, temaActual]);

  // Cargar archivos cuando cambie el grupo o el tema
  useEffect(() => {
    cargarArchivosMultimedia();
  }, [cargarArchivosMultimedia]);

  // Manejar cierre con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && archivoSeleccionado) {
        setArchivoSeleccionado(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [archivoSeleccionado]);

  if (cargando) {
    return (
      <div style={styles.contenedor}>
        <div style={styles.mensajeCarga}>
          <div style={styles.spinner}></div>
          <p>Buscando archivos multimedia...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.contenedor}>
        <div style={styles.mensajeError}>
          <p>{error}</p>
          <button 
            onClick={cargarArchivosMultimedia}
            style={styles.botonReintentar}
          >
            Reintentar
          </button>
          <button 
            onClick={onClose}
            style={styles.botonCerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }



  if (archivos.length === 0) {
    return (
      <div style={styles.contenedor}>
        <div style={styles.sinContenido}>
          <p>{error || 'No se encontraron archivos multimedia.'}</p>
          <div style={styles.contenedorBotones}>
            <button 
              onClick={cargarArchivosMultimedia}
              style={styles.botonRecargar}
            >
              🔄 Reintentar
            </button>
            <button 
              onClick={onClose}
              style={styles.botonCerrar}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.contenedor}>
      <div style={styles.galeria}>
        {archivos.map((archivo, index) => (
          <div 
            key={index} 
            style={styles.itemGaleria}
            onClick={() => setArchivoSeleccionado(archivo)}
          >
            {archivo.tipo === 'imagen' ? (
              <img 
                src={archivo.url} 
                alt={`Imagen ${index + 1}`} 
                style={styles.miniatura}
              />
            ) : (
              <div style={{...styles.miniatura, ...styles.miniaturaVideo}}>
                <div style={styles.iconoVideo}>▶️</div>
                <span style={styles.duracionVideo}>Video</span>
              </div>
            )}
            <div style={styles.nombreArchivo}>
              {archivo.nombre}
            </div>
          </div>
        ))}
      </div>

      {archivoSeleccionado && (
        <div style={styles.modal}>
          <div style={styles.contenidoModal}>
            <VisualizadorMultimedia
              archivo={archivoSeleccionado.url}
              tipo={archivoSeleccionado.tipo}
              info={`Archivo: ${archivoSeleccionado.nombre}`}
              onClose={() => setArchivoSeleccionado(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  contenedor: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  galeria: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  itemGaleria: {
    backgroundColor: '#2d3748',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
  },
  miniatura: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    backgroundColor: '#1a202c',
  },
  miniaturaVideo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconoVideo: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  duracionVideo: {
    color: '#fff',
    fontSize: '14px',
  },
  nombreArchivo: {
    padding: '10px',
    color: '#e2e8f0',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
  cargando: {
    color: '#fff',
    fontSize: '18px',
    marginTop: '100px',
  },
  error: {
    color: '#feb2b2',
    fontSize: '16px',
    marginTop: '100px',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(254, 178, 178, 0.1)',
    borderRadius: '8px',
    maxWidth: '500px',
  },
  mensajeCarga: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#3182ce',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  sinContenido: {
    color: '#4a5568',
    fontSize: '16px',
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  contenedorBotones: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  botonRecargar: {
    padding: '10px 20px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    ':hover': {
      backgroundColor: '#2c5282',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  botonCerrar: {
    padding: '10px 20px',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#cbd5e0',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1100,
  },
  contenidoModal: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90vh',
  },
};

export default GaleriaMultimedia;
