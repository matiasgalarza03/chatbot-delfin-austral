import React, { useRef, useState } from 'react';

export default function VisualizadorMultimedia({ archivo, tipo, info, onClose }) {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const contenedorRef = useRef(null);

  const handlePantallaCompleta = () => {
    if (contenedorRef.current) {
      if (contenedorRef.current.requestFullscreen) {
        contenedorRef.current.requestFullscreen();
      } else if (contenedorRef.current.webkitRequestFullscreen) {
        contenedorRef.current.webkitRequestFullscreen();
      } else if (contenedorRef.current.msRequestFullscreen) {
        contenedorRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div ref={contenedorRef} style={{
      position: 'relative',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
      padding: 16,
      minWidth: 340,
      maxWidth: 520,
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>✖️</button>
      {tipo === 'imagen' && (
        <img src={archivo} alt="Imagen relacionada" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12 }} />
      )}
      {tipo === 'video' && (
        <video src={archivo} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12, background: '#000' }} />
      )}
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <button onClick={() => setMostrarInfo(v => !v)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #0288d1', background: '#e0f2fe', color: '#0288d1', fontWeight: 600, cursor: 'pointer' }}>
          {mostrarInfo ? 'Ocultar info' : 'Ver más info'}
        </button>
        <button onClick={handlePantallaCompleta} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #0288d1', background: '#e0f2fe', color: '#0288d1', fontWeight: 600, cursor: 'pointer' }}>
          Pantalla completa
        </button>
      </div>
      {mostrarInfo && (
        <div style={{ marginTop: 16, background: '#f1f5f9', borderRadius: 8, padding: 12, color: '#222', fontSize: '1em', minWidth: 220 }}>
          {info || 'Aquí irá la información de contexto sobre la imagen o video.'}
        </div>
      )}
    </div>
  );
} 