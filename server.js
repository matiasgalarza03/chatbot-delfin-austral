import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para guardar ediciones (del server_edicion.js)
app.post('/api/guardar-edicion', async (req, res) => {
  try {
    const { pregunta, nuevaRespuesta, textosEditados, categoria, clave } = req.body;

    console.log('📝 Guardando edición permanente:', {
      pregunta,
      categoria,
      clave,
      nuevaRespuesta: nuevaRespuesta?.substring(0, 100) + '...'
    });

    // Rutas de archivos
    const respuestasPath = path.join(__dirname, 'src/data/Respuestas.json');
    const sincronizacionPath = path.join(__dirname, 'src/data/SincronizacionAudio.json');

    // Verificar si los archivos existen
    if (!fs.existsSync(respuestasPath)) {
      return res.status(404).json({ error: 'Archivo de respuestas no encontrado' });
    }

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

      res.status(200).json({ 
        success: true, 
        message: 'Cambios guardados permanentemente',
        archivosActualizados: ['Respuestas.json']
      });
    } else {
      res.status(404).json({ error: 'Pregunta no encontrada' });
    }

  } catch (error) {
    console.error('❌ Error al guardar edición:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// Endpoint para servir datos JSON
app.get('/api/respuestas', (req, res) => {
  try {
    const respuestasPath = path.join(__dirname, 'src/data/Respuestas.json');
    if (fs.existsSync(respuestasPath)) {
      const data = JSON.parse(fs.readFileSync(respuestasPath, 'utf8'));
      res.json(data);
    } else {
      res.status(404).json({ error: 'Archivo de respuestas no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer respuestas', details: error.message });
  }
});

// Endpoint para servir preguntas
app.get('/api/preguntas', (req, res) => {
  try {
    const preguntasPath = path.join(__dirname, 'src/data/preguntas.json');
    if (fs.existsSync(preguntasPath)) {
      const data = JSON.parse(fs.readFileSync(preguntasPath, 'utf8'));
      res.json(data);
    } else {
      res.status(404).json({ error: 'Archivo de preguntas no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer preguntas', details: error.message });
  }
});

// Catch-all handler: enviar de vuelta React app para cualquier ruta no API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en: http://localhost:${PORT}`);
  console.log(`📋 Endpoints API disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/guardar-edicion`);
  console.log(`   - GET  /api/respuestas`);
  console.log(`   - GET  /api/preguntas`);
});

export default app;