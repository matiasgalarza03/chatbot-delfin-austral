import React, { useState, useEffect } from 'react';
import './GruposTematicos.css';
import useSound from 'use-sound';
import hoverSound from '../sounds/hover.mp3';
import clickSound from '../sounds/click.mp3';

const nombresCompletos = {
  A: 'Delfín Austral',
  B: 'Escuela Secundaria N° 3 Malvinas Argentinas',
  C: 'Museo Escolar',
  D: 'Malvinas',
};

const gruposOrden = ['A', 'B', 'C', 'D'];

const posicionesFijas = {
  A: { left: '50%', top: '20%' },
  B: { left: '20%', top: '50%' },
  C: { left: '50%', top: '80%' },
  D: { left: '80%', top: '50%' }
};

export default function GruposTematicos({ onGrupoSeleccionado, respuestas }) {
  const [hoveredGrupo, setHoveredGrupo] = useState(null);
  
  const [playHover] = useSound(hoverSound, { volume: 0.5 });
  const [playClick] = useSound(clickSound, { volume: 0.5 });



  const handleGrupoClick = (e, grupoId) => {
    e.stopPropagation();
    if (playClick) playClick();
    if (onGrupoSeleccionado) {
      onGrupoSeleccionado(grupoId);
    }
  };

  const handleMouseEnter = (e, grupoId) => {
    e.stopPropagation();
    setHoveredGrupo(grupoId);
    if (playHover) playHover();
  };

  if (!respuestas) {
    console.log('No hay respuestas disponibles');
    return <div>Cargando grupos temáticos...</div>;
  }

  return (
    <div className="grupos-tematicos-container">
      {Object.entries(respuestas).map(([id, grupo]) => {
        const position = posicionesFijas[id] || { left: '50%', top: '50%' };
        const isHovered = hoveredGrupo === id;
        
        return (
          <div
            key={id}
            className={`grupo-tematico ${isHovered ? 'hovered' : ''}`}
            style={{
              left: posicionesFijas[id]?.left || '50%',
              top: posicionesFijas[id]?.top || '50%',
              transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.05)' : ''}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={(e) => handleGrupoClick(e, id)}
            onMouseEnter={(e) => handleMouseEnter(e, id)}
          >
            <span style={{ fontSize: '1em', pointerEvents: 'none' }}>
              {grupo.nombre || nombresCompletos[id] || `Grupo ${id}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TemasMalvinas({ temas, onTemaSeleccionado, onVolver, onReiniciar }) {
  // Posiciones fijas personalizadas para los temas de Malvinas
  const posiciones = [
    { top: '30%', left: '30%' },     // Arriba izquierda
    { top: '30%', right: '30%' },    // Arriba derecha
    { bottom: '30%', left: '30%' },  // Abajo izquierda
    { bottom: '30%', right: '30%' }  // Abajo derecha
  ];

  const buttonStyle = {
    position: 'absolute',
    zIndex: 100,
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: '#ffffff',
    border: '2px solid #0369a1',
    boxShadow: 'rgba(2, 132, 199, 0.15) 0px 2px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0
  };

  const iconStyle = {
    fontSize: '28px',
    display: 'inline-block',
    lineHeight: 1,
    color: '#0369a1'
  };

  return (
    <div 
      className="grupos-tematicos-container"
      onMouseLeave={() => setHoveredGrupo(null)}
    >
      {/* Botón de Reiniciar - A la izquierda */}
      <button 
        onClick={onReiniciar} 
        title="Reiniciar"
        style={{
          ...buttonStyle,
          top: '32px',
          left: '32px',
          borderColor: '#d32f2f',
          background: '#ffffff'
        }}
      >
        <span style={{ ...iconStyle, color: '#d32f2f' }}>↻</span>
      </button>

      {/* Botón de Volver - A la derecha */}
      <button 
        onClick={onVolver} 
        title="Volver al menú principal"
        style={{
          ...buttonStyle,
          top: '32px',
          left: '106px',  // 32px (left) + 54px (button width) + 20px (margin)
          borderColor: '#0369a1'
        }}
      >
        <span style={iconStyle}>←</span>
      </button>
      {temas.map((tema, idx) => (
        <button
          key={tema.nombre}
          className="icono-circular-grupo"
          style={{ ...posiciones[idx % posiciones.length], position: 'absolute' }}
          onClick={() => onTemaSeleccionado(tema)}
        >
          <span>{tema.nombre}</span>
        </button>
      ))}
    </div>
  );
}