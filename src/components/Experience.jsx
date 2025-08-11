import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

const Experience = () => {
  const cameraControls = useRef();
  // Ajustar la cámara para enmarcar mejor el delfín más grande
  const initialPosition = { position: [0, 0.3, 2.5], target: [0, 0, 0] };

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
    <group>
      <CameraControls 
        ref={cameraControls}
        maxPolarAngle={Math.PI * 0.5}
        minPolarAngle={0}
        maxAzimuthAngle={Math.PI * 0.5}
        minAzimuthAngle={-Math.PI * 0.5}
        minDistance={2}
        maxDistance={4}
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />
      
      <Environment preset="sunset" background={false} />
      
      {/* Luces suavizadas */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight 
        position={[2, 3, 4]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-2, 2, -3]} 
        intensity={0.3} 
        color="#ffffff"
      />
      
      <Suspense fallback={null}>
        <group position={[0, -0.7, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
          <Avatar />
        </group>
      </Suspense>
    </group>
   );
};

export { Experience };
export default Experience;
