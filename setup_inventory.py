#!/usr/bin/env python3
"""
Script de configuración para el sistema de inventario
"""

import subprocess
import sys
import os

def install_requirements():
    """Instala las dependencias necesarias"""
    print("📦 Instalando dependencias de Python...")
    
    requirements = [
        'flask',
        'flask-cors',
        'python-docx',
        'requests'
    ]
    
    for package in requirements:
        try:
            print(f"  Instalando {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"  ✅ {package} instalado")
        except subprocess.CalledProcessError:
            print(f"  ❌ Error instalando {package}")
            return False
    
    return True

def extract_inventory():
    """Extrae el inventario del archivo Word"""
    print("📄 Extrayendo inventario...")
    
    try:
        subprocess.check_call([sys.executable, 'extract_inventory.py'])
        print("✅ Inventario extraído correctamente")
        return True
    except subprocess.CalledProcessError:
        print("❌ Error extrayendo inventario")
        return False

def test_server():
    """Prueba el servidor"""
    print("🧪 Probando servidor...")
    
    try:
        import requests
        import time
        
        # Iniciar servidor en background (solo para test)
        print("  Iniciando servidor de prueba...")
        server_process = subprocess.Popen([sys.executable, 'inventory_server_simple.py'])
        
        # Esperar un poco para que inicie
        time.sleep(3)
        
        # Probar conexión
        response = requests.get('http://localhost:5003/health', timeout=5)
        if response.status_code == 200:
            print("  ✅ Servidor funcionando correctamente")
            result = True
        else:
            print("  ❌ Servidor no responde correctamente")
            result = False
        
        # Terminar proceso de prueba
        server_process.terminate()
        return result
        
    except Exception as e:
        print(f"  ❌ Error probando servidor: {e}")
        return False

def main():
    """Función principal"""
    print("🏛️ === CONFIGURACIÓN DEL SISTEMA DE INVENTARIO ===")
    
    # Verificar Python
    print(f"🐍 Python version: {sys.version}")
    
    # Instalar dependencias
    if not install_requirements():
        print("❌ Error en la instalación de dependencias")
        return
    
    # Extraer inventario
    if not extract_inventory():
        print("❌ Error extrayendo inventario")
        return
    
    # Probar servidor
    if not test_server():
        print("⚠️ Advertencia: Error probando servidor")
    
    print("\n🎯 === CONFIGURACIÓN COMPLETADA ===")
    print("✅ Sistema de inventario listo para usar")
    print("\n📋 Para usar el buscador:")
    print("1. Ejecuta: python3 inventory_server_simple.py")
    print("2. Abre la aplicación React")
    print("3. Ve a Museo Escolar → Buscador de inventario")
    print("4. Busca cualquier número del 1 al 357")

if __name__ == "__main__":
    main()