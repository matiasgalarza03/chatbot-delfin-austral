// Script para verificar las animaciones en el archivo GLB
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const loader = new GLTFLoader();

// Cargar el modelo
export const checkAnimations = () => {
  loader.load(
    '/models/1.Playful-Dolphin-COMPLETO.glb',
    (gltf) => {
      console.log('Modelo cargado correctamente');
      
      // Verificar si hay animaciones
      if (gltf.animations && gltf.animations.length > 0) {
        console.log('Animaciones encontradas:', gltf.animations.length);
        
        // Listar nombres de animaciones
        console.log('Nombres de animaciones disponibles:');
        gltf.animations.forEach((clip, i) => {
          console.log(`${i + 1}. ${clip.name}`);
        });
      } else {
        console.log('No se encontraron animaciones en el archivo GLB');
      }
    },
    undefined,
    (error) => {
      console.error('Error al cargar el modelo:', error);
    }
  );
};

// Ejecutar la verificación
checkAnimations();
