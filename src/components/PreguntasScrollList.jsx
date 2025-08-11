import React, { useState, useEffect } from "react";
import InventorySearch from "./InventorySearch";
import MediaPlayer from "./MediaPlayer";
import MultimediaModal from "./MultimediaModal";
import GaleriaMultimedia from "./GaleriaMultimedia";
import { hasMultimediaFilesImproved } from "../utils/multimediaScanner";

/**
 * Lista vertical desplazable con las preguntas predefinidas.
 * Mantiene el mismo estilo de los botones actuales.
 * Props:
 *  - preguntas: Array<{ pregunta: string }>
 *  - onPreguntaSeleccionada: function(question)
 *  - onVolver: function()
 *  - esMuseoEscolar: boolean - Indica si se está mostrando el menú del Museo Escolar
 *  - grupoActual: string - ID del grupo actual (delfin_austral, escuela_secundaria, etc.)
 *  - temaActual: string - ID del tema actual
 */
export default function PreguntasScrollList({
  preguntas,
  onPreguntaSeleccionada,
  onVolver,
  esMuseoEscolar = false,
  grupoActual,
  temaActual,
  preguntasVisitadas = new Set(), // Nuevo prop para preguntas ya visitadas
  onPreguntaVisitada = () => {}, // Callback para marcar pregunta como visitada
}) {
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [showMultimediaModal, setShowMultimediaModal] = useState(false);
  const [showGaleriaMultimedia, setShowGaleriaMultimedia] = useState(false);
  const [hasMultimedia, setHasMultimedia] = useState(false);

  // Verificar si hay archivos multimedia disponibles para este tema
  useEffect(() => {
    if (grupoActual) {
      console.log("🔍 Verificando multimedia para:", {
        grupoActual,
        temaActual,
      });

      // Siempre mostrar el botón para grupos que sabemos que tienen multimedia
      const gruposConMultimedia = ["A", "B", "D"];
      if (gruposConMultimedia.includes(grupoActual)) {
        console.log("✅ Grupo tiene multimedia confirmado:", grupoActual);
        setHasMultimedia(true);
      } else {
        // Para otros grupos, usar el scanner
        hasMultimediaFilesImproved(grupoActual)
          .then((result) => {
            console.log(`Grupo ${grupoActual} tiene multimedia:`, result);
            setHasMultimedia(result);
          })
          .catch((error) => {
            console.error("Error verificando multimedia:", error);
            setHasMultimedia(false);
          });
      }
    } else {
      console.log("❌ No hay grupoActual definido");
      setHasMultimedia(false);
    }
  }, [grupoActual, temaActual]);

  if (!preguntas || preguntas.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      {onVolver && (
        <button
          onClick={onVolver}
          style={styles.backButton}
          title="Volver al menú de Malvinas"
        >
          <span style={styles.backButtonIcon}>←</span>
        </button>
      )}
      <div style={styles.scrollArea}>
        {preguntas
          .filter(p => !p.isInventorySearch) // Ocultar el botón de búsqueda de inventario
          .map((p, index) => (
          <button
            key={`${p.pregunta}-${index}`}
            style={{
              ...styles.button,
              // Aplicar estilo oscurecido si la pregunta ya fue visitada
              ...(preguntasVisitadas.has(p.pregunta) ? styles.buttonVisitado : {})
            }}
            onClick={() => {
              // Verificar que tenemos datos válidos antes de proceder
              if (!p || !p.pregunta) {
                console.error('Pregunta inválida en el índice:', index, p);
                return;
              }
              
              // Si es el buscador de inventario, abrir el modal
              if (p.isInventorySearch) {
                console.log('🏛️ Abriendo buscador de inventario...');
                // Abrir el visor completo del inventario
                if (window.openInventoryViewer) {
                  window.openInventoryViewer();
                }
                onPreguntaSeleccionada({
                  pregunta: "Buscador de artículos del Inventario con número de orden",
                  respuesta: "Abriendo inventario completo del museo escolar...",
                  isInventorySearch: true
                });
                return;
              }
              
              // Marcar pregunta como visitada
              console.log('🔍 Marcando pregunta como visitada:', p.pregunta);
              onPreguntaVisitada(p.pregunta);
              
              // Asegurar que la pregunta tiene una respuesta
              if (!p.respuesta || p.respuesta.trim() === '') {
                console.error('Respuesta vacía para la pregunta:', p.pregunta);
                // Crear una copia con respuesta por defecto
                const preguntaConRespuesta = {
                  ...p,
                  respuesta: "Lo siento, no tengo información disponible para esta pregunta en este momento."
                };
                onPreguntaSeleccionada(preguntaConRespuesta);
                return;
              }
              
              // Crear una copia limpia de la pregunta para evitar mutaciones
              const preguntaLimpia = {
                ...p,
                pregunta: p.pregunta.trim(),
                respuesta: p.respuesta.trim()
              };
              
              onPreguntaSeleccionada(preguntaLimpia);
            }}
            title={p.pregunta} // Tooltip para mostrar la pregunta completa
          >
            {p.pregunta}
          </button>
        ))}

      </div>
      {showInventorySearch && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setShowInventorySearch(false)}
              style={styles.closeButton}
              title="Cerrar"
            >
              ✕
            </button>
            <div style={{
              position: 'relative',
              width: '95%',
              maxWidth: '1000px',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <button
                onClick={() => setShowInventorySearch(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  zIndex: 10
                }}
                aria-label="Cerrar buscador de inventario"
              >
                ✕
              </button>
              <InventorySearch onClose={() => setShowInventorySearch(false)} />
            </div>
          </div>
        </div>
      )}
      {showMultimediaModal && (
        <MultimediaModal
          isOpen={showMultimediaModal}
          onClose={() => setShowMultimediaModal(false)}
          grupoId={grupoActual}
          temaId={temaActual}
        />
      )}
      
      {/* Galería de Multimedia */}
      {showGaleriaMultimedia && (
        <GaleriaMultimedia
          grupoId={grupoActual}
          temaActual={temaActual}
          onClose={() => setShowGaleriaMultimedia(false)}
        />
      )}
    </div>
  );
}

