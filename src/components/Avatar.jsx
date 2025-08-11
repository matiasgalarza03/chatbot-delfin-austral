import { Text, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

export function Avatar(props) {
  const group = useRef();
  try {
    const { scene, animations: modelAnimations } = useGLTF(
      "/models/1.Playful-Dolphin-COMPLETO.glb"
    );

    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);

    const { message, onMessagePlayed, chat } = useChat();
    const { actions, mixer } = useAnimations(modelAnimations, group);
    const [animation, setAnimation] = useState(
      modelAnimations.find((a) => a.name === "Swim") ? "Swim" : modelAnimations[0]?.name
    );

    useEffect(() => {
      if (animation && actions[animation]) {
        actions[animation]
          .reset()
          .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
          .play();
        return () => actions[animation].fadeOut(0.5);
      }
    }, [animation, actions, mixer?.stats.actions.inUse]);

    useEffect(() => {
      if (!message) {
        setAnimation("Swim");
        return;
      }
      setAnimation(message.animation);
      const audio = new Audio("data:audio/mp3;base64," + message.audio);
      audio.play();
      audio.onended = onMessagePlayed;
    }, [message]);

    // Fijar la posición y escala exactas
    const scale = 2.10;
    const position = [0, -0.7, 0];
    const rotation = [-0.2, 0, 0];

    useFrame(() => {
      if (group.current) {
        group.current.position.set(...position);
        group.current.scale.set(scale, scale, scale);
        group.current.rotation.set(...rotation);
      }
    });

    return (
      <group 
        {...props} 
        ref={group}
      >
        <primitive object={scene} />
      </group>
    );
  } catch (error) {
    console.error("Error loading model:", error);
    return (
      <Text
        color="red"
        position={[0, 0, 0]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        Error loading model: {error.message}
      </Text>
    );
  }
}

useGLTF.preload("/models/1.Playful-Dolphin-COMPLETO.glb");
