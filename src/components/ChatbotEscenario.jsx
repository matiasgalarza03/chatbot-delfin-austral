import React, { useState, useEffect, useRef, useCallback } from "react";
import GruposTematicos from "./GruposTematicos2"; // Usando la versión simplificada
import RespuestaPredefinida from "./RespuestaPredefinida";
import InventorySearch from "./InventorySearch";
import InventoryViewer from "./InventoryViewer";
import PreguntasScrollList from "./PreguntasScrollList";
import { useChatbotAnimation } from "../hooks/useChatbotAnimation";
import respuestas from '../data/Respuestas.json';

function TemasMalvinas({ temas, onTemaSeleccionado, onVolver }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const containerRef = useRef(null);

  // Posiciones fijas permanentes para los temas de Malvinas
  const getPosition = (tema, index) => {
    // Posiciones personalizadas y fijas por nombre de tema
    const fixedPositions = {
      "Contexto Geográfico e Histórico de las Islas Malvinas": { x: 25, y: 25 },
      "Desarrollo y Consecuencias del Conflicto Armado (1982)": { x: 75, y: 25 },
      "Impacto Social y Cultural de la Guerra en Argentina": { x: 25, y: 75 },
      "Legado y Realidad Actual de las Islas Malvinas": { x: 75, y: 75 },
      "Recursos Adicionales": { x: 50, y: 92 }, // Posición inferior que no tapa la cola del modelo 3D
    };

    // Si hay una posición fija para este tema, usarla
    if (tema && tema.nombre && fixedPositions[tema.nombre]) {
      return fixedPositions[tema.nombre];
    }

    // Posiciones por defecto en grid para temas adicionales
    const defaultPositions = [
      { x: 25, y: 25 },
      { x: 50, y: 25 },
      { x: 75, y: 25 },
      { x: 25, y: 50 },
      { x: 50, y: 50 },
      { x: 75, y: 50 },
      { x: 25, y: 75 },
      { x: 50, y: 75 },
      { x: 75, y: 75 },
    ];

    return defaultPositions[index] || { x: 25 + (index % 3) * 25, y: 25 + Math.floor(index / 3) * 25 };
  };

  // Filtrar el tema 'Recursos Adicionales' para no mostrarlo
  const temasFiltrados = temas.filter(tema => tema.nombre !== "Recursos Adicionales");

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Botón de volver */}
      <button
        onClick={onVolver}
        style={{
          position: "fixed",
          top: "32px",
          left: "32px",
          zIndex: 1001,
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid #0369a1",
          boxShadow: "0 2px 8px rgba(2, 132, 199, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease-out",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 4px 12px rgba(2, 132, 199, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 2px 8px rgba(2, 132, 199, 0.15)";
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        title="Volver"
      >
        <span
          style={{
            fontSize: "28px",
            color: "#0369a1",
            lineHeight: 1,
            fontWeight: "bold",
          }}
        >
          ←
        </span>
      </button>

      {temasFiltrados.map((tema, index) => {
        const pos = getPosition(tema, index);
        const isHovered = hoveredItem === tema.nombre;

        return (
          <div
            key={tema.nombre}
            onClick={() => onTemaSeleccionado(tema)}
            onMouseEnter={() => setHoveredItem(tema.nombre)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              width: "140px",
              minHeight: "140px",
              borderRadius: "12px",
              background: isHovered ? "#0c2a40" : "#0a1e2e",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s ease-out",
              boxShadow: isHovered
                ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                : "0 2px 10px rgba(0, 0, 0, 0.2)",
              border: `2px solid ${isHovered ? "#3b82f6" : "#1e40af"}`,
              padding: "12px",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "1.3",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: index + 1,
              userSelect: "none",
              overflow: "hidden",
              transformOrigin: "center center",
              animation: isHovered ? "pulse 1.5s infinite" : "none",
              hyphens: "none",
              WebkitHyphens: "none",
              msHyphens: "none",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word"
            }}
            title={tema.nombre}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                boxSizing: "border-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                lineClamp: 3,
                boxOrient: "vertical",
                maxHeight: "100%",
                wordBreak: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "none",
                WebkitHyphens: "none",
                msHyphens: "none",
                whiteSpace: "normal"
              }}
            >
              {tema.nombre}
            </div>
          </div>
        );
      })}

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}

