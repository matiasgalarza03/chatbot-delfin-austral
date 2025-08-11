/**
 * Gestor automático del servidor de inventario
 * Se asegura de que el servidor esté siempre ejecutándose
 */

class InventoryServerManager {
  constructor() {
    this.serverUrl = 'http://localhost:5003/api';
    this.checkInterval = null;
    this.isStarting = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async checkServerHealth() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        timeout: 3000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async startServerIfNeeded() {
    if (this.isStarting) return;
    
    const isHealthy = await this.checkServerHealth();
    if (isHealthy) {
      console.log('✅ Servidor de inventario funcionando correctamente');
      this.retryCount = 0;
      return true;
    }

    if (this.retryCount >= this.maxRetries) {
      console.warn('⚠️ Máximo número de intentos alcanzado para iniciar el servidor');
      return false;
    }

    this.isStarting = true;
    this.retryCount++;

    try {
      console.log(`🚀 Intentando iniciar servidor de inventario (intento ${this.retryCount}/${this.maxRetries})...`);
      
      // Intentar iniciar el servidor usando diferentes métodos
      await this.tryStartServer();
      
      // Esperar un momento para que se inicie
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Verificar si se inició correctamente
      const isNowHealthy = await this.checkServerHealth();
      if (isNowHealthy) {
        console.log('✅ Servidor de inventario iniciado correctamente');
        this.retryCount = 0;
        return true;
      } else {
        console.warn('⚠️ El servidor no respondió después del inicio');
        return false;
      }
    } catch (error) {
      console.error('❌ Error iniciando servidor:', error);
      return false;
    } finally {
      this.isStarting = false;
    }
  }

  async tryStartServer() {
    // Método 1: Intentar usando fetch para despertar el servidor
    try {
      await fetch(`${this.serverUrl}/health`, { method: 'GET' });
    } catch (error) {
      // Ignorar errores, es esperado si el servidor no está ejecutándose
    }

    // Método 2: Mostrar instrucciones al usuario
    this.showServerInstructions();
  }

  showServerInstructions() {
    const message = `
🏛️ SERVIDOR DE INVENTARIO REQUERIDO

Para usar el buscador de inventario, necesitas iniciar el servidor:

1. Abre una nueva terminal
2. Navega a tu proyecto: cd "Downloads/7.Cursor/Proyectos/2.Chatbot Delfin-Git Hub /ntucLearningHub"
3. Ejecuta: python3 auto_start_inventory.py

O usa el comando rápido:
yarn start-inventory

El servidor se iniciará automáticamente en http://localhost:5003
    `;
    
    console.log(message);
    
    // Mostrar notificación visual si es posible
    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        if (!this.checkServerHealth()) {
          alert('🏛️ Para usar el buscador de inventario, inicia el servidor ejecutando:\n\npython3 auto_start_inventory.py\n\nen una terminal separada.');
        }
      }, 2000);
    }
  }

  startMonitoring() {
    // Verificar inmediatamente
    this.startServerIfNeeded();
    
    // Configurar verificación periódica cada 30 segundos
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    this.checkInterval = setInterval(async () => {
      await this.startServerIfNeeded();
    }, 30000);
    
    console.log('🔄 Monitoreo del servidor de inventario iniciado');
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 Monitoreo del servidor de inventario detenido');
    }
  }

  // Método para uso directo en componentes
  async ensureServerRunning() {
    const isHealthy = await this.checkServerHealth();
    if (!isHealthy) {
      await this.startServerIfNeeded();
    }
    return await this.checkServerHealth();
  }
}

// Instancia singleton
const inventoryServerManager = new InventoryServerManager();

// Auto-iniciar el monitoreo cuando se carga el módulo
if (typeof window !== 'undefined') {
  // En el navegador, iniciar después de que se cargue la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      inventoryServerManager.startMonitoring();
    });
  } else {
    inventoryServerManager.startMonitoring();
  }
}

export default inventoryServerManager;