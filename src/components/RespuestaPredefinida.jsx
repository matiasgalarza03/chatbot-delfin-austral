import React, { useEffect, useRef, useState, useMemo } from 'react';
import VisualizadorMultimedia from './VisualizadorMultimedia';

function splitSentences(text) {
  // Divide en oraciones usando punto, exclamación, interrogación, o salto de línea
  if (!text) return [];
  // Normaliza saltos de línea y espacios
  const normalized = text.replace(/([^.?!])\n/g, '$1. ').replace(/\s+/g, ' ');
  // Divide por puntuación fuerte
  const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) || [text];
  return sentences;
}

function buildBlocks(sentences, blockSize = 2, maxChars = 220) {
  // Agrupa en bloques de hasta blockSize oraciones y máximo maxChars caracteres
  const blocks = [];
  let temp = '';
  let count = 0;
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (count < blockSize && (temp.length + sentence.length <= maxChars)) {
      temp += (temp ? ' ' : '') + sentence;
      count++;
    } else {
      if (temp) blocks.push(temp);
      temp = sentence;
      count = 1;
    }
  }
  if (temp) blocks.push(temp);
  return blocks;
}

export default function RespuestaPredefinida({ pregunta, onVolver, onRespuestaCompleta, onVisualizadorAbierto }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mostrarVisualizador, setMostrarVisualizador] = useState(false);
  const sentences = useMemo(() => splitSentences(pregunta.respuesta), [pregunta.respuesta]);
  const blockSize = 2;
  const maxChars = 220;
  const blocks = useMemo(() => buildBlocks(sentences, blockSize, maxChars), [sentences, blockSize, maxChars]);
  const currentBlock = blocks[currentIdx] || '';
  const advanceTimeout = useRef();

  // Reiniciar índice si cambia la cantidad de bloques o la pregunta
  useEffect(() => {
    setCurrentIdx(0);
    if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
  }, [pregunta, blocks.length]);

  // Avance automático de bloques
  useEffect(() => {
    if (!blocks.length) return;
    advanceTimeout.current && clearTimeout(advanceTimeout.current);
    if (currentIdx >= blocks.length - 1) {
      // Último bloque, llamar a onRespuestaCompleta si existe
      if (onRespuestaCompleta) {
        advanceTimeout.current = setTimeout(() => {
          onRespuestaCompleta();
        }, 5000); // Pausa final de 5 segundos
      }
      return;
    }
    advanceTimeout.current = setTimeout(() => {
      setCurrentIdx(idx => idx + 1);
    }, 6000); // Todos los bloques: 6 segundos
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, [currentIdx, blocks.length, onRespuestaCompleta]);

  useEffect(() => {
    if (onVisualizadorAbierto) onVisualizadorAbierto(mostrarVisualizador);
  }, [mostrarVisualizador, onVisualizadorAbierto]);

  return (
    <>
      <button 
        onClick={onVolver} 
        style={{ 
          position: 'fixed', 
          top: 20, 
          left: 20, 
          fontSize: 22, 
          zIndex: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer' 
        }}
      >
        ⬅️ Volver
      </button>

      {/* Contenedor principal de la respuesta */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '2rem',
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* Respuesta animada, solo dos oraciones a la vez, tipografía grande */}
        <div style={{
          fontSize: '1.65rem',
          lineHeight: 1.6,
          color: '#1a365d',
          textAlign: 'center',
          maxWidth: '800px',
          minHeight: '4rem',
          marginBottom: mostrarVisualizador ? '2rem' : '1rem',
          transition: 'font-size 0.2s'
        }}>
          {currentBlock}
        </div>

        {/* Visualizador multimedia si hay archivo */}
        {mostrarVisualizador && (
          <VisualizadorMultimedia 
            pregunta={pregunta.pregunta}
            archivo={pregunta.archivo}
            tipo={pregunta.tipo}
            info={pregunta.info}
            onClose={() => {
              setMostrarVisualizador(false);
              if (onVisualizadorAbierto) onVisualizadorAbierto(false);
            }}
          />
        )}
      </div>
    </>
  );
}