export default function ChatbotEscenario({ 
  onVisualizadorAbierto,
  onUserInteraction,
  preguntasVisitadas,
  setPreguntasVisitadas,
  onResetPreguntasVisitadas,
  onShowInventoryModal,
}) {
  const { updateAnimation } = useChatbotAnimation();
  const [respuestas, setRespuestas] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [subgrupoMalvinas, setSubgrupoMalvinas] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [showInventoryViewer, setShowInventoryViewer] = useState(false);

  // Función global para abrir el visor de inventario
  useEffect(() => {
    window.openInventoryViewer = () => {
      setShowInventoryViewer(true);
    };
    
    return () => {
      delete window.openInventoryViewer;
    };
  }, []);
  
  // 🎯 Función para marcar pregunta como visitada (usando estado global)
  const handlePreguntaVisitada = useCallback((pregunta) => {
    console.log('🔍 ChatbotEscenario: Marcando pregunta como visitada:', pregunta);
    setPreguntasVisitadas(prev => new Set([...prev, pregunta]));
  }, [setPreguntasVisitadas]);
  
  // Posición fija para el botón de inventario
  const inventoryBtnPos = { x: 20, y: 20 };

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      handleReset();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    console.log("Iniciando carga de datos...");
    // Usar una ruta relativa que funcione tanto en desarrollo como en producción
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.BASE_URL + "data/Respuestas.json",
        );
        if (!response.ok) {
          throw new Error(
            `Error al cargar los datos: ${response.status} ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log("Datos cargados correctamente:", data);
        setRespuestas(data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        // Cargar datos de respaldo en caso de error
        try {
          const backupData = await import("../data/Respuestas.json");
          console.log("Usando datos de respaldo:", backupData);
          setRespuestas(backupData);
        } catch (e) {
          console.error("No se pudieron cargar los datos de respaldo:", e);
        }
      }
    };

    fetchData();
  }, []);

  if (!respuestas) {
    console.log("Esperando a que se carguen los datos...");
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          padding: "20px",
          boxSizing: "border-box",
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(45, 55, 72, 0.8)",
            zIndex: 1000,
            color: "white",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Cargando grupos temáticos...</h2>
            <p>Por favor, espera un momento.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleGrupoSeleccionado = (grupoId) => {
    setGrupoSeleccionado(grupoId);
    setSubgrupoMalvinas(null);
    setPreguntaSeleccionada(null);

    // Actualizar animación del avatar
    if (updateAnimation) {
      updateAnimation(respuestas[grupoId]?.nombre || grupoId, false);
    }

    // Actualizar el grupo actual en el contexto de chat
    if (chat && chat.setCurrentGroup) {
      chat.setCurrentGroup(grupoId);
    }
  };

  const handleSubgrupoMalvinas = (tema) => {
    setSubgrupoMalvinas(tema);

    // Actualizar animación del avatar para Malvinas
    if (updateAnimation) {
      updateAnimation("Malvinas", false);
    }

    // Actualizar el grupo actual en el contexto de chat
    if (chat && chat.setCurrentGroup) {
      chat.setCurrentGroup("Malvinas");
    }
  };


  // Acceso al contexto de chat
  const chat = window.chatContext;

  const handlePreguntaSeleccionada = (pregunta) => {
    // Verificar que tenemos una pregunta válida
    if (!pregunta || !pregunta.pregunta) {
      console.error('Pregunta inválida recibida:', pregunta);
      return;
    }

    // Verificar si es la pregunta de búsqueda de inventario (por respuesta o bandera)
    if (
      pregunta.respuesta === "INVENTORY_SEARCH_TRIGGER" ||
      pregunta.esBusquedaInventario
    ) {
      // Mostrar el buscador de inventario
      setShowInventorySearch(true);

      // Agregar un mensaje al historial
      const mensajeBusqueda = {
        pregunta: "Buscador de inventario",
        respuesta:
          "Por favor, ingresa el número de inventario del objeto que deseas buscar.",
        esBusqueda: true,
      };
      setPreguntaSeleccionada(mensajeBusqueda);
      setHistory((prev) => [...prev, mensajeBusqueda]);
      return;
    }

    // Verificar que tenemos una respuesta válida
    if (!pregunta.respuesta || pregunta.respuesta.trim() === '') {
      console.error('Respuesta vacía o indefinida para la pregunta:', pregunta.pregunta);
      // Crear una respuesta por defecto
      pregunta.respuesta = "Lo siento, no tengo información disponible para esta pregunta en este momento.";
    }

    // Asegurar que la respuesta esté completa
    const preguntaCompleta = {
      ...pregunta,
      pregunta: pregunta.pregunta.trim(),
      respuesta: pregunta.respuesta.trim()
    };

    // Comportamiento normal para otras preguntas
    setPreguntaSeleccionada(preguntaCompleta);
    
    // Trigger speaking animation
    updateAnimation(
      subgrupoMalvinas
        ? "Malvinas"
        : respuestas[grupoSeleccionado]?.nombre || grupoSeleccionado,
      true,
    );
    setShowHistory(false);

    // Actualizar el grupo actual en el contexto de chat
    if (chat && chat.setCurrentGroup) {
      chat.setCurrentGroup(grupoSeleccionado || subgrupoMalvinas || "");
    }

    // Agregar al historial con datos completos
    setHistory((prev) => {
      const newHistory = [
        ...prev,
        {
          pregunta: preguntaCompleta.pregunta,
          respuesta: preguntaCompleta.respuesta,
        },
      ];
      // Mantener solo los últimos 5 elementos
      return newHistory.slice(-5);
    });
  };

  const handleCerrarBuscador = () => {
    setShowInventorySearch(false);
  };

  const handleResultadoBusqueda = (resultado) => {
    // Agregar el resultado de la búsqueda al historial
    const mensajeResultado = {
      pregunta: `Búsqueda: ${resultado.consulta}`,
      respuesta: resultado.encontrado
        ? `Objeto encontrado:\n${JSON.stringify(resultado.objeto, null, 2)}`
        : "No se encontró ningún objeto con ese número de inventario.",
      esResultadoBusqueda: true,
    };

    setPreguntaSeleccionada(mensajeResultado);
    setHistory((prev) => [...prev, mensajeResultado]);
  };

  const volver = () => {
    // CRÍTICO: Asegurar que la animación vuelva a Happy_Idle cuando se interrumpe
    console.log('🔄 Función volver() ejecutada - Reseteando animación a Happy_Idle');
    
    // Determinar el grupo actual para resetear la animación correctamente
    const grupoParaAnimacion = subgrupoMalvinas 
      ? "Malvinas" 
      : respuestas[grupoSeleccionado]?.nombre || grupoSeleccionado || "";
    
    // Forzar animación idle (speaking = false)
    if (updateAnimation) {
      updateAnimation(grupoParaAnimacion, false);
      console.log('✅ Animación reseteada a idle para grupo:', grupoParaAnimacion);
    }
    
    // Navegar hacia atrás en la jerarquía
    if (preguntaSeleccionada) {
      setPreguntaSeleccionada(null);
    } else if (subgrupoMalvinas) {
      setSubgrupoMalvinas(null);
    } else if (grupoSeleccionado) {
      setGrupoSeleccionado(null);
    }
  };

  const handleRespuestaCompleta = () => {
    console.log('🎬 handleRespuestaCompleta llamado - NO hacer nada automático');
    // Switch back to idle when finished speaking
    updateAnimation(
      subgrupoMalvinas
        ? "Malvinas"
        : respuestas[grupoSeleccionado]?.nombre || grupoSeleccionado,
      false,
    );
    // NO volver automáticamente - dejar que el usuario lea la respuesta completa
    console.log('🎬 Respuesta completada - Usuario puede leer tranquilo');
  };

  const handleReset = () => {
    console.log('🔄 Reset ejecutado - Reseteando todo a estado inicial');
    
    // Resetear animación a Happy_Idle por defecto
    if (updateAnimation) {
      updateAnimation("", false); // Esto debería activar Happy_Idle por defecto
      console.log('✅ Animación reseteada a estado inicial (Happy_Idle)');
    }
    
    setGrupoSeleccionado(null);
    setSubgrupoMalvinas(null);
    setPreguntaSeleccionada(null);
    setHistory([]);
    
    // 🎯 Resetear preguntas visitadas (usando función global)
    if (onResetPreguntasVisitadas) {
      onResetPreguntasVisitadas();
    }
    console.log('🔄 ✅ ChatbotEscenario: Preguntas visitadas reseteadas');
  };

  // Si hay una pregunta seleccionada, mostrar la respuesta SIN OCULTAR EL MODELO 3D
  if (preguntaSeleccionada) {
    return (
      <>
        {/* Mantener el contenido principal visible (modelo 3D) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none", // Permitir que el modelo 3D sea interactivo
            overflow: "visible",
            background: "transparent", // Asegurar fondo transparente
            zIndex: 1, // Mantener por debajo del overlay
          }}
        >
          {/* El modelo 3D seguirá renderizándose aquí desde App.jsx */}
        </div>
        
        {/* Overlay de respuesta predefinida */}
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          pointerEvents: "none", // Solo los elementos específicos serán interactivos
          zIndex: 10 
        }}>
          <RespuestaPredefinida
            pregunta={preguntaSeleccionada}
            onVolver={volver}
            onRespuestaCompleta={handleRespuestaCompleta}
            onVisualizadorAbierto={onVisualizadorAbierto}
            onShowInventoryModal={onShowInventoryModal}
          />
        </div>
      </>
    );
  }

  return (
    <>



      {/* Botón de Reiniciar - Solo para grupos que no sean Malvinas */}
      {grupoSeleccionado && grupoSeleccionado !== "D" && (
        <button
          onClick={handleRefresh}
          style={{
            position: "fixed",
            top: 32,
            left: 32,
            zIndex: 100,
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid #0369a1",
            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isRefreshing ? "not-allowed" : "pointer",
            transition: "all 0.25s ease-out",
            transform: isRefreshing ? "rotate(360deg)" : "none",
            animation: isRefreshing ? "spin 1s linear infinite" : "none",
          }}
          disabled={isRefreshing}
          title="Reiniciar conversación"
        >
          <span
            style={{
              fontSize: "24px",
              color: "#0369a1",
              lineHeight: 1,
              fontWeight: "bold",
            }}
          >
            ↻
          </span>
        </button>
      )}

      <button
        onClick={() => setShowHistory((h) => !h)}
        style={{
          position: "fixed",
          top: 32,
          right: 32,
          zIndex: 100,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid #0369a1",
          boxShadow: "0 2px 8px rgba(2, 132, 199, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.25s ease-out",
        }}
        title="Ver historial"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#0369a1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          style={{
            transition: "transform 0.3s ease-out",
            transform: showHistory
              ? "rotate(90deg) scale(1.1)"
              : "rotate(0deg) scale(1.1)",
          }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </button>

      <style jsx="true" global="true">{`
        .refresh-button:active {
          transform: scale(0.97) !important;
        }
      `}</style>

      {/* Historial */}
      {showHistory && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "32px",
            width: "350px",
            maxHeight: "60vh",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            zIndex: 101,
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
              color: "white",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              Historial de Consultas
            </h3>
          </div>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "0",
            }}
          >
            {history.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                No hay consultas en el historial
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setPreguntaSeleccionada(item);
                    setShowHistory(false);
                  }}
                  style={{
                    padding: "15px 20px",
                    borderBottom:
                      index < history.length - 1
                        ? "1px solid rgba(0, 0, 0, 0.05)"
                        : "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(3, 105, 161, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#0369a1",
                      marginBottom: "5px",
                      lineHeight: "1.3",
                    }}
                  >
                    {item.pregunta}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      lineHeight: "1.4",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.respuesta}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay del buscador de inventario */}
      {showInventorySearch && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "15px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h2 style={{ margin: 0, color: "#2c3e50" }}>
                Buscador de Inventario
              </h2>
              <button
                onClick={handleCerrarBuscador}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#333";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#666";
                }}
                title="Cerrar buscador"
              >
                &times;
              </button>
            </div>

            <InventorySearch
              onClose={handleCerrarBuscador}
              onSearchComplete={handleResultadoBusqueda}
            />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "auto",
          overflow: "visible",
          paddingBottom: showInventorySearch ? "400px" : "0",
          transition: "padding-bottom 0.3s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "30px",
            padding: "40px",
            overflow: "visible", // Aseguramos que los elementos que salgan del contenedor sean visibles
          }}
        >
          {!grupoSeleccionado ? (
            <GruposTematicos
              respuestas={respuestas}
              onGrupoSeleccionado={handleGrupoSeleccionado}
            />
          ) : grupoSeleccionado === "D" && !subgrupoMalvinas ? (
            <TemasMalvinas
              temas={respuestas[grupoSeleccionado].temas}
              onTemaSeleccionado={handleSubgrupoMalvinas}
              onVolver={volver}
              onReiniciar={() => {
                console.log('🔄 Botón de reinicio presionado desde TemasMalvinas');
                handleReset();
                // También resetear preguntas visitadas usando función global
                if (onResetPreguntasVisitadas) {
                  onResetPreguntasVisitadas();
                }
              }}
            />
          ) : (
            <PreguntasScrollList
              preguntas={
                subgrupoMalvinas
                  ? subgrupoMalvinas.preguntas
                  : // Maintain original order by not using flatMap
                    respuestas[grupoSeleccionado].temas.reduce((acc, tema) => {
                      return [...acc, ...tema.preguntas];
                    }, [])
              }
              onPreguntaSeleccionada={handlePreguntaSeleccionada}
              onVolver={
                subgrupoMalvinas ? () => setSubgrupoMalvinas(null) : volver
              }
              esMuseoEscolar={grupoSeleccionado === "C"}
              grupoActual={grupoSeleccionado}
              temaActual={subgrupoMalvinas?.nombre}
              preguntasVisitadas={preguntasVisitadas}
              onPreguntaVisitada={handlePreguntaVisitada}
            />
          )}
        </div>
      </div>

      {/* Visor completo del inventario */}
      {showInventoryViewer && (
        <InventoryViewer 
          isOpen={showInventoryViewer}
          onClose={() => setShowInventoryViewer(false)} 
        />
      )}
    </>
  );
}