const styles = {
  backButton: {
    position: "fixed",
    top: "32px",
    left: "32px",
    zIndex: 100,
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#ffffff",
    border: "2px solid #0369a1",
    boxShadow: "rgba(2, 132, 199, 0.15) 0px 2px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s ease-out",
  },
  backButtonIcon: {
    fontSize: "28px",
    color: "#0369a1",
    lineHeight: 1,
    fontWeight: "bold",
  },
  wrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "12px 0",
    backgroundColor: "transparent",
    backdropFilter: "none",
    borderTop: "none",
    zIndex: 100,
  },
  scrollArea: {
    maxHeight: "210px", // Slightly taller to accommodate text
    width: "95%",
    maxWidth: "550px",
    overflowY: "auto",
    padding: "8px 4px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    scrollbarWidth: "thin",
    scrollbarColor: "#0369a1 #f0f0f0",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "rgba(3, 105, 161, 0.9)",
    color: "white",
    border: "1px solid #1e40af",
    padding: "12px 16px", // Aumentado para mejor legibilidad
    minHeight: "55px", // Aumentado para acomodar texto completo
    textAlign: "left",
    wordWrap: "break-word",
    whiteSpace: "normal",
    borderRadius: "10px",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "1.4", // Mejor espaciado de líneas
    cursor: "pointer",
    transition: "all 0.2s ease", // Transición más suave
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden", // Evitar desbordamiento
    textOverflow: "ellipsis",
    ":hover": {
      backgroundColor: "rgba(3, 105, 161, 1)",
      transform: "scale(1.02)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    }
  },
  multimediaButton: {
    backgroundColor: "rgba(25, 55, 109, 0.9)", // Color azul marino oscuro
    border: "1px solid #1e3a8a",
    textAlign: "center",
    fontWeight: 600,
    ":hover": {
      backgroundColor: "rgba(25, 55, 109, 1)",
      transform: "scale(1.02)",
    },
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    padding: "5px 10px",
    borderRadius: "50%",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  
  // 🎯 Estilo para preguntas ya visitadas (oscurecido y tenue)
  buttonVisitado: {
    backgroundColor: "#f3f4f6", // Gris claro
    border: "2px solid #d1d5db", // Borde gris más oscuro
    color: "#6b7280", // Texto gris
    opacity: "0.75", // Ligeramente transparente
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)", // Sombra más sutil
  },
};
