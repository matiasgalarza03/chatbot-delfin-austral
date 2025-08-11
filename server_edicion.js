// Servidor para manejar ediciones de texto permanentes
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

// Endpoint para guardar ediciones
app.post('/api/guardar-edicion', async (req, res) => {
  try {
    const { pregunta, nuevaRespuesta, textosEditados, categoria, clave } = req.body;

    console.log('📝 Guardando edición permanente:', {
      pregunta,
      categoria,
      clave,
      nuevaRespuesta: nuevaRespuesta.substring(0, 100) + '...'
    });

    // Rutas de archivos
    const respuestasPath = path.join(process.cwd(), 'src/data/Respuestas.json');
    const sincronizacionPath = path.join(process.cwd(), 'src/data/SincronizacionAudio.json');

    // Leer archivo de respuestas
    const respuestasData = JSON.parse(fs.readFileSync(respuestasPath, 'utf8'));
    
    // Buscar y actualizar la pregunta en Respuestas.json
    let preguntaEncontrada = false;
    
    function buscarYActualizarPregunta(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(item => buscarYActualizarPregunta(item));
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.pregunta === pregunta) {
          obj.respuesta = nuevaRespuesta;
          preguntaEncontrada = true;
          console.log('✅ Pregunta encontrada y actualizada en Respuestas.json');
        }
        Object.values(obj).forEach(value => buscarYActualizarPregunta(value));
      }
    }

    buscarYActualizarPregunta(respuestasData);

    if (preguntaEncontrada) {
      // Guardar Respuestas.json actualizado
      fs.writeFileSync(respuestasPath, JSON.stringify(respuestasData, null, 2), 'utf8');
      console.log('💾 Respuestas.json actualizado');

      // Actualizar sincronización si es necesario
      if (categoria && clave && Object.keys(textosEditados).length > 0) {
        try {
          const sincronizacionData = JSON.parse(fs.readFileSync(sincronizacionPath, 'utf8'));
          
          if (sincronizacionData[categoria] && sincronizacionData[categoria][clave]) {
            // Actualizar textos en bloques de sincronización
            const bloques = sincronizacionData[categoria][clave].bloques;
            Object.keys(textosEditados).forEach(index => {
              const idx = parseInt(index);
              if (bloques[idx]) {
                bloques[idx].texto = textosEditados[index];
                console.log(`📝 Bloque ${idx} actualizado: ${textosEditados[index].substring(0, 50)}...`);
              }
            });

            fs.writeFileSync(sincronizacionPath, JSON.stringify(sincronizacionData, null, 2), 'utf8');
            console.log('💾 SincronizacionAudio.json actualizado');
          }
        } catch (syncError) {
          console.warn('⚠️ Error al actualizar sincronización:', syncError.message);
        }
      }

      res.status(200).json({ 
        success: true, 
        message: 'Cambios guardados permanentemente',
        archivosActualizados: ['Respuestas.json', 'SincronizacionAudio.json']
      });
    } else {
      res.status(404).json({ error: 'Pregunta no encontrada' });
    }

  } catch (error) {
    console.error('❌ Error al guardar edición:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// Endpoint para guardar ajustes de sincronización manual (G/H)
app.post('/api/guardar-sincronizacion', async (req, res) => {
  try {
    const { ajustes, timestamp } = req.body;

    console.log('🎵 Guardando ajustes de sincronización manual:', {
      totalAjustes: Object.keys(ajustes).length,
      timestamp
    });

    // Ruta del archivo de sincronización
    const sincronizacionPath = path.join(process.cwd(), 'src/data/SincronizacionAudio.json');
    
    // Leer archivo actual
    const sincronizacionData = JSON.parse(fs.readFileSync(sincronizacionPath, 'utf8'));
    
    // Aplicar ajustes manuales a la sincronización
    Object.keys(ajustes).forEach(clavePregunta => {
      const ajustesPregunta = ajustes[clavePregunta];
      
      // Buscar la pregunta en las categorías de sincronización
      Object.keys(sincronizacionData).forEach(categoria => {
        Object.keys(sincronizacionData[categoria]).forEach(clave => {
          const bloques = sincronizacionData[categoria][clave].bloques;
          
          // Aplicar ajustes a los bloques
          Object.keys(ajustesPregunta).forEach(bloqueIdx => {
            const idx = parseInt(bloqueIdx);
            const ajuste = ajustesPregunta[bloqueIdx];
            
            if (bloques[idx]) {
              // Aplicar ajuste a la duración
              const duracionOriginal = bloques[idx].duracion;
              const nuevaDuracion = Math.max(1000, duracionOriginal + ajuste);
              bloques[idx].duracion = nuevaDuracion;
              
              console.log(`🎵 Bloque ${idx} ajustado: ${duracionOriginal}ms → ${nuevaDuracion}ms (${ajuste > 0 ? '+' : ''}${ajuste}ms)`);
            }
          });
          
          // Recalcular duración total
          const duracionTotal = bloques.reduce((total, bloque) => total + bloque.duracion, 0);
          sincronizacionData[categoria][clave].duracionTotal = duracionTotal;
        });
      });
    });

    // Guardar archivo actualizado
    fs.writeFileSync(sincronizacionPath, JSON.stringify(sincronizacionData, null, 2), 'utf8');
    console.log('💾 SincronizacionAudio.json actualizado con ajustes manuales');

    res.status(200).json({ 
      success: true, 
      message: 'Ajustes de sincronización guardados permanentemente',
      ajustesAplicados: Object.keys(ajustes).length,
      archivo: 'SincronizacionAudio.json'
    });

  } catch (error) {
    console.error('❌ Error al guardar ajustes de sincronización:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de edición funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de edición ejecutándose en puerto ${PORT}`);
  console.log(`📝 Endpoint: http://localhost:${PORT}/api/guardar-edicion`);
});

export default app;