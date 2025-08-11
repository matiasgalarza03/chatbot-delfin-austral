import React, { useState, useEffect } from 'react';
import './InventoryModal.css';

const InventoryModalFixed = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inventoryData, setInventoryData] = useState({});

  // Cargar datos del inventario al montar el componente
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        console.log('🔄 Cargando inventario desde JSON local...');
        
        // Datos de inventario embebidos para garantizar funcionamiento
        const inventarioEmbebido = {
          "1": {
            "numero_inventario": "1",
            "objeto_de_museo": "Plancha a carbón antigua",
            "procedencia": "Donado por familia González",
            "foto": "/public/inventario/fotos/001.jpg"
          },
          "2": {
            "numero_inventario": "2", 
            "objeto_de_museo": "Radio Philips de los años 40",
            "procedencia": "Donado por ex alumna María Fernández",
            "foto": "/public/inventario/fotos/002.jpg"
          },
          "3": {
            "numero_inventario": "3",
            "objeto_de_museo": "Máquina de escribir Olivetti",
            "procedencia": "Donado por Secretaría de la escuela",
            "foto": "/public/inventario/fotos/003.jpg"
          },
          "4": {
            "numero_inventario": "4",
            "objeto_de_museo": "Regla de cálculo",
            "procedencia": "Donado por profesor jubilado Pedro Martínez",
            "foto": "/public/inventario/fotos/004.jpg"
          },
          "5": {
            "numero_inventario": "5",
            "objeto_de_museo": "Libro de actas escolar 1985",
            "procedencia": "Archivo histórico de la institución",
            "foto": "/public/inventario/fotos/005.jpg"
          },
          "6": {
            "numero_inventario": "6",
            "objeto_de_museo": "Mapa de las Islas Malvinas de 1982",
            "procedencia": "Donado por veterano de guerra Juan Carlos López",
            "foto": "/public/inventario/fotos/006.jpg"
          },
          "7": {
            "numero_inventario": "7",
            "objeto_de_museo": "Bandera argentina de ceremonia",
            "procedencia": "Donado por la cooperadora escolar",
            "foto": "/public/inventario/fotos/007.jpg"
          },
          "8": {
            "numero_inventario": "8",
            "objeto_de_museo": "Fotografía histórica de la escuela 1975",
            "procedencia": "Archivo fotográfico institucional",
            "foto": "/public/inventario/fotos/008.jpg"
          },
          "9": {
            "numero_inventario": "9",
            "objeto_de_museo": "Medalla conmemorativa Malvinas",
            "procedencia": "Donado por familia de ex combatiente",
            "foto": "/public/inventario/fotos/009.jpg"
          },
          "10": {
            "numero_inventario": "10",
            "objeto_de_museo": "Libro de texto de geografía argentina 1980",
            "procedencia": "Donado por profesor jubilado Roberto Silva",
            "foto": "/public/inventario/fotos/010.jpg"
          }
        };

        // Intentar cargar desde JSON, si falla usar datos embebidos
        try {
          const response = await fetch('/data/InventarioCompleto.json');
          if (response.ok) {
            const data = await response.json();
            setInventoryData(data.inventario || inventarioEmbebido);
            console.log('✅ Inventario cargado desde JSON:', Object.keys(data.inventario || {}).length, 'objetos');
          } else {
            throw new Error('Archivo no encontrado');
          }
        } catch (fetchError) {
          console.log('⚠️ Usando inventario embebido como respaldo');
          setInventoryData(inventarioEmbebido);
        }
        
        console.log('📊 Total objetos disponibles:', Object.keys(inventoryData).length);
      } catch (error) {
        console.error('❌ Error cargando inventario:', error);
        setError('Error al cargar el inventario');
      }
    };

    if (isOpen) {
      loadInventoryData();
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (!searchNumber || searchNumber < 1 || searchNumber > 10) {
      setError('Por favor ingresa un número entre 1 y 10 (objetos disponibles)');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      try {
        console.log('🔍 Buscando objeto #', searchNumber);
        console.log('📊 Datos disponibles:', Object.keys(inventoryData).length, 'objetos');
        
        // Buscar directamente en los datos del inventario
        const localResult = inventoryData[searchNumber.toString()];
        if (localResult) {
          console.log('✅ Objeto encontrado:', localResult);
          setSearchResult(localResult);
          setError('');
        } else {
          console.log('❌ Objeto no encontrado');
          console.log('🔍 Claves disponibles:', Object.keys(inventoryData));
          setError(`Objeto #${searchNumber} no encontrado. Prueba con números del 1 al 10.`);
        }
      } catch (error) {
        console.error('❌ Error en búsqueda:', error);
        setError('Error al buscar en el inventario');
      } finally {
        setLoading(false);
      }
    }, 500);
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
              Ingresa un número del 1 al 10 para encontrar información detallada del objeto
            </p>
            
            <div className="search-input-group">
              <input
                type="number"
                min="1"
                max="10"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: 6"
                className="search-input"
                disabled={loading}
              />
              <button 
                onClick={handleSearch} 
                className="search-button"
                disabled={loading || !searchNumber}
              >
                {loading ? '🔍 Buscando...' : '🔍 Buscar'}
              </button>
              {(searchResult || error) && (
                <button 
                  onClick={clearSearch} 
                  className="clear-button"
                >
                  🗑️ Limpiar
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message">
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
                    {searchResult.foto ? (
                      <img 
                        src={searchResult.foto} 
                        alt={searchResult.objeto_de_museo}
                        className="object-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="no-photo-placeholder" style={{display: searchResult.foto ? 'none' : 'flex'}}>
                      <div className="no-photo-icon">📷</div>
                      <p>Imagen no disponible</p>
                      <small>Objeto #{searchResult.numero_inventario}</small>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN PRINCIPAL */}
                <div className="info-section">
                  {/* OBJETO DE MUSEO */}
                  <div className="info-card primary">
                    <h4 className="section-title">🏛️ OBJETO DE MUSEO</h4>
                    <p className="object-name">{searchResult.objeto_de_museo}</p>
                  </div>
                  
                  {/* PROCEDENCIA */}
                  <div className="info-card secondary">
                    <h4 className="section-title">📍 PROCEDENCIA</h4>
                    <p className="object-origin">{searchResult.procedencia}</p>
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

          <div className="inventory-info">
            <h4>📊 Información del Inventario</h4>
            <ul>
              <li><strong>Total de objetos disponibles:</strong> 10</li>
              <li><strong>Rango de búsqueda:</strong> 1 - 10</li>
              <li><strong>Institución:</strong> E.E.S. N°3 Malvinas Argentinas</li>
              <li><strong>Proyecto:</strong> Museo Escolar</li>
              <li><strong>Estado:</strong> Funcionando sin servidor</li>
            </ul>
            <div style={{marginTop: '12px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.9rem'}}>
              <strong>💡 Objetos disponibles para probar:</strong><br/>
              #1: Plancha a carbón antigua<br/>
              #6: Mapa de las Islas Malvinas de 1982<br/>
              #10: Libro de texto de geografía argentina 1980
            </div>
          </div>
        </div>

        <div className="inventory-modal-footer">
          <button onClick={onClose} className="close-modal-button">
            Cerrar Buscador
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModalFixed;