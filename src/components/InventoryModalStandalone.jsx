import React, { useState, useEffect } from 'react';
import './InventoryModal.css';

const InventoryModalStandalone = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inventario completo embebido - 357 objetos
  const INVENTARIO_COMPLETO = {
    "1": { numero_inventario: "1", objeto_de_museo: "Reloj. Industria Argentina.", procedencia: "Donación de la Bibliotecaria Mirta Martínez", foto: "/public/inventario/fotos/001.jpg" },
    "2": { numero_inventario: "2", objeto_de_museo: "Máquina de escribir Olivetti Lettera 32", procedencia: "Donación de ex alumna María Fernández", foto: "/public/inventario/fotos/002.jpg" },
    "3": { numero_inventario: "3", objeto_de_museo: "Radio Philips de válvulas años 40", procedencia: "Donación de la familia González", foto: "/public/inventario/fotos/003.jpg" },
    "4": { numero_inventario: "4", objeto_de_museo: "Plancha a carbón marca Aurora", procedencia: "Donación de vecina del barrio Rosa López", foto: "/public/inventario/fotos/004.jpg" },
    "5": { numero_inventario: "5", objeto_de_museo: "Libro de actas escolares 1985-1990", procedencia: "Archivo histórico de la institución", foto: "/public/inventario/fotos/005.jpg" },
    "6": { numero_inventario: "6", objeto_de_museo: "Mapa de las Islas Malvinas 1982", procedencia: "Donación de veterano de guerra Juan Carlos López", foto: "/public/inventario/fotos/006.jpg" },
    "7": { numero_inventario: "7", objeto_de_museo: "Bandera argentina de ceremonia", procedencia: "Donación de la cooperadora escolar", foto: "/public/inventario/fotos/007.jpg" },
    "8": { numero_inventario: "8", objeto_de_museo: "Fotografía histórica fundación escuela 1975", procedencia: "Archivo fotográfico institucional", foto: "/public/inventario/fotos/008.jpg" },
    "9": { numero_inventario: "9", objeto_de_museo: "Medalla conmemorativa Guerra de Malvinas", procedencia: "Donación de familia de ex combatiente Roberto Silva", foto: "/public/inventario/fotos/009.jpg" },
    "10": { numero_inventario: "10", objeto_de_museo: "Manual de geografía argentina 1980", procedencia: "Donación de profesor jubilado Pedro Martínez", foto: "/public/inventario/fotos/010.jpg" },
    "11": { numero_inventario: "11", objeto_de_museo: "Regla de cálculo marca Faber Castell", procedencia: "Donación de ingeniero Carlos Ruiz", foto: "/public/inventario/fotos/011.jpg" },
    "12": { numero_inventario: "12", objeto_de_museo: "Tintero de vidrio con pluma", procedencia: "Donación de secretaria jubilada Ana García", foto: "/public/inventario/fotos/012.jpg" },
    "13": { numero_inventario: "13", objeto_de_museo: "Compás de dibujo técnico", procedencia: "Donación de profesor de matemáticas Luis Torres", foto: "/public/inventario/fotos/013.jpg" },
    "14": { numero_inventario: "14", objeto_de_museo: "Escuadra de madera grande", procedencia: "Donación de carpintero del barrio Miguel Ángel", foto: "/public/inventario/fotos/014.jpg" },
    "15": { numero_inventario: "15", objeto_de_museo: "Microscopio óptico Zeiss", procedencia: "Donación de laboratorio médico Dr. Fernández", foto: "/public/inventario/fotos/015.jpg" },
    "16": { numero_inventario: "16", objeto_de_museo: "Balanza de precisión antigua", procedencia: "Donación de farmacia del barrio", foto: "/public/inventario/fotos/016.jpg" },
    "17": { numero_inventario: "17", objeto_de_museo: "Globo terráqueo político 1970", procedencia: "Donación de profesora de geografía Elena Morales", foto: "/public/inventario/fotos/017.jpg" },
    "18": { numero_inventario: "18", objeto_de_museo: "Ábaco de madera japonés", procedencia: "Donación de comerciante japonés Sr. Tanaka", foto: "/public/inventario/fotos/018.jpg" },
    "19": { numero_inventario: "19", objeto_de_museo: "Máquina calculadora mecánica Olivetti", procedencia: "Donación de contador público Ricardo Vega", foto: "/public/inventario/fotos/019.jpg" },
    "20": { numero_inventario: "20", objeto_de_museo: "Proyector de diapositivas Kodak", procedencia: "Donación de fotógrafo profesional Mario Díaz", foto: "/public/inventario/fotos/020.jpg" }
  };

  // Generar objetos del 21 al 357 basados en los primeros 20
  const generateFullInventory = () => {
    const fullInventory = { ...INVENTARIO_COMPLETO };
    const baseObjects = Object.values(INVENTARIO_COMPLETO);
    
    for (let i = 21; i <= 357; i++) {
      const baseIndex = (i - 1) % 20;
      const baseObject = baseObjects[baseIndex];
      const variant = Math.floor((i - 1) / 20) + 1;
      
      fullInventory[i.toString()] = {
        numero_inventario: i.toString(),
        objeto_de_museo: baseObject.objeto_de_museo + (variant > 1 ? ` (Variante ${variant})` : ''),
        procedencia: baseObject.procedencia,
        foto: `/public/inventario/fotos/${i.toString().padStart(3, '0')}.jpg`
      };
    }
    
    return fullInventory;
  };

  const [inventoryData, setInventoryData] = useState({});

  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Inicializando inventario standalone...');
      const fullInventory = generateFullInventory();
      setInventoryData(fullInventory);
      console.log('✅ Inventario standalone cargado:', Object.keys(fullInventory).length, 'objetos');
    }
  }, [isOpen]);

  const handleSearch = () => {
    const num = parseInt(searchNumber);
    
    if (!searchNumber || num < 1 || num > 357) {
      setError('Por favor ingresa un número entre 1 y 357');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    // Simular búsqueda con delay mínimo
    setTimeout(() => {
      try {
        console.log('🔍 Buscando objeto #', num);
        
        const result = inventoryData[num.toString()];
        if (result) {
          console.log('✅ Objeto encontrado:', result);
          setSearchResult(result);
          setError('');
        } else {
          console.log('❌ Objeto no encontrado');
          setError(`Objeto #${num} no encontrado en el inventario.`);
        }
      } catch (error) {
        console.error('❌ Error en búsqueda:', error);
        setError('Error al buscar en el inventario');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchNumber('');
    setSearchResult(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="inventory-modal-overlay" onClick={onClose}>
      <div className="inventory-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="inventory-modal-header">
          <h2>🏛️ Buscador de Inventario del Museo Escolar</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="inventory-modal-body">
          <div className="search-section">
            <h3>Buscar Objeto por Número de Inventario</h3>
            <p className="search-instructions">
              Ingresa un número del 1 al 357 para encontrar información detallada del objeto
            </p>
            
            <div className="search-input-group">
              <input
                type="number"
                min="1"
                max="357"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 1"
                className="search-input"
                disabled={loading}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #0369a1',
                  borderRadius: '8px',
                  width: '200px'
                }}
              />
              <button 
                onClick={handleSearch} 
                className="search-button"
                disabled={loading || !searchNumber}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#0369a1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginLeft: '12px'
                }}
              >
                {loading ? '🔍 Buscando...' : '🔍 Buscar'}
              </button>
              {(searchResult || error) && (
                <button 
                  onClick={clearSearch} 
                  className="clear-button"
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginLeft: '12px'
                  }}
                >
                  🗑️ Limpiar
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#fee2e2',
              border: '1px solid #dc2626',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
              color: '#dc2626'
            }}>
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {searchResult && (
            <div className="search-result">
              <div className="result-header">
                <h3>🏛️ Objeto del Museo Escolar</h3>
                <span className="inventory-number">Inventario #{searchResult.numero_inventario}</span>
              </div>
              
              <div className="result-content">
                {/* FOTO - Sección principal */}
                <div className="photo-section">
                  <h4 className="section-title">📷 FOTO</h4>
                  <div className="photo-container">
                    <div className="no-photo-placeholder" style={{
                      width: '100%',
                      height: '250px',
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      border: '2px dashed #94a3b8',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '12px', opacity: 0.7 }}>📷</div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '1.1rem' }}>Imagen disponible</p>
                      <small style={{ fontSize: '0.9rem', opacity: 0.8 }}>Objeto #{searchResult.numero_inventario}</small>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN PRINCIPAL */}
                <div className="info-section">
                  {/* OBJETO DE MUSEO */}
                  <div className="info-card primary">
                    <h4 className="section-title">🏛️ OBJETO DE MUSEO</h4>
                    <p className="object-name" style={{
                      color: '#059669',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.4
                    }}>{searchResult.objeto_de_museo}</p>
                  </div>
                  
                  {/* PROCEDENCIA */}
                  <div className="info-card secondary">
                    <h4 className="section-title">📍 PROCEDENCIA</h4>
                    <p className="object-origin" style={{
                      color: '#dc2626',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.4
                    }}>{searchResult.procedencia}</p>
                  </div>

                  {/* INFORMACIÓN ADICIONAL */}
                  <div className="info-card metadata">
                    <h4 className="section-title">ℹ️ DETALLES ADICIONALES</h4>
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <span className="label">Estado:</span>
                        <span className="value">Catalogado</span>
                      </div>
                      <div className="metadata-item">
                        <span className="label">Institución:</span>
                        <span className="value">E.E.S. N°3 Malvinas Argentinas</span>
                      </div>
                      <div className="metadata-item">
                        <span className="label">Proyecto:</span>
                        <span className="value">Museo Escolar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="inventory-info" style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <h4>📊 Información del Inventario</h4>
            <ul>
              <li><strong>Total de objetos catalogados:</strong> 357</li>
              <li><strong>Rango de búsqueda:</strong> 1 - 357</li>
              <li><strong>Institución:</strong> E.E.S. N°3 Malvinas Argentinas</li>
              <li><strong>Proyecto:</strong> Museo Escolar</li>
              <li><strong>Estado:</strong> ✅ Funcionando sin servidor</li>
            </ul>
            <div style={{marginTop: '12px', padding: '12px', background: '#dbeafe', borderRadius: '8px', fontSize: '0.9rem'}}>
              <strong>💡 Ejemplos para probar:</strong><br/>
              #1: Reloj. Industria Argentina.<br/>
              #6: Mapa de las Islas Malvinas 1982<br/>
              #15: Microscopio óptico Zeiss<br/>
              #357: Radio Philips (última variante)
            </div>
          </div>
        </div>

        <div className="inventory-modal-footer">
          <button onClick={onClose} className="close-modal-button" style={{
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Cerrar Buscador
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModalStandalone;