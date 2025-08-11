/**
 * Utilidades para manejar rutas de recursos
 * Centraliza la gestión de rutas para diferentes entornos (desarrollo/producción)
 */

// Ruta base para recursos estáticos
const getBasePath = () => {
  // En producción, las rutas deben ser relativas a la raíz del sitio
  // En desarrollo, pueden ser relativas a la raíz del servidor de desarrollo
  return process.env.NODE_ENV === 'production' ? '' : '';
};

// Ruta para el modelo 3D
export const getModelPath = () => {
  // Codificamos el nombre del archivo para manejar espacios
  const modelName = encodeURIComponent("1.Playful-Dolphin-COMPLETO-SHAPE KEYS.glb");
  return `${getBasePath()}/models/${modelName}`;
};

// Ruta para archivos JSON
export const getDataPath = (filename) => {
  return `${getBasePath()}/data/${filename}`;
};

// Ruta para archivos multimedia
export const getMediaPath = (filename) => {
  return `${getBasePath()}/media/${filename}`;
};
