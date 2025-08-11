// Test de conexión frontend-backend
console.log('🔗 === TEST DE CONEXIÓN FRONTEND-BACKEND ===');

async function testConnection() {
  const urls = [
    '/health',  // Proxy de Vite
    'http://localhost:5003/health',
    'http://127.0.0.1:5003/health'
  ];

  console.log('🧪 Probando conexiones...');

  for (const url of urls) {
    try {
      console.log(`\n🔍 Probando: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ÉXITO en ${url}:`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Objetos: ${data.objetos_disponibles}`);
        console.log(`   Mensaje: ${data.message}`);
        
        // Probar búsqueda
        console.log(`\n🔍 Probando búsqueda en ${url.replace('/health', '/api/buscar-inventario')}...`);
        const searchUrl = url.replace('/health', '/api/buscar-inventario');
        
        const searchResponse = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({ numero: 1 })
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log(`✅ BÚSQUEDA EXITOSA:`);
          console.log(`   Objeto: ${searchData.objeto.objeto_de_museo}`);
          console.log(`   Procedencia: ${searchData.objeto.procedencia}`);
        } else {
          console.log(`❌ Error en búsqueda: ${searchResponse.status}`);
        }
        
        return true;
      } else {
        console.log(`❌ Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
  }
  
  return false;
}

// Ejecutar test si estamos en el navegador
if (typeof window !== 'undefined') {
  testConnection().then(success => {
    if (success) {
      console.log('\n🎯 === CONEXIÓN EXITOSA ===');
      console.log('✅ Frontend y Backend conectados correctamente');
      console.log('✅ El buscador debería funcionar ahora');
    } else {
      console.log('\n❌ === CONEXIÓN FALLIDA ===');
      console.log('❌ No se pudo conectar al backend');
      console.log('💡 Asegúrate de que el servidor Python esté ejecutándose');
    }
  });
} else {
  console.log('📝 Script listo para ejecutar en el navegador');
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined') {
  module.exports = { testConnection };
}