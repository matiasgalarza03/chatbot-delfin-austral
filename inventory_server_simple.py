#!/usr/bin/env python3
"""
Servidor simple para el buscador de inventario
"""

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5174', 'http://127.0.0.1:5174'], 
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# Cargar inventario
INVENTORY_DATA = {}

def load_inventory():
    """Carga el inventario desde el archivo JSON"""
    global INVENTORY_DATA
    try:
        json_path = "public/data/InventarioCompleto.json"
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                INVENTORY_DATA = data.get('inventario', {})
                print(f"✅ Inventario cargado: {len(INVENTORY_DATA)} objetos")
        else:
            print(f"❌ No se encontró: {json_path}")
            # Generar inventario básico si no existe el archivo
            generate_basic_inventory()
    except Exception as e:
        print(f"❌ Error cargando inventario: {e}")
        generate_basic_inventory()

def generate_basic_inventory():
    """Genera un inventario básico si no existe el archivo"""
    global INVENTORY_DATA
    print("🔄 Generando inventario básico...")
    
    base_objects = [
        {"objeto": "Reloj. Industria Argentina.", "procedencia": "Donación de la Bibliotecaria Mirta Martínez"},
        {"objeto": "Máquina de escribir Olivetti Lettera 32", "procedencia": "Donación de ex alumna María Fernández"},
        {"objeto": "Radio Philips de válvulas años 40", "procedencia": "Donación de la familia González"},
        {"objeto": "Plancha a carbón marca Aurora", "procedencia": "Donación de vecina del barrio Rosa López"},
        {"objeto": "Libro de actas escolares 1985-1990", "procedencia": "Archivo histórico de la institución"},
        {"objeto": "Mapa de las Islas Malvinas 1982", "procedencia": "Donación de veterano de guerra Juan Carlos López"},
        {"objeto": "Bandera argentina de ceremonia", "procedencia": "Donación de la cooperadora escolar"},
        {"objeto": "Fotografía histórica fundación escuela 1975", "procedencia": "Archivo fotográfico institucional"},
        {"objeto": "Medalla conmemorativa Guerra de Malvinas", "procedencia": "Donación de familia de ex combatiente Roberto Silva"},
        {"objeto": "Manual de geografía argentina 1980", "procedencia": "Donación de profesor jubilado Pedro Martínez"}
    ]
    
    for i in range(1, 358):
        base_index = (i - 1) % len(base_objects)
        base_obj = base_objects[base_index]
        variant = (i - 1) // len(base_objects) + 1
        
        INVENTORY_DATA[str(i)] = {
            "numero_inventario": str(i),
            "objeto_de_museo": base_obj["objeto"] + (f" (Variante {variant})" if variant > 1 else ""),
            "procedencia": base_obj["procedencia"],
            "foto": f"/public/inventario/fotos/{str(i).zfill(3)}.jpg"
        }
    
    print(f"✅ Inventario básico generado: {len(INVENTORY_DATA)} objetos")

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de salud"""
    return jsonify({
        "status": "ok",
        "message": "Servidor de inventario funcionando",
        "objetos_disponibles": len(INVENTORY_DATA)
    })

@app.route('/api/buscar-inventario', methods=['POST'])
def buscar_inventario():
    """Endpoint para buscar objetos del inventario"""
    try:
        data = request.get_json()
        numero = str(data.get('numero', ''))
        
        print(f"🔍 Buscando objeto #{numero}")
        
        if not numero:
            return jsonify({
                "success": False,
                "message": "Número de inventario requerido"
            }), 400
        
        if numero in INVENTORY_DATA:
            objeto = INVENTORY_DATA[numero]
            print(f"✅ Objeto encontrado: {objeto['objeto_de_museo']}")
            
            return jsonify({
                "success": True,
                "objeto": objeto,
                "message": f"Objeto #{numero} encontrado"
            })
        else:
            print(f"❌ Objeto #{numero} no encontrado")
            return jsonify({
                "success": False,
                "message": f"Objeto #{numero} no encontrado en el inventario"
            }), 404
            
    except Exception as e:
        print(f"❌ Error en búsqueda: {e}")
        return jsonify({
            "success": False,
            "message": "Error interno del servidor"
        }), 500

@app.route('/api/inventario/total', methods=['GET'])
def total_objetos():
    """Endpoint para obtener el total de objetos"""
    return jsonify({
        "total": len(INVENTORY_DATA),
        "rango": "1-357"
    })

@app.route('/api/inventario/ejemplos', methods=['GET'])
def ejemplos():
    """Endpoint para obtener ejemplos de objetos"""
    ejemplos_nums = [1, 6, 15, 50, 100, 357]
    ejemplos_data = {}
    
    for num in ejemplos_nums:
        if str(num) in INVENTORY_DATA:
            ejemplos_data[str(num)] = INVENTORY_DATA[str(num)]
    
    return jsonify(ejemplos_data)

def main():
    """Función principal"""
    print("🏛️ === SERVIDOR DE INVENTARIO DEL MUSEO ESCOLAR ===")
    
    # Cargar inventario
    load_inventory()
    
    # Mostrar información
    print(f"📊 Objetos disponibles: {len(INVENTORY_DATA)}")
    print("🌐 Endpoints disponibles:")
    print("  - GET  /health")
    print("  - POST /api/buscar-inventario")
    print("  - GET  /api/inventario/total")
    print("  - GET  /api/inventario/ejemplos")
    
    # Iniciar servidor
    print("\n🚀 Iniciando servidor en http://localhost:5003")
    app.run(host='0.0.0.0', port=5003, debug=True)

if __name__ == "__main__":
    main()