import React, { useState, useEffect } from 'react';
import './InventoryModal.css';

const InventoryModalEnhanced = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalObjects, setTotalObjects] = useState(0);

  // Cargar datos del inventario al montar el componente
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        console.log('🔄 Cargando inventario desde JSON local...');
        const response = await fetch('/data/InventarioCompleto.json');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de inventario');
        }
        
        const data = await response.json();
        console.log('✅ Inventario cargado:', data);
        
        setInventoryData(data.inventario || {});
        setTotalObjects(data.total_objetos || Object.keys(data.inventario || {}).length);
        console.log('📊 Total objetos cargados:', Object.keys(data.inventario || {}).length);
      } catch (error) {
        console.error('❌ Error cargando inventario:', error);
        setError('Error al cargar el inventario local');
      }
    };

    if (isOpen) {
      loadInventoryData();
    }
  }, [isOpen]);

  // Función para buscar objeto por número
  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      setError('Por favor, ingrese un número de inventario');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const numero = searchNumber.trim();
      
      // Buscar en los datos locales
      if (inventoryData[numero]) {
        const objeto = inventoryData[numero];
        setSearchResult({
          numero_inventario: objeto.numero_inventario,
          objeto_de_museo: objeto.objeto_de_museo,
          procedencia: objeto.procedencia,
          foto: objeto.foto || '/public/inventario/fotos/default.jpg'
        });
      } else {
        setError(`Objeto #${numero} no encontrado en el inventario.`);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setError('Error al buscar en el inventario');
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar con Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchNumber('');
    setSearchResult(null);
    setError('');
  };

  // Función para buscar objeto aleatorio
  const searchRandomObject = () => {
    const objectNumbers = Object.keys(inventoryData);
    if (objectNumbers.length > 0) {
      const randomNumber = objectNumbers[Math.floor(Math.random() * objectNumbers.length)];
      setSearchNumber(randomNumber);
      setTimeout(() => handleSearch(), 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal-content enhanced">
        <div className="inventory-modal-header">
          <h2>🏛️ Buscador de Inventario del Museo Escolar</h2>
          <button 
            className="inventory-close-button"
            onClick={onClose}
            aria-label="Cerrar buscador de inventario"
          >
            ✕
          </button>
        </div>

        <div className="inventory-modal-body">
          {/* Información del inventario */}
          <div className="inventory-info-section">
            <div className="inventory-stats">
              <div className="stat-item">
                <span className="stat-number">{totalObjects}</span>
                <span className="stat-label">Objetos catalogados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">E.E.S. N°3</span>
                <span className="stat-label">Malvinas Argentinas</span>
              </div>
            </div>
          </div>

          {/* Sección de búsqueda */}
          <div className="search-section">
            <h3>🔍 Buscar Objeto por Número de Inventario</h3>
            <div className="search-input-group">
              <input
                type="number"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingrese número (1-357)"
                className="search-input"
                min="1"
                max={totalObjects}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="search-button"
              >
                {loading ? '🔄' : '🔍'} Buscar
              </button>
              <button 
                onClick={searchRandomObject}
                className="random-button"
                title="Objeto aleatorio"
              >
                🎲
              </button>
              <button 
                onClick={clearSearch}
                className="clear-button"
                title="Limpiar búsqueda"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Resultados de búsqueda */}
          {searchResult && (
            <div className="search-result">
              <div className="result-header">
                <h3>🏛️ Objeto del Museo Escolar</h3>
                <span className="inventory-number">Inventario #{searchResult.numero_inventario}</span>
              </div>
              
              <div className="result-content">
                <div className="result-image-section">
                  <div className="image-container">
                    <img 
                      src={searchResult.foto} 
                      alt={searchResult.objeto_de_museo}
                      className="object-image"
                      onError={(e) => {
                        e.target.src = '/public/inventario/fotos/default.jpg';
                      }}
                    />
                    <div className="image-overlay">
                      <small>Objeto #{searchResult.numero_inventario}</small>
                    </div>
                  </div>
                </div>
                
                <div className="result-details">
                  <div className="detail-item">
                    <span className="label">📦 Objeto:</span>
                    <p className="object-name">{searchResult.objeto_de_museo}</p>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">📍 Procedencia:</span>
                    <p className="object-origin">{searchResult.procedencia}</p>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">🏛️ Colección:</span>
                    <span className="value">Museo Escolar</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="inventory-footer">
            <h4>📊 Información del Inventario</h4>
            <ul>
              <li><strong>Institución:</strong> E.E.S. N°3 Malvinas Argentinas</li>
              <li><strong>Proyecto:</strong> Museo Escolar</li>
              <li><strong>Total de objetos:</strong> {totalObjects}</li>
              <li><strong>Última actualización:</strong> 2024</li>
            </ul>
            
            <div className="help-section">
              <h5>💡 Consejos de búsqueda:</h5>
              <ul>
                <li>Ingrese un número entre 1 y {totalObjects}</li>
                <li>Use el botón 🎲 para explorar objetos aleatorios</li>
                <li>Presione Enter para buscar rápidamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModalEnhanced;