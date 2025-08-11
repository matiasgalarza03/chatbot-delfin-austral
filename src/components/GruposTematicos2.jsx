import React, { useState } from 'react';

function GruposTematicos2({ onGrupoSeleccionado, respuestas, onReiniciar }) {
  const [hoverStates, setHoverStates] = useState({});

  const handleMouseEnter = (grupoId) => {
    setHoverStates(prev => ({ ...prev, [grupoId]: true }));
  };

  const handleMouseLeave = (grupoId) => {
    setHoverStates(prev => ({ ...prev, [grupoId]: false }));
  };
  const grupos = [
    { 
      id: 'A', 
      nombre: 'Delfín Austral', 
      color: '#ffffff',
      shadow: 'none'
    },
    { 
      id: 'B', 
      nombre: 'Escuela Secundaria N° 3 Malvinas Argentinas', 
      color: '#ffffff',
      shadow: 'none'
    },
    { 
      id: 'C', 
      nombre: 'Museo Escolar', 
      color: '#ffffff',
      shadow: 'none'
    },
    { 
      id: 'D', 
      nombre: 'Malvinas', 
      color: '#ffffff',
      shadow: '0 8px 30px rgba(243, 156, 18, 0.4)'
    }
  ];
  // Posiciones fijas para los grupos
  // Fixed positions based on user's layout
  const positions = {
    // Delfín Austral
    A: { left: '24.29%', top: '25%' },
    // Escuela Secundaria N° 3 Malvinas Argentinas
    B: { left: '74.91%', top: '26.5%' },
    // Museo Escolar
    C: { left: '30.63%', top: '76.64%' },
    // Malvinas
    D: { left: '69.46%', top: '77.05%' }
  };

  const handleClick = (id) => {
    console.log('Grupo clickeado:', id);
    if (onGrupoSeleccionado) {
      onGrupoSeleccionado(id);
    }
  };

  if (!respuestas) {
    console.log('No hay respuestas disponibles');
    return <div>Cargando grupos temáticos...</div>;
  }

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        padding: '40px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      {/* Botón de reinicio */}
      <button 
        onClick={onReiniciar}
        style={{
          position: 'fixed',
          top: '32px',
          left: '32px',
          zIndex: 100,
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
          transition: 'all 0.25s ease-out',
          outline: 'none',
          ':hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
          },
          ':active': {
            transform: 'scale(0.98)'
          }
        }}
        title="Reiniciar conversación"
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
            transition: 'transform 0.3s ease-out',
            transform: 'rotate(0deg)'
          }}
        >
          <path d="M1 4v6h6"></path>
          <path d="M23 20v-6h-6"></path>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
      </button>
      {grupos.map((grupo) => {
        const isHovered = hoverStates[grupo.id];
        
        return (
          <div
            key={grupo.id}
            style={{
              position: 'absolute',
              left: positions[grupo.id]?.left || '50%',
              top: positions[grupo.id]?.top || '50%',
              transform: hoverStates[grupo.id] 
                ? 'translate(-50%, -50%) scale(1.1)' 
                : 'translate(-50%, -50%) scale(1)',
              transformOrigin: 'center',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: grupo.color,
              color: grupo.color === '#ffffff' ? '#0a1e2e' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: `3px solid ${grupo.color === '#ffffff' ? 'rgba(14, 165, 233, 0.4)' : 'rgba(255, 255, 255, 0.95)'}`,
              boxShadow: hoverStates[grupo.id] 
                ? '0 0 0 2px rgba(14, 165, 233, 0.6), 0 0 30px 15px rgba(14, 165, 233, 0.2)'
                : '0 0 0 1px rgba(14, 165, 233, 0.2), 0 0 15px 5px rgba(14, 165, 233, 0.1)',
              transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.1, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0.1, 1)',
              zIndex: 100,
              userSelect: 'none',
              touchAction: 'none',
              textAlign: 'center',
              padding: '12px',
              boxSizing: 'border-box',
              wordBreak: 'break-word',
              animation: 'float 6s ease-in-out infinite',
              animationDelay: `${grupo.id.charCodeAt(0) * 0.2}s`,
              willChange: 'transform, box-shadow, background',

            }}
            onMouseEnter={() => handleMouseEnter(grupo.id)}
            onMouseLeave={() => handleMouseLeave(grupo.id)}
            onClick={() => handleClick(grupo.id)}
          >
            <span style={{
              pointerEvents: 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0, 0.1, 1)',
              transform: 'none',
              fontSize: grupo.nombre.length > 40 ? '11px' : grupo.nombre.length > 30 ? '12px' : '13px',
              lineHeight: '1.2',
              display: '-webkit-box',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '100%',
              width: '100%',
              padding: '5px',
              boxSizing: 'border-box',
              wordBreak: 'break-word',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              fontWeight: 600
            }}>
              {grupo.nombre}
            </span>
          </div>
        );
      })}
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
      `}</style>
      

    </div>
  );
}

export default GruposTematicos2;
