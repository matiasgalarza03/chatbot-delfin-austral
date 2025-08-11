import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import ChatbotEscenario from './components/ChatbotEscenario';

export default function App() {
  const [visualizadorAbierto, setVisualizadorAbierto] = useState(false);

  // Recibir el estado desde el escenario
  const handleVisualizadorAbierto = (abierto) => {
    setVisualizadorAbierto(abierto);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#f7f3f3', position: 'relative', overflow: 'hidden' }}>
      {/* Modelo 3D del delfín siempre en el centro, pero se mueve a la izquierda si el visualizador está abierto */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'transform 0.5s cubic-bezier(.4,2,.6,1)',
          transform: visualizadorAbierto ? 'translateX(-22vw)' : 'none',
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
      >
        <Experience />
      </Canvas>
      {/* Interfaz de interacción sobre el modelo 3D */}
      <div style={{ position: 'relative', zIndex: 2, width: '100vw', height: '100vh' }}>
        <ChatbotEscenario onVisualizadorAbierto={handleVisualizadorAbierto} />
      </div>
    </div>
  );
}
