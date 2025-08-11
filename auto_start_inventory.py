#!/usr/bin/env python3
"""
Script para iniciar automáticamente el servidor de inventario
y mantenerlo ejecutándose constantemente
"""

import subprocess
import sys
import os
import time
import threading
import signal
import requests
from pathlib import Path

class InventoryServerManager:
    def __init__(self):
        self.server_process = None
        self.running = False
        self.project_root = Path(__file__).parent
        self.public_dir = self.project_root / "public"
        self.server_script = self.public_dir / "inventory_server.py"
        
    def check_server_health(self):
        """Verifica si el servidor está funcionando"""
        try:
            response = requests.get('http://localhost:5003/api/health', timeout=3)
            return response.status_code == 200
        except:
            return False
    
    def start_server(self):
        """Inicia el servidor de inventario"""
        try:
            print("🚀 Iniciando servidor de inventario...")
            
            # Cambiar al directorio public
            os.chdir(self.public_dir)
            
            # Iniciar el servidor
            self.server_process = subprocess.Popen([
                sys.executable, str(self.server_script)
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
               preexec_fn=os.setsid if hasattr(os, 'setsid') else None)
            
            # Esperar un momento para que se inicie
            time.sleep(5)
            
            # Verificar que esté funcionando
            if self.check_server_health():
                print("✅ Servidor de inventario iniciado correctamente en http://localhost:5003")
                return True
            else:
                print("❌ Error: El servidor no pudo iniciarse correctamente")
                return False
                
        except Exception as e:
            print(f"❌ Error iniciando servidor: {e}")
            return False
    
    def stop_server(self):
        """Detiene el servidor de inventario"""
        if self.server_process:
            try:
                # Intentar terminar el proceso gracefully
                if hasattr(os, 'killpg'):
                    os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                else:
                    self.server_process.terminate()
                
                # Esperar un momento
                time.sleep(2)
                
                # Si aún está ejecutándose, forzar la terminación
                if self.server_process.poll() is None:
                    if hasattr(os, 'killpg'):
                        os.killpg(os.getpgid(self.server_process.pid), signal.SIGKILL)
                    else:
                        self.server_process.kill()
                
                print("🛑 Servidor de inventario detenido")
            except:
                pass
            finally:
                self.server_process = None
    
    def monitor_server(self):
        """Monitorea el servidor y lo reinicia si es necesario"""
        while self.running:
            try:
                if not self.check_server_health():
                    print("⚠️ Servidor no responde, reiniciando...")
                    self.stop_server()
                    time.sleep(2)
                    self.start_server()
                
                # Verificar cada 30 segundos
                time.sleep(30)
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"⚠️ Error en monitoreo: {e}")
                time.sleep(10)
    
    def run(self):
        """Ejecuta el gestor del servidor"""
        print("🏛️ Gestor del Servidor de Inventario del Museo Escolar")
        print("=" * 60)
        
        # Verificar si ya está ejecutándose
        if self.check_server_health():
            print("✅ El servidor ya está ejecutándose")
        else:
            # Iniciar el servidor
            if not self.start_server():
                print("❌ No se pudo iniciar el servidor")
                return False
        
        self.running = True
        
        # Configurar manejador de señales para cierre limpio
        def signal_handler(signum, frame):
            print("\n🛑 Deteniendo servidor...")
            self.running = False
            self.stop_server()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Iniciar monitoreo en un hilo separado
        monitor_thread = threading.Thread(target=self.monitor_server, daemon=True)
        monitor_thread.start()
        
        print("🔄 Servidor en ejecución. Presiona Ctrl+C para detener.")
        print("📊 Estado del servidor: http://localhost:5003/api/health")
        
        try:
            # Mantener el script ejecutándose
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        finally:
            self.stop_server()
        
        return True

def main():
    """Función principal"""
    manager = InventoryServerManager()
    manager.run()

if __name__ == "__main__":
    main()