#!/usr/bin/env python3
"""
Script para iniciar el servidor de inventario en segundo plano
"""

import subprocess
import sys
import os
import time
import requests

def check_server_running():
    """Verifica si el servidor ya está ejecutándose"""
    try:
        response = requests.get('http://localhost:5003/api/health', timeout=2)
        return response.status_code == 200
    except:
        return False

def start_server():
    """Inicia el servidor de inventario"""
    # Cambiar al directorio public
    os.chdir('./public')
    
    # Verificar si el servidor ya está ejecutándose
    if check_server_running():
        print("✅ El servidor de inventario ya está ejecutándose en http://localhost:5003")
        return True
    
    print("🚀 Iniciando servidor de inventario...")
    
    try:
        # Iniciar el servidor en segundo plano
        process = subprocess.Popen([
            sys.executable, 'inventory_server.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Esperar un momento para que el servidor se inicie
        time.sleep(3)
        
        # Verificar si el servidor está funcionando
        if check_server_running():
            print("✅ Servidor de inventario iniciado correctamente en http://localhost:5003")
            return True
        else:
            print("❌ Error: El servidor no pudo iniciarse correctamente")
            return False
            
    except Exception as e:
        print(f"❌ Error iniciando el servidor: {e}")
        return False

if __name__ == "__main__":
    start_server()