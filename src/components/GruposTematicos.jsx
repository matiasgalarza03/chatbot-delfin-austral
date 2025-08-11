import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useColorModeValue } from '@chakra-ui/react';
// Importación condicional de useSound para evitar errores
let useSound;
let hoverSound, clickSound;

try {
  useSound = require('use-sound').default;
  // Intentar cargar los sonidos, pero no fallar si no existen
  try {
    hoverSound = require('../sounds/hover.mp3');
    clickSound = require('../sounds/click.mp3');
  } catch (e) {
    console.warn('No se encontraron los archivos de sonido. Los efectos de sonido estarán desactivados.');
  }
} catch (e) {
  console.warn('La biblioteca use-sound no está disponible. Los efectos de sonido estarán desactivados.');
  useSound = () => [() => {}]; // Función vacía como fallback
}

const gruposOrden = ['A', 'B', 'C', 'D'];

const nombresIconos = {
  A: 'Delfín Austral',
  B: 'E.E.S.N° 13',
  C: 'Museo Escolar',
  D: 'Malvinas',
};

const nombresCompletos = {
  A: 'Delfín Austral',
  B: 'Escuela Secundaria N° 3 Malvinas Argentinas',
  C: 'Museo Escolar',
  D: 'Malvinas',
};

export default function GruposTematicos({ onGrupoSeleccionado, respuestas }) {
  const [grupos, setGrupos] = useState([]);
  const [hoveredGrupo, setHoveredGrupo] = useState(null);
  // Usar efectos de sonido si están disponibles, de lo contrario usar funciones vacías
  const [playHover] = useSound && hoverSound ? 
    useSound(hoverSound, { volume: 0.5 }) : [() => {}];
  const [playClick] = useSound && clickSound ? 
    useSound(clickSound, { volume: 0.5 }) : [() => {}];
  const buttonRefs = useRef({});

  useEffect(() => {
    // Cargar los grupos en el orden deseado
    const gruposData = gruposOrden.map((key) => ({
      id: key,
      nombre: nombresIconos[key],
    }));
    setGrupos(gruposData);
  }, []);

  // Distribución circular proporcional
  const radio = 260; // distancia desde el centro
  const centroX = 0;
  const centroY = 0;
  const angulos = [270, 180, 0, 90]; // arriba, izquierda, derecha, abajo
  const posiciones = angulos.map((angulo) => {
    const rad = (angulo * Math.PI) / 180;
    return {
      top: `calc(50% + ${Math.sin(rad) * radio}px)` ,
      left: `calc(50% + ${Math.cos(rad) * radio}px)` ,
      transform: 'translate(-50%, -50%)',
    };
  });

  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.400', 'blue.200');
  const textColor = useColorModeValue('blue.900', 'white');
  const hoverBgColor = useColorModeValue('blue.100', 'blue.700');

  return (
    <Box className="grupos-tematicos-container">
      <motion.div 
        className="delfin-central"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      />
      <AnimatePresence>
        {respuestas && grupos.map((grupo, idx) => (
          <motion.button
            key={grupo.id}
            ref={el => buttonRefs.current[grupo.id] = el}
            className="icono-circular-grupo"
            style={{
              ...posiciones[idx],
              position: 'absolute',
              zIndex: hoveredGrupo === grupo.id ? 10 : 3,
              backgroundColor: bgColor,
              borderColor: borderColor,
              color: textColor,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              scale: hoveredGrupo === grupo.id ? 1.2 : 1,
              boxShadow: hoveredGrupo === grupo.id 
                ? '0 0 25px rgba(2, 132, 199, 0.5)' 
                : '0 4px 16px rgba(0,0,0,0.12)',
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300,
              damping: 20,
              delay: idx * 0.1
            }}
            whileHover={{ 
              scale: 1.2,
              boxShadow: '0 0 25px rgba(2, 132, 199, 0.5)',
              backgroundColor: hoverBgColor,
            }}
            whileTap={{ 
              scale: 0.95,
              boxShadow: '0 0 15px rgba(2, 132, 199, 0.3)'
            }}
            onClick={() => {
              playClick();
              onGrupoSeleccionado(grupo.id);
            }}
            onMouseEnter={() => {
              playHover();
              setHoveredGrupo(grupo.id);
            }}
            onMouseLeave={() => setHoveredGrupo(null)}
            aria-label={`Seleccionar ${grupo.nombre}`}
          >
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {grupo.nombre}
            </motion.span>
          </motion.button>
        ))}
      </AnimatePresence>
    </Box>
  );
}

function TemasMalvinas({ temas, onTemaSeleccionado, onVolver }) {
  // Distribución circular proporcional igual que los iconos principales
  const radio = 260;
  const angulos = [270, 180, 0, 90];
  const posiciones = angulos.map((angulo) => {
    const rad = (angulo * Math.PI) / 180;
    return {
      top: `calc(50% + ${Math.sin(rad) * radio}px)` ,
      left: `calc(50% + ${Math.cos(rad) * radio}px)` ,
      transform: 'translate(-50%, -50%)',
    };
  });
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
          <span>{tema.nombre}</span>
        </button>
      ))}
    </div>
  );
} 