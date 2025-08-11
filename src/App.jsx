import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import ChatbotEscenario from "./components/ChatbotEscenario";
import Experience from "./components/Experience";
import InventoryModalPython from "./components/InventoryModalPython";
import { useGLTF } from "@react-three/drei";
import { useChat } from "./hooks/useChat";

// Configuración de animaciones
const ANIMATIONS = {
  IDLE: "Swim",
  BORED: "Bored",
  HAPPY_IDLE: "Happy_Idle",
  HAPPY_TALK: "Happy_Talk",
  SERIOUS_IDLE: "Serious_Idle",
  SERIOUS_TALK: "Serious_Talk",
};

// Grupos que usarán animaciones HAPPY
const HAPPY_ANIMATION_GROUPS = [
  "escuela secundaria",
  "número tres Malvinas argentinas",
  "museo escolar",
];

// Grupos que usarán animaciones SERIOUS
const SERIOUS_ANIMATION_GROUPS = ["Malvinas"];

// Componente de carga
const Loader = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f7f3f3",
      zIndex: 10,
    }}
  >
    <div>Cargando modelo 3D...</div>
  </div>
);

export default function App() {
  // Precargar el modelo 3D dentro del componente
  useGLTF.preload("/models/1.Playful-Dolphin-COMPLETO-SHAPE KEYS.glb");

  const [visualizadorAbierto, setVisualizadorAbierto] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("Swim");
  const [isIdle, setIsIdle] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const inactivityTimer = useRef(null);
  const { chat } = useChat();
  
  // 🎯 Estado global para preguntas visitadas
  const [preguntasVisitadas, setPreguntasVisitadas] = useState(new Set());

  // Determinar la animación basada en el grupo temático
  const getAnimationForGroup = (grupo, isTalking) => {
    // Si el grupo está en SERIOUS_ANIMATION_GROUPS, usar animaciones SERIOUS
    if (SERIOUS_ANIMATION_GROUPS.includes(grupo)) {
      return isTalking ? ANIMATIONS.SERIOUS_TALK : ANIMATIONS.SERIOUS_IDLE;
    }
    // Si el grupo está en HAPPY_ANIMATION_GROUPS, usar animaciones HAPPY
    if (HAPPY_ANIMATION_GROUPS.includes(grupo)) {
      return isTalking ? ANIMATIONS.HAPPY_TALK : ANIMATIONS.HAPPY_IDLE;
    }
    // Por defecto, usar animación de inactivo
    return isIdle ? ANIMATIONS.BORED : ANIMATIONS.IDLE;
  };

  // Efecto para manejar el cambio de animación basado en el estado del chat y el grupo
  useEffect(() => {
    if (!chat) return;

    // Obtener el grupo actual o usar cadena vacía si no hay grupo
    const currentGroup = chat.currentGroup || "";

    // Determinar la animación basada en el grupo y si está hablando
    const newAnimation = getAnimationForGroup(currentGroup, chat.isSpeaking);

    // Solo actualizar si la animación es diferente a la actual
    if (newAnimation !== currentAnimation) {
      setCurrentAnimation(newAnimation);
    }
  }, [chat?.isSpeaking, chat?.currentGroup, isIdle]);

  // Efecto para manejar la inactividad
  useEffect(() => {
    const handleUserActivity = () => {
      // Reiniciar el temporizador de inactividad
      clearTimeout(inactivityTimer.current);

      // Si estaba inactivo, volver a la animación por defecto
      if (isIdle) {
        setIsIdle(false);
        // Obtener la animación basada en el grupo actual
        const currentGroup = chat?.currentGroup || "";
        setCurrentAnimation(getAnimationForGroup(currentGroup, false));
      }

      // Configurar nuevo temporizador (30 segundos de inactividad)
      inactivityTimer.current = setTimeout(() => {
        setIsIdle(true);
        setCurrentAnimation("Bored");
      }, 30000);
    };

    // Iniciar el temporizador
    handleUserActivity();

    // Agregar event listeners para detectar actividad del usuario
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    // Limpiar al desmontar
    return () => {
      clearTimeout(inactivityTimer.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [isIdle]);

  // Recibir el estado desde el escenario
  const handleVisualizadorAbierto = (abierto) => {
    setVisualizadorAbierto(abierto);
    // Si el usuario interactúa, reiniciar el estado de inactividad
    if (isIdle) {
      setIsIdle(false);
      setCurrentAnimation(ANIMATIONS.IDLE);
    }
  };

  // Manejar interacción del usuario
  const handleUserInteraction = () => {
    if (isIdle) {
      setIsIdle(false);
      setCurrentAnimation(ANIMATIONS.IDLE);
    }
  };
  
  // 🎯 Función para resetear preguntas visitadas (para botón de reinicio)
  const handleResetPreguntasVisitadas = () => {
    console.log('🔄 App.jsx: Reseteando preguntas visitadas desde botón de reinicio');
    setPreguntasVisitadas(new Set());
  };
  
  // 🎯 Función completa de reinicio (incluye preguntas visitadas)
  const handleReinicioCompleto = () => {
    console.log('🔄 App.jsx: Reinicio completo desde botón principal');
    handleResetPreguntasVisitadas();
    // Aquí se pueden agregar otros resets si es necesario
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Canvas 3D fijo en el fondo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
          transform: visualizadorAbierto ? "translateX(-22vw)" : "none",
          transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
        }}
      >
        <Canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0)",
            display: "block",
          }}
          camera={{
            position: [0, 0.5, 3],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          frameloop="always"
          dpr={Math.min(window.devicePixelRatio, 2)}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <Experience animation={currentAnimation} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interfaz de interacción sobre el modelo 3D */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{ pointerEvents: "auto", maxWidth: "1200px", width: "100%" }}
        >
          <ChatbotEscenario
            onVisualizadorAbierto={handleVisualizadorAbierto}
            onUserInteraction={handleUserInteraction}
            preguntasVisitadas={preguntasVisitadas}
            setPreguntasVisitadas={setPreguntasVisitadas}
            onResetPreguntasVisitadas={handleResetPreguntasVisitadas}
            onShowInventoryModal={() => setShowInventoryModal(true)}
          />
        </div>
      </div>
      
      {/* Modal del Inventario Python */}
      <InventoryModalPython 
        isOpen={showInventoryModal} 
        onClose={() => setShowInventoryModal(false)} 
      />
    </div>
  );
}
