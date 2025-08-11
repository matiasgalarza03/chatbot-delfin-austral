#!/usr/bin/env python3
"""
Servidor backend para la búsqueda de inventario del Museo Escolar
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
import json

# Agregar el directorio público al path para importar el módulo
sys.path.append(os.path.join(os.path.dirname(__file__), 'public'))

try:
    from inventory_excel import InventarioMuseoExcel
except ImportError as e:
    print(f"Error importando inventory_excel: {e}")
    sys.exit(1)

app = Flask(__name__, static_folder='public')
CORS(app)  # Permitir CORS para todas las rutas

# Ruta para servir archivos estáticos
@app.route('/models/<path:filename>')
def serve_model(filename):
    return send_from_directory('public/models', filename)

# Inicializar el inventario al arrancar el servidor
EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'public', 'Inventario Museo Escolar. Secundaria 3.xlsx')
museo = None

def inicializar_inventario():
    """Inicializa el inventario del museo"""
    global museo
    try:
        if os.path.exists(EXCEL_PATH):
            museo = InventarioMuseoExcel(EXCEL_PATH)
            print(f"✅ Inventario Excel cargado exitosamente. {len(museo.inventario_data)} objetos disponibles.")
            return True
        else:
            print(f"❌ No se encontró el archivo Excel: {EXCEL_PATH}")
            return False
    except Exception as e:
        print(f"❌ Error al inicializar el inventario: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar el estado del servidor"""
    return jsonify({
        'status': 'ok',
        'inventario_disponible': museo is not None,
        'total_objetos': len(museo.inventario_data) if museo else 0
    })

@app.route('/api/buscar-inventario', methods=['POST'])
def buscar_inventario():
    """
    Endpoint para buscar un objeto por número de inventario
    
    Body JSON esperado:
    {
        "numero_inventario": "123"
    }
    """
    try:
        if not museo:
            return jsonify({
                'error': 'Inventario no disponible',
                'message': 'El sistema de inventario no está inicializado'
            }), 500

        data = request.get_json()
        if not data or 'numero_inventario' not in data:
            return jsonify({
                'error': 'Parámetro faltante',
                'message': 'Se requiere el parámetro numero_inventario'
            }), 400

        numero_inventario = str(data['numero_inventario']).strip()
        
        if not numero_inventario:
            return jsonify({
                'error': 'Número inválido',
                'message': 'El número de inventario no puede estar vacío'
            }), 400

        # Buscar el objeto
        resultado = museo.buscar_objeto(numero_inventario)
        
        if resultado:
            return jsonify({
                'encontrado': True,
                'objeto': {
                    'numero_inventario': resultado['NUMERO_INVENTARIO'],
                    'procedencia': resultado['PROCEDENCIA'],
                    'descripcion': resultado['OBJETO_DE_MUSEO'],
                    'foto': resultado['FOTO']
                }
            })
        else:
            return jsonify({
                'encontrado': False,
                'message': f'No se encontró ningún objeto con el número de inventario: {numero_inventario}'
            })

    except Exception as e:
        print(f"Error en búsqueda: {e}")
        return jsonify({
            'error': 'Error interno',
            'message': 'Ocurrió un error al procesar la búsqueda'
        }), 500

@app.route('/api/listar-numeros', methods=['GET'])
def listar_numeros():
    """Endpoint para obtener todos los números de inventario disponibles"""
    try:
        if not museo:
            return jsonify({
                'error': 'Inventario no disponible',
                'message': 'El sistema de inventario no está inicializado'
            }), 500

        numeros = museo.listar_todos_los_numeros()
        return jsonify({
            'numeros': sorted(numeros, key=lambda x: int(x) if x.isdigit() else float('inf')),
            'total': len(numeros)
        })

    except Exception as e:
        print(f"Error al listar números: {e}")
        return jsonify({
            'error': 'Error interno',
            'message': 'Ocurrió un error al obtener la lista de números'
        }), 500

@app.route('/api/buscar-sugerencias', methods=['POST'])
def buscar_sugerencias():
    """
    Endpoint para obtener sugerencias de números de inventario
    
    Body JSON esperado:
    {
        "termino": "12"
    }
    """
    try:
        if not museo:
            return jsonify({'sugerencias': []})

        data = request.get_json()
        termino = str(data.get('termino', '')).strip()
        
        if not termino:
            return jsonify({'sugerencias': []})

        # Buscar números que contengan el término
        numeros = museo.listar_todos_los_numeros()
        sugerencias = [num for num in numeros if termino in num]
        
        # Limitar a 10 sugerencias y ordenar
        sugerencias = sorted(sugerencias, key=lambda x: int(x) if x.isdigit() else float('inf'))[:10]
        
        return jsonify({'sugerencias': sugerencias})

    except Exception as e:
        print(f"Error en sugerencias: {e}")
        return jsonify({'sugerencias': []})

if __name__ == '__main__':
    print("🚀 Iniciando servidor de inventario del Museo Escolar...")
    
    # Inicializar el inventario
    if inicializar_inventario():
        print("🌐 Servidor disponible en: http://localhost:5003")
        print("📋 Endpoints disponibles:")
        print("   - GET  /api/health")
        print("   - POST /api/buscar-inventario")
        print("   - GET  /api/listar-numeros")
        print("   - POST /api/buscar-sugerencias")
        
        app.run(debug=True, host='0.0.0.0', port=5003)
    else:
        print("❌ No se pudo inicializar el servidor. Verifique que el archivo PDF esté disponible.")
        sys.exit(1)
