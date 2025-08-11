import React, { useState, useEffect } from 'react';
import GruposTematicos from './GruposTematicos';
import RespuestaPredefinida from './RespuestaPredefinida';
// Eliminar import directo de respuestas
// import respuestas from '../data/Respuestas.json';

// Nuevo: Contexto para zoom del delfín
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';

function TemasMalvinas({ temas, onTemaSeleccionado, onVolver }) {
  const posiciones = [
    { top: '23%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '56%', left: '19%', transform: 'translate(-50%, -50%)' },
    { top: '56%', left: '81%', transform: 'translate(-50%, -50%)' },
    { top: '83%', left: '50%', transform: 'translate(-50%, -50%)' },
  ];
  return (
    <div className="grupos-tematicos-container">
      <button onClick={onVolver} style={{ position: 'absolute', top: 20, left: 20, fontSize: 22, zIndex: 20 }}>⬅️ Volver</button>
      {temas.map((tema, idx) => (
        <button
          key={tema.nombre}
          className="icono-circular-grupo"
          style={{ ...posiciones[idx % posiciones.length], position: 'absolute' }}
          onClick={() => onTemaSeleccionado(tema)}
        >
          {tema.nombre}
        </button>
      ))}
    </div>
  );
}

function PreguntasListaBloques({ preguntas, onPreguntaSeleccionada }) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '58%',
      transform: 'translateX(-50%)',
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '320px',
      overflowY: 'auto',
      background: 'transparent',
      zIndex: 10,
      padding: '0 0 16px 0',
      borderRadius: 16,
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {preguntas.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onPreguntaSeleccionada(p)}
          style={{
            width: '100%',
            margin: '8px 0',
            padding: '18px 16px',
            borderRadius: 14,
            border: '1.5px solid #bdbdbd',
            background: '#f3f4f6',
            color: '#222',
            fontSize: '1.08rem',
            fontWeight: 500,
            textAlign: 'left',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
            cursor: 'pointer',
            transition: 'background 0.18s, border 0.18s',
            outline: 'none',
          }}
        >
          {p.pregunta}
        </button>
      ))}
    </div>
  );
}

export default function ChatbotEscenario({ onVisualizadorAbierto }) {
  const [respuestas, setRespuestas] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [subgrupoMalvinas, setSubgrupoMalvinas] = useState(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch('/data/Respuestas.json')
      .then(res => res.json())
      .then(data => {
        setRespuestas(data);
      });
  }, []);

  if (!respuestas) return null;

  const handleGrupoSeleccionado = (grupoId) => {
    setGrupoSeleccionado(grupoId);
    setSubgrupoMalvinas(null);
    setPreguntaSeleccionada(null);
  };
  const handleSubgrupoMalvinas = (tema) => {
    setSubgrupoMalvinas(tema);
    setPreguntaSeleccionada(null);
  };
  const handlePreguntaSeleccionada = (pregunta) => {
    setPreguntaSeleccionada(pregunta);
    setHistory((prev) => [...prev, { pregunta: pregunta.pregunta, respuesta: pregunta.respuesta }]);
  };

  const volver = () => {
    if (preguntaSeleccionada) setPreguntaSeleccionada(null);
    else if (subgrupoMalvinas) setSubgrupoMalvinas(null);
    else if (grupoSeleccionado) setGrupoSeleccionado(null);
  };

  const handleRespuestaCompleta = () => {
    setTimeout(() => {
      volver();
    }, 2000);
  };

  const handleReset = () => {
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
      <button 
        onClick={handleReset} 
        style={{ 
          position: 'fixed', 
          top: 32, 
          left: 32, 
          zIndex: 100,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#cbd5e1',
          border: '2px solid #0a2233',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }} 
        title="Reiniciar"
      >
        ↺
      </button>

      <button 
        onClick={() => setShowHistory(h => !h)} 
        style={{ 
          position: 'fixed', 
          top: 32, 
          right: 32, 
          zIndex: 100,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#cbd5e1',
          border: '2px solid #0a2233',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }} 
        title="Ver historial"
      >
        <svg width="24" height="24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </button>

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

      {/* Contenido principal */}
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
        />
      ) : (
        <PreguntasListaBloques
          preguntas={subgrupoMalvinas ? 
            subgrupoMalvinas.preguntas : 
            respuestas[grupoSeleccionado].temas.flatMap(t => t.preguntas)}
          onPreguntaSeleccionada={handlePreguntaSeleccionada}
        />
      )}
    </>
  );
}