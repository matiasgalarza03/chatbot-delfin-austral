import React, { useState, useEffect } from 'react';
import './InventoryModal.css';

const InventoryModal = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inventoryData, setInventoryData] = useState({});

  // Cargar datos del inventario al montar el componente
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        const response = await fetch('/data/InventarioCompleto.json');
        const data = await response.json();
        setInventoryData(data.inventario || {});
      } catch (error) {
        console.error('Error cargando inventario:', error);
        setError('Error al cargar el inventario');
      }
    };

    if (isOpen) {
      loadInventoryData();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchNumber || searchNumber < 1 || searchNumber > 357) {
      setError('Por favor ingresa un número entre 1 y 357');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      // Primero intentar desde el JSON local
      const localResult = inventoryData[searchNumber];
      if (localResult) {
        setSearchResult(localResult);
        setLoading(false);
        return;
      }

      // Si no existe localmente, intentar desde el servidor
      const response = await fetch('/api/buscar-inventario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero_inventario: searchNumber
        })
      });

      const data = await response.json();

      if (data.encontrado) {
        setSearchResult({
          numero_inventario: data.objeto.numero_inventario,
          objeto_de_museo: data.objeto.descripcion,
          procedencia: data.objeto.procedencia,
          foto: data.objeto.foto || '/public/inventario/fotos/default.jpg'
        });
      } else {
        setError(`No se encontró el objeto con número ${searchNumber}`);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Error al buscar en el inventario. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
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
                placeholder="Ej: 142"
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
              <li><strong>Total de objetos catalogados:</strong> 357</li>
              <li><strong>Rango de búsqueda:</strong> 1 - 357</li>
              <li><strong>Institución:</strong> E.E.S. N°3 Malvinas Argentinas</li>
              <li><strong>Proyecto:</strong> Museo Escolar</li>
            </ul>
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

export default InventoryModal;