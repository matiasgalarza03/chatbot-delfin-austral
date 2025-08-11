import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const cameraControls = useRef();
  const initialPosition = { position: [0, 0.5, 2.1], target: [0, 0.1, 0] };

  useEffect(() => {
    if (cameraControls.current) {
      cameraControls.current.setLookAt(...initialPosition.position, ...initialPosition.target, true);
    }
  }, []);

  useEffect(() => {
    const controls = cameraControls.current;
    if (!controls) return;
    const handleMouseUp = () => {
      controls.setLookAt(...initialPosition.position, ...initialPosition.target, true);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <>
      <color attach="background" args={["#EFE9E9"]} />
      
      <CameraControls 
        ref={cameraControls}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        maxAzimuthAngle={Math.PI}
        minAzimuthAngle={-Math.PI}
        minDistance={2.1}
        maxDistance={2.1}
        enablePan={false}
        enableZoom={false}
        smoothTime={0.5}
      />
      
      <Environment preset="sunset" />
      
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-10, 10, 5]} 
        intensity={0.4}
      />
      
      <Suspense fallback={
        <Text color="black" position={[0, 0, 0]} fontSize={0.5} anchorX="center" anchorY="middle">
          Cargando modelo...
        </Text>
      }>
        <Avatar position={[0, -0.7, 0]} scale={1.25} />
      </Suspense>
      
      {/* <ContactShadows ... /> */}
    </>
  );
};
