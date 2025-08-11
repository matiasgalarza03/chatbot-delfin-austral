import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useAnimation } from "../contexts/AnimationContext";
import { useChat } from "../hooks/useChat";

// Nombres de animaciones esperados
const ANIMATION_NAMES = {
  SWIM: "Swim",
  BORED_IDLE: "Bored", // Cambiado de 'Bored_Idle' a 'Bored'
  HAPPY_IDLE: "Happy_Idle",
  HAPPY_TALK: "Happy_Talk",
  SERIOUS_IDLE: "Serious_Idle",
  SERIOUS_TALK: "Serious_Talk",
};

// Animación predeterminada
const DEFAULT_ANIMATION = ANIMATION_NAMES.HAPPY_IDLE; // Usando Happy_Idle temporalmente

export function Avatar(props) {
  const group = useRef();
  // Cargar el modelo con animaciones
  const { scene, animations: modelAnimations } = useGLTF(
    "/models/1.Playful-Dolphin-COMPLETO-SHAPE KEYS.glb",
  );

  // Depuración: Mostrar animaciones disponibles
  useEffect(() => {
    console.log("=== ANIMACIONES DISPONIBLES ===");
    console.log(
      "Nombres exactos de animaciones en el modelo:",
      modelAnimations.map((anim) => `"${anim.name}"`).join(", "),
    );

    console.log("=== ANIMACIONES ESPERADAS ===");
    console.log(
      "Nombres de animaciones que busca la aplicación:",
      Object.values(ANIMATION_NAMES)
        .map((name) => `"${name}"`)
        .join(", "),
    );

    // Verificar qué animaciones esperadas existen
    const availableAnimations = modelAnimations.map((anim) => anim.name);
    const missingAnimations = Object.values(ANIMATION_NAMES).filter(
      (name) => !availableAnimations.includes(name),
    );

    if (missingAnimations.length > 0) {
      console.warn(
        "Faltan las siguientes animaciones en el modelo:",
        missingAnimations,
      );
      console.warn("Usando animaciones disponibles como respaldo.");
    } else {
      console.log(
        "¡Todas las animaciones requeridas están presentes en el modelo!",
      );
    }
  }, [modelAnimations]);

  // Ajustes iniciales de la escena para mejor visualización
  scene.scale.set(1.2, 1.2, 1.2);
  scene.position.set(0, 0.1, 0);
  scene.rotation.set(0, 0.2, 0);

  const { message, onMessagePlayed, chat } = useChat();
  const { animation: externalAnimation } = useAnimation();
  const { actions, mixer } = useAnimations(modelAnimations, group);

  // Asegurar que TODAS las acciones se repitan en bucle infinito
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.paused = false;
    });
  }, [actions]);

  // Estado para la animación actual
  const [animation, setAnimation] = useState(() => {
    // Intentar encontrar la animación predeterminada, si no existe usar la primera disponible
    const defaultAnim =
      modelAnimations.find((a) => a.name === DEFAULT_ANIMATION) ||
      modelAnimations[0];
    return defaultAnim?.name || "";
  });

  const animationSpeed = 1.0; // Velocidad normal (1.0)
  const crossFadeDuration = 0.7; // Aumentado para transición más suave
  const loopCrossFadeDuration = 1.0; // Aumentado para transición más suave en el bucle
  const loopOffset = 0.15; // Pequeño offset para evitar el corte exacto al final
  const startFadeOutAt = 0.9; // Comenzar el fade out al 90% de la animación

  useEffect(() => {
    if (!animation || !actions[animation]) {
      if (animation) {
        console.error(`La animación "${animation}" no existe en el modelo`);
      }
      return;
    }

    console.log("Cambiando a animación:", animation);

    // Obtener la acción de la animación actual
    const action = actions[animation];

    // Configurar la acción para que se repita infinitamente con mezcla suave
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = true; // Mantener la pose final hasta la siguiente animación

    // Configurar la velocidad de la animación
    action.timeScale = animationSpeed;

    // Configurar la mezcla (blending) para una transición suave
    action.enabled = true;
    action.reset().setEffectiveWeight(1).fadeIn(crossFadeDuration);

    // Reproducir la animación desde el inicio
    action.time = 0;
    action.play();

    // Manejar el evento de actualización para controlar manualmente el bucle
    const onUpdate = () => {
      if (!action.isRunning()) return;

      // Obtener el progreso de la animación (0 a 1)
      const progress = action.time / (action.getClip().duration || 1);

      // Iniciar el fade out cerca del final para una transición suave
      if (progress > startFadeOutAt) {
        const fadeProgress = (progress - startFadeOutAt) / (1 - startFadeOutAt);
        action.setEffectiveTimeScale(animationSpeed * (1 - fadeProgress * 0.5));

        // Si estamos muy cerca del final, reiniciar suavemente
        if (progress > 0.98) {
          action.time = 0;
          action.setEffectiveTimeScale(animationSpeed);
        }
      }
    };

    // Agregar el manejador de actualización
    mixer.addEventListener("update", onUpdate);

    console.log("Animación actual:", animation, action);

    // Limpieza al desmontar o cambiar de animación
    return () => {
      mixer.removeEventListener("update", onUpdate);

      // Suavizar la transición al cambiar de animación
      if (action.isRunning()) {
        action.fadeOut(crossFadeDuration);
      }
    };
  }, [animation, actions, mixer?.stats.actions.inUse, animationSpeed]);

  // Escuchar cambios de AnimationContext
  useEffect(() => {
    if (externalAnimation && externalAnimation !== animation) {
      setAnimation(externalAnimation);
    }
  }, [externalAnimation]);

  // Efecto para manejar los mensajes de chat
  useEffect(() => {
    if (!message) {
      // Si no hay mensaje, usar la animación predeterminada (Bored_Idle)
      setAnimation(DEFAULT_ANIMATION);
      return;
    }

    // Usar la animación del mensaje si está definida, de lo contrario usar la predeterminada
    const newAnimation = message.animation || ANIMATION_NAMES.SWIM;
    setAnimation(newAnimation);

    // 🚫 AUDIO COMPLETAMENTE DESHABILITADO - manejado por audioManagerFinal
    if (message.audio) {
      console.log('🚫 Avatar audio COMPLETAMENTE DESHABILITADO');
      // Simular que el audio terminó inmediatamente
      if (onMessagePlayed) {
        setTimeout(onMessagePlayed, 100);
      }
    }
  }, [message]);

  useFrame(() => {
    if (group.current) {
      group.current.position.set(0.0, -0.41, 0.0);
      group.current.rotation.set(-0.23, -0.96, -0.15);
      group.current.scale.set(1.45, 1.45, 1.45);
    }
  });

  return (
    <group {...props} ref={group}>
      <primitive object={scene} />
    </group>
  );
}

// Precargar el modelo con animaciones
useGLTF.preload("/models/1.Playful-Dolphin-COMPLETO-SHAPE KEYS.glb");
