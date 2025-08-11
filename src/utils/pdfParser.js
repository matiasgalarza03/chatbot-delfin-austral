// Importación de PDF.js con configuración para Vite
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del worker usando CDN para máxima compatibilidad
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Función para extraer el texto de un archivo PDF
const extractTextFromPdf = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async () => {
      try {
        const typedArray = new Uint8Array(fileReader.result);
        
        // Cargar el documento PDF con configuración optimizada para extracción de texto
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          // Configuración para mejorar la extracción de texto
          disableFontFace: true,
          useSystemFonts: false,
          useWorkerFetch: false,
          isEvalSupported: false
        });
        
        // Configurar el manejador de progreso si está disponible
        if (onProgress) {
          loadingTask.onProgress = ({ loaded, total }) => {
            const progress = loaded / total;
            onProgress(progress);
          };
        }
        
        const pdfDocument = await loadingTask.promise;
        let fullText = '';
        
        // Extraer texto de cada página
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
          
          // Actualizar el progreso por página
          if (onProgress) {
            onProgress(i / pdfDocument.numPages);
          }
        }
        
        resolve(fullText);
      } catch (error) {
        console.error('Error al procesar el PDF:', error);
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      reject(error);
    };
    
    // Leer el archivo como ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  });
};

// Función para analizar el texto extraído del PDF
export const parsePdf = async (file, onProgress) => {
  try {
    console.log('Iniciando análisis del PDF:', file.name);
    
    // Extraer el texto del PDF
    const text = await extractTextFromPdf(file, onProgress);
    
    // Aquí procesamos el texto extraído para convertirlo en un formato estructurado
    // Este es un ejemplo básico que deberás ajustar según el formato real de tu PDF
    
    // Dividir el texto en líneas
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Objeto para almacenar los ítems del inventario
    const inventoryData = {};
    
    // Contador para generar IDs si no están presentes
    let currentId = 1;
    
    // Procesar cada línea (este es un ejemplo básico, ajusta según el formato real)
    for (const line of lines) {
      // Buscar patrones que coincidan con los datos de los ítems
      // Este es solo un ejemplo, ajusta según el formato real de tu PDF
      const idMatch = line.match(/^(\d+)\.?\s+/);
      
      if (idMatch) {
        const id = idMatch[1].trim();
        const itemText = line.replace(idMatch[0], '').trim();
        
        // Aquí puedes agregar más lógica para extraer nombre, origen, etc.
        // Este es solo un ejemplo básico
        inventoryData[id] = {
          id,
          name: itemText.split('.')[0] || `Artículo ${id}`,
          origin: 'No especificada',
          description: itemText || 'Descripción no disponible',
          imageUrl: '' // Las imágenes deberán manejarse por separado
        };
        
        currentId++;
      }
    }
    
    // Si no se encontraron ítems con el patrón anterior, crear algunos ítems de ejemplo
    if (Object.keys(inventoryData).length === 0) {
      console.warn('No se encontraron ítems en el PDF. Usando datos de ejemplo.');
      
      // Datos de ejemplo en caso de que el análisis falle
      inventoryData["001"] = {
        id: "001",
        name: "Reloj de sol",
        origin: "Europa, siglo XVIII",
        description: "Reloj de sol portátil fabricado en latón, utilizado para medir el tiempo mediante la posición del sol. Incluye una brújula integrada para su correcta orientación.",
        imageUrl: "/reloj-sol.jpg"
      };
      
      inventoryData["002"] = {
        id: "002",
        name: "Microscopio antiguo",
        origin: "Alemania, 1890",
        description: "Microscopio compuesto de latón con base de madera. Incluye varios objetivos intercambiables y un espejo para iluminar las muestras desde abajo.",
        imageUrl: "/microscopio-antiguo.jpg"
      };
    }
    
    console.log('Análisis del PDF completado. Ítems encontrados:', Object.keys(inventoryData).length);
    return inventoryData;
    
  } catch (error) {
    console.error('Error al analizar el PDF:', error);
    
    // En caso de error, devolver datos de ejemplo
    console.warn('Usando datos de ejemplo debido a un error en el análisis del PDF');
    
    return {
      "001": {
        id: "001",
        name: "Ejemplo de Artículo",
        origin: "Procedencia del artículo",
        description: "Descripción detallada del artículo y su importancia histórica.",
        imageUrl: ""
      }
    };
  }
};

// Función para buscar un ítem por su número de inventario
export const findInventoryItem = (inventoryData, itemId) => {
  try {
    // Limpiar el ID (eliminar espacios y convertir a minúsculas)
    const cleanId = String(itemId).trim().toLowerCase();
    
    // Buscar el ítem por ID exacto
    if (inventoryData[cleanId]) {
      return inventoryData[cleanId];
    }
    
    // Si no se encuentra por ID exacto, buscar coincidencias parciales
    const matchingItems = Object.values(inventoryData).filter(item => 
      item.id.toLowerCase().includes(cleanId) ||
      (item.name && item.name.toLowerCase().includes(cleanId))
    );
    
    // Devolver el primer ítem que coincida, o null si no hay coincidencias
    return matchingItems.length > 0 ? matchingItems[0] : null;
    
  } catch (error) {
    console.error('Error al buscar el ítem en el inventario:', error);
    return null;
  }
};
