import React, { useState, useEffect, useRef, useCallback } from 'react';
import GruposTematicos from './GruposTematicos2'; // Usando la versión simplificada
import RespuestaPredefinida from './RespuestaPredefinida';
import InventorySearch from './InventorySearch';
import PreguntasScrollList from './PreguntasScrollList';
import { useChatbotAnimation } from '../hooks/useChatbotAnimation';
// Eliminar import directo de respuestas
// import respuestas from '../data/Respuestas.json';

// Nuevo: Contexto para zoom del delfín
import { Canvas } from '@react-three/fiber';

function TemasMalvinas({ temas, onTemaSeleccionado, onVolver }) {
  // Posiciones fijas para los temas
  const positions = {};
  const containerRef = useRef(null);

  // Posiciones fijas para los temas
  const getPosition = (tema, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    
    const defaultPositions = [
      { x: 20, y: 20 },
      { x: 40, y: 20 },
      { x: 60, y: 20 },
      { x: 80, y: 20 },
      { x: 20, y: 40 },
      { x: 40, y: 40 },
      { x: 60, y: 40 },
      { x: 80, y: 40 },
      { x: 20, y: 60 },
      { x: 40, y: 60 },
      { x: 60, y: 60 },
      { x: 80, y: 60 },
    ];
    
    // If we have a saved position for this tema, use it
    if (tema && tema.nombre && positions[tema.nombre]) {
      return positions[tema.nombre];
    }
    
    // Otherwise use the default position based on index
    return defaultPositions[index] || { x: 20 + (col * 20), y: 20 + (row * 20) };
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 1000,
        overflow: 'hidden',
        touchAction: 'none'
      }}
      onMouseMove={(e) => {
        // Actualizar el cursor cuando se presiona Shift
        if (e.shiftKey && !dragging) {
          document.body.style.cursor = 'grab';
        } else if (!e.shiftKey && !dragging) {
          document.body.style.cursor = '';
        }
      }}
    >
      {/* Botón de volver */}
      <button 
        onClick={onVolver}
        style={{
          position: 'fixed',
          top: '32px',
          left: '32px',
          zIndex: 1001,
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '2px solid #0369a1',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease-out',
          ':hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
          },
          ':active': {
            transform: 'scale(0.98)'
          }
        }}
        title="Volver"
      >
        <span style={{
          fontSize: '28px',
          color: '#0369a1',
          display: 'inline-block',
          transform: 'rotate(180deg)',
          transition: 'transform 0.2s ease-out',
          transformOrigin: 'center center',
          lineHeight: 1,
          willChange: 'transform',
          marginLeft: '2px'
        }}>➜</span>
      </button>
      {temas.map((tema, index) => {
        const pos = getPosition(tema, index);
        const isDragging = dragging === tema.nombre;
        const isHovered = hoveredItem === tema.nombre;
        
        return (
          <div
            key={tema.nombre}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '140px',
              minHeight: '140px',
              borderRadius: '12px',
              background: isHovered ? '#0c2a40' : '#0a1e2e',
              color: 'white',
              cursor: dragging === tema.nombre ? 'grabbing' : (window.event?.shiftKey ? 'grab' : 'pointer'),
              transition: 'all 0.2s ease-out',
              boxShadow: isHovered && window.event?.shiftKey 
                ? '0 0 0 2px #3b82f6, 0 4px 20px rgba(0, 0, 0, 0.3)' 
                : isHovered 
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.2)',
              border: `2px solid ${isHovered ? '#3b82f6' : '#1e40af'}`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              padding: '12px',
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '1.3',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-out',
              zIndex: isDragging ? 1000 : index + 1,
              opacity: isDragging ? 0.9 : 1,
              userSelect: 'none',
              wordBreak: 'break-word',
              overflow: 'hidden',
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
              willChange: 'transform, box-shadow, opacity',
              animation: isHovered ? 'pulse 1.5s infinite' : 'none'
            title={tema.nombre}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineClamp: 3,
              boxOrient: 'vertical',
              maxHeight: '100%',
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}>
              {tema.nombre}
            </div>
          </div>
        );
      })}
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }
      `}</style>
    </div>
  );
}

function PreguntasListaBloques({ preguntas, onPreguntaSeleccionada }) {
  const [positions, setPositions] = useState({});
  const containerRef = useRef(null);

  // Cargar posiciones guardadas
  useEffect(() => {
    try {
      const saved = localStorage.getItem('preguntasPositions');
      if (saved) {
        setPositions(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error al cargar posiciones:', e);
    }
  }, []);

  // Guardar posiciones cuando cambien
  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      try {
        localStorage.setItem('preguntasPositions', JSON.stringify(positions));
      } catch (e) {
        console.error('Error al guardar posiciones:', e);
      }
    }
  }, [positions]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        transform: 'none',
        background: 'transparent',
        zIndex: 10,
        padding: '16px',
        borderRadius: 16,
        boxShadow: 'none',
        overflow: 'auto',  // Allow content to go outside container
        pointerEvents: 'none', // Allow clicks to pass through to elements below
      }}
    >
      {preguntas.map((p, idx) => {
        // Grid fallback to prevent overflow: 5 columns
        // Use saved position if reasonable, else default grid
        let saved = positions[p.pregunta];
        if (saved && (saved.left < 15 || saved.left > 85 || saved.top < 15 || saved.top > 85)) {
          saved = null; // discard unreasonable saved value
        }
        const position = saved || (() => {
                    // Colocar todos en el centro con ligera dispersión en espiral
          const radiusStep = 5; // distancia entre anillos
          const angle = idx * 20; // grados
          const radius = Math.floor(idx / 10) * radiusStep;
          return {
            left: 50 + radius * Math.cos(angle * Math.PI / 180),
            top: 50 + radius * Math.sin(angle * Math.PI / 180)
          };
        })();
        // Clamp positions to keep blocks within container view
        const clampedPos = {
          left: Math.min(Math.max(position.left, 1), 99),
          top: Math.min(Math.max(position.top, 1), 99)
        };
        // Persist new clamped position if it differs (to fix old bad values)
        if (!saved) {
          setPositions(prev => ({...prev, [p.pregunta]: clampedPos}));
        }
        
        // Ajustar la animación para que coincida con los íconos circulares
        const animationDelay = idx * 0.2; // Retraso escalonado como en los íconos
        const animationDuration = 8; // Misma duración que los íconos
        
        return (
          <div
            key={idx}
            onClick={() => onPreguntaSeleccionada(p)}
            style={{
              position: 'absolute',
              left: `${clampedPos.left}%`,
              top: `${clampedPos.top}%`,
              transform: 'translate(-50%, -50%)',
              minWidth: '150px',
              maxWidth: '220px',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '2px solid #0369a1',
              background: '#ffffff',
              color: '#0369a1',
              fontSize: '0.9rem', // Tamaño de fuente ligeramente más pequeño
              fontWeight: 400, // Fuente más fina (sin negrita)
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: idx + 1,
              userSelect: 'none',
              pointerEvents: 'auto',
              // Aplicando la misma animación que los íconos circulares
              animation: `float ${animationDuration}s ease-in-out infinite`,
              animationDelay: `${animationDelay}s`,
              willChange: 'transform',
              '&:hover': {
                transform: 'translate(-50%, -50%) scale(1.05)',
                borderColor: '#0284c7',
                boxShadow: '0 6px 20px rgba(2, 132, 199, 0.2)',
                background: '#f8fafc',
                zIndex: 1000
              },
              '&:active': {
                transform: 'translate(-50%, -50%) scale(0.98)',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.15)'
              }
            }}
          >
            {p.pregunta}
          </div>
        );
      })}
      {/*
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '12px',
          fontSize: '0.95rem',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ marginRight: '8px' }}>🖱️</span>
          Mantén presionado <kbd>Shift</kbd> + clic para mover las preguntas
        </div>
      */}
    </div>
  );
}

export default function ChatbotEscenario({ onVisualizadorAbierto }) {
  const { updateAnimation } = useChatbotAnimation();
  const [respuestas, setRespuestas] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [subgrupoMalvinas, setSubgrupoMalvinas] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInventorySearch, setShowInventorySearch] = useState(false);
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
    console.log('Iniciando carga de datos...');
    // Usar una ruta relativa que funcione tanto en desarrollo como en producción
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/Respuestas.json');
        if (!response.ok) {
          throw new Error(`Error al cargar los datos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Datos cargados correctamente:', data);
        setRespuestas(data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        // Cargar datos de respaldo en caso de error
        try {
          const backupData = await import('../data/Respuestas.json');
          console.log('Usando datos de respaldo:', backupData);
          setRespuestas(backupData);
        } catch (e) {
          console.error('No se pudieron cargar los datos de respaldo:', e);
        }
      }
    };

    fetchData();
  }, []);

  if (!respuestas) {
    console.log('Esperando a que se carguen los datos...');
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        padding: '20px',
        boxSizing: 'border-box',
        background: 'transparent',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          zIndex: 1000,
          color: 'white',
          fontSize: '24px',
          fontFamily: 'sans-serif'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  const handleGrupoSeleccionado = (grupoId) => {
    // ...
    setGrupoSeleccionado(grupoId);
    setSubgrupoMalvinas(null);
    setPreguntaSeleccionada(null);
  };
  const handleSubgrupoMalvinas = (tema) => {
    setSubgrupoMalvinas(tema);
  };

  // Función para reiniciar las posiciones de los temas de Malvinas
  const handleReiniciarMalvinas = () => {
    try {
    // Forzar recarga del componente TemasMalvinas
      setSubgrupoMalvinas(null);
      // Pequeño retraso para asegurar que el estado se actualice
      setTimeout(() => setSubgrupoMalvinas(undefined), 10);
    } catch (e) {
      console.error('Error al reiniciar posiciones de Malvinas:', e);
    }
  };

  const handlePreguntaSeleccionada = (pregunta) => {
    // Verificar si es la pregunta de búsqueda de inventario (por respuesta o bandera)
    if (pregunta.respuesta === "INVENTORY_SEARCH_TRIGGER" || pregunta.esBusquedaInventario) {
      // Mostrar el buscador de inventario
      setShowInventorySearch(true);
      
      // Agregar un mensaje al historial
      const mensajeBusqueda = {
        pregunta: "Buscador de inventario",
        respuesta: "Por favor, ingresa el número de inventario del objeto que deseas buscar.",
        esBusqueda: true
      };
      setPreguntaSeleccionada(mensajeBusqueda);
      setHistory((prev) => [...prev, mensajeBusqueda]);
      return;
    }
    
    // Comportamiento normal para otras preguntas
    setPreguntaSeleccionada(pregunta);
    // Trigger speaking animation
    updateAnimation(subgrupoMalvinas ? 'Malvinas' : respuestas[grupoSeleccionado]?.nombre || grupoSeleccionado, true);
    setShowHistory(false);
    
    // Actualizar el grupo actual en el contexto de chat
    if (chat && chat.setCurrentGroup) {
      chat.setCurrentGroup(grupoSeleccionado || subgrupoMalvinas || '');
    }
    
    // Agregar al historial
    setHistory(prev => {
      const newHistory = [...prev, { 
        pregunta: pregunta.pregunta, 
        respuesta: pregunta.respuesta 
      }];
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
      respuesta: resultado.encontrado ? 
        `Objeto encontrado:\n${JSON.stringify(resultado.objeto, null, 2)}` : 
        'No se encontró ningún objeto con ese número de inventario.',
      esResultadoBusqueda: true
    };
    
    setPreguntaSeleccionada(mensajeResultado);
    setHistory((prev) => [...prev, mensajeResultado]);
  };

  const volver = () => {
    if (preguntaSeleccionada) setPreguntaSeleccionada(null);
    else if (subgrupoMalvinas) setSubgrupoMalvinas(null);
    else if (grupoSeleccionado) setGrupoSeleccionado(null);
  };

  const handleRespuestaCompleta = () => {
    // Switch back to idle when finished speaking
    updateAnimation(subgrupoMalvinas ? 'Malvinas' : respuestas[grupoSeleccionado]?.nombre || grupoSeleccionado, false);
    setTimeout(() => {
      volver();
    }, 2000);
  };

  const handleReset = () => {
    updateAnimation('', false);
    setGrupoSeleccionado(null);
    setSubgrupoMalvinas(null);
    setPreguntaSeleccionada(null);
    setHistory([]);
  };

  // Nuevo: Determinar si el delfín debe estar en modo zoom (respuesta)
  const zoomed = !!preguntaSeleccionada;

  // Renderizar el modelo 3D con el zoom adecuado
  // El modelo 3D debe estar en App.jsx, pero aquí mostramos solo la UI

  if (preguntaSeleccionada) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <RespuestaPredefinida 
          pregunta={preguntaSeleccionada} 
          onVolver={volver} 
          onRespuestaCompleta={handleRespuestaCompleta}
          onVisualizadorAbierto={onVisualizadorAbierto}
        />
      </div>
    );
  }

  return (
    <>
      {/* Botones de control */}
      {/* Botón de búsqueda de inventario - Solo visible cuando se selecciona el grupo 'Museo Escolar' (id: 'C') */}
      {grupoSeleccionado === 'C' && (
        <div
          style={{
            position: 'fixed',
            left: '20px',
            top: '20px',
            zIndex: 100,
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setShowInventorySearch(true)}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#0ea5e9',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      )}

      {/* Botón de Volver - Solo para grupos que no sean Malvinas */}
      {(grupoSeleccionado && grupoSeleccionado !== 'D' && !subgrupoMalvinas) && (
        <button 
          onClick={volver}
          style={{ 
            position: 'fixed', 
            top: 32, 
            left: 110, 
            zIndex: 100,
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid #0369a1',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-out',
            ':hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
              background: '#f8fafc'
            }
          }}
          title="Volver"
        >
          <span style={{
            fontSize: '28px',
            color: '#0369a1',
            display: 'inline-block',
            transform: 'rotate(180deg)',
            transition: 'transform 0.2s ease-out',
            transformOrigin: 'center center',
            lineHeight: 1,
            willChange: 'transform',
            marginLeft: '2px'
          }}>➜</span>
        </button>
      )}

      {/* Botón de Reiniciar - Solo para grupos que no sean Malvinas */}
      {(grupoSeleccionado && grupoSeleccionado !== 'D') && (
        <button 
          onClick={handleRefresh}
          style={{ 
            position: 'fixed', 
            top: 32, 
            left: 32, 
            zIndex: 100,
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid #0369a1',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease-out',
            ':hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
            },
            ':active': {
              transform: 'scale(0.98)'
            },
            transform: isRefreshing ? 'rotate(360deg)' : 'none',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }} 
          disabled={isRefreshing}
          title="Reiniciar conversación"
        >
          <svg width="28" height="28" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{
            transition: 'transform 0.3s ease-out',
            transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)'
          }}>
            <path d="M1 4v6h6"/>
            <path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      )}

      {/* Botón de Volver - Eliminado ya que ahora está arriba */}

      <button 
        onClick={() => setShowHistory(h => !h)} 
        style={{ 
          position: 'fixed', 
          top: 32, 
          right: 32, 
          zIndex: 100,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: '#ffffff',
          border: '2px solid #0369a1',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease-out',
          ':hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
          },
          ':active': {
            transform: 'scale(0.98)'
          }
        }} 
        title="Ver historial"
      >
        <svg width="28" height="28" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{
          transition: 'transform 0.3s ease-out',
          transform: showHistory ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
        }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </button>
      
      <style jsx="true" global="true">{`
        .refresh-button:active {
          transform: scale(0.97) !important;
        }
      `}</style>

      {/* Historial */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: 90,
          right: 32,
          zIndex: 100,
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
          padding: '24px 32px',
          minWidth: 320,
          maxWidth: 400,
          maxHeight: 400,
          overflowY: 'auto',
          fontFamily: 'Montserrat',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontSize: '0.98em'
        }}>
          <div style={{fontWeight: 700, fontSize: '1.1em', marginBottom: 12, textAlign: 'center'}}>
            Historial de conversación
          </div>
          {history.length === 0 && (
            <div style={{color: '#64748b', textAlign: 'center'}}>Sin mensajes aún.</div>
          )}
          {history.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 12,
              background: '#f8fafc',
              borderRadius: 12
            }}>
              <div style={{fontWeight: 600, color: '#0f172a'}}>{item.pregunta}</div>
              <div style={{color: '#334155', fontSize: '0.95em'}}>{item.respuesta}</div>
            </div>
          ))}
        </div>
      )}

      {/* Buscador de Inventario */}
      {showInventorySearch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>Buscador de Inventario</h2>
              <button 
                onClick={handleCerrarBuscador}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  ':hover': {
                    color: '#333'
                  }
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
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto',
        overflow: 'visible',
        paddingBottom: showInventorySearch ? '400px' : '0',
        transition: 'padding-bottom 0.3s ease'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          padding: '40px',
          overflow: 'visible'  // Aseguramos que los elementos que salgan del contenedor sean visibles
        }}>
          {!grupoSeleccionado ? (
            <GruposTematicos 
              respuestas={respuestas}
              onGrupoSeleccionado={handleGrupoSeleccionado}
            />
          ) : grupoSeleccionado === 'D' && !subgrupoMalvinas ? (
            <TemasMalvinas 
              temas={respuestas[grupoSeleccionado].temas}
              onTemaSeleccionado={handleSubgrupoMalvinas}
              onVolver={volver}
              onReiniciar={handleReiniciarMalvinas}
            />
          ) : (
            <PreguntasScrollList
              preguntas={subgrupoMalvinas ? 
                subgrupoMalvinas.preguntas : 
                // Maintain original order by not using flatMap
                respuestas[grupoSeleccionado].temas.reduce((acc, tema) => {
                  return [...acc, ...tema.preguntas];
                }, [])}
              onPreguntaSeleccionada={handlePreguntaSeleccionada}
            />
          )}
        </div>
      </div>
    </>
  );
}