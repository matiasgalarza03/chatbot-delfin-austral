import React, { useState, useEffect } from 'react';
import './InventoryModal.css';

const InventoryModalPython = ({ isOpen, onClose }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  // Verificar estado del servidor al abrir el modal
  useEffect(() => {
    if (isOpen) {
      checkServerHealth();
    }
  }, [isOpen]);

  const checkServerHealth = async () => {
    try {
      console.log('🔄 Verificando servidor de inventario...');
      
      // Usar proxy de Vite y URLs directas como respaldo
      const urls = [
        '/health',  // Proxy de Vite
        'http://localhost:5003/health',
        'http://127.0.0.1:5003/health'
      ];
      
      let serverWorking = false;
      let serverData = null;
      
      for (const url of urls) {
        try {
          console.log(`Probando: ${url}`);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });
          
          if (response.ok) {
            serverData = await response.json();
            console.log('✅ Servidor funcionando en:', url, serverData);
            serverWorking = true;
            break;
          }
        } catch (urlError) {
          console.log(`❌ Error en ${url}:`, urlError.message);
        }
      }
      
      if (serverWorking) {
        setServerStatus('online');
        setError('');
      } else {
        throw new Error('No se pudo conectar al servidor');
      }
      
    } catch (error) {
      console.error('❌ Error conectando al servidor:', error);
      setServerStatus('offline');
      setError('Servidor de inventario no disponible. Ejecuta en terminal: python3 inventory_server_simple.py');
    }
  };

  const handleSearch = async () => {
    const num = parseInt(searchNumber);
    
    if (!searchNumber || num < 1 || num > 357) {
      setError('Por favor ingresa un número entre 1 y 357');
      return;
    }

    if (serverStatus !== 'online') {
      setError('Servidor no disponible. Ejecuta: python3 inventory_server_simple.py');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      console.log('🔍 Buscando objeto #', num);
      
      // Usar proxy de Vite y URLs directas como respaldo
      const urls = [
        '/api/buscar-inventario',  // Proxy de Vite
        'http://localhost:5003/api/buscar-inventario',
        'http://127.0.0.1:5003/api/buscar-inventario'
      ];
      
      let searchSuccess = false;
      let searchData = null;
      
      for (const url of urls) {
        try {
          console.log(`Buscando en: ${url}`);
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({ numero: num })
          });

          if (response.ok) {
            searchData = await response.json();
            searchSuccess = true;
            break;
          }
        } catch (urlError) {
          console.log(`❌ Error buscando en ${url}:`, urlError.message);
        }
      }
      
      if (searchSuccess && searchData) {
        if (searchData.success && searchData.objeto) {
          console.log('✅ Objeto encontrado:', searchData.objeto);
          setSearchResult(searchData.objeto);
          setError('');
        } else {
          console.log('❌ Objeto no encontrado:', searchData.message);
          setError(searchData.message || `Objeto #${num} no encontrado`);
        }
      } else {
        throw new Error('No se pudo realizar la búsqueda');
      }
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      setError('Error de conexión con el servidor. Verifica que esté ejecutándose.');
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

  const startServer = () => {
    setError('Para iniciar el servidor, ejecuta en terminal: python3 inventory_server_simple.py');
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
          {/* Estado del servidor */}
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            background: serverStatus === 'online' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${serverStatus === 'online' ? '#10b981' : '#dc2626'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>
                {serverStatus === 'online' ? '✅' : '❌'}
              </span>
              <strong>
                Estado del servidor: {serverStatus === 'online' ? 'Conectado' : 'Desconectado'}
              </strong>
            </div>
            {serverStatus === 'offline' && (
              <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                Para usar el buscador, ejecuta en terminal:<br/>
                <code style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                  python3 inventory_server_simple.py
                </code>
              </div>
            )}
          </div>

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
                disabled={loading || serverStatus !== 'online'}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #0ea5e9',
                  borderRadius: '12px',
                  width: '200px',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontWeight: '500'
                }}
              />
              <button 
                onClick={handleSearch} 
                className="search-button"
                disabled={loading || !searchNumber || serverStatus !== 'online'}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: serverStatus === 'online' ? '#0ea5e9' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: serverStatus === 'online' ? 'pointer' : 'not-allowed',
                  marginLeft: '12px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
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
                    backgroundColor: '#0369a1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginLeft: '12px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(3, 105, 161, 0.3)'
                  }}
                >
                  🗑️ Limpiar
                </button>
              )}
            </div>

            {serverStatus === 'offline' && (
              <div style={{ marginTop: '16px' }}>
                <button 
                  onClick={checkServerHealth}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Verificar servidor
                </button>
              </div>
            )}
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
                  <div className="photo-container" style={{
                    width: '100%',
                    minHeight: '300px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)',
                    border: '3px solid #0ea5e9'
                  }}>
                    <img 
                      src={searchResult.foto} 
                      alt={searchResult.objeto_de_museo}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '13px',
                        display: 'block'
                      }}
                      onError={(e) => {
                        // Si la imagen no carga, mostrar placeholder
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        // Si la imagen carga correctamente, ocultar placeholder
                        e.target.nextElementSibling.style.display = 'none';
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      width: '100%',
                      height: '300px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                      border: '2px dashed #0ea5e9',
                      borderRadius: '13px',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0369a1'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '12px', opacity: 0.7 }}>🏛️</div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '1.1rem' }}>Imagen del Objeto</p>
                      <small style={{ fontSize: '0.9rem', opacity: 0.8 }}>Inventario #{searchResult.numero_inventario}</small>
                      <small style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>Museo Escolar E.E.S. N°3</small>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN PRINCIPAL */}
                <div className="info-section">
                  {/* OBJETO DE MUSEO */}
                  <div style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)',
                    borderLeft: '5px solid #0ea5e9',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{
                      color: '#0369a1',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      margin: '0 0 16px 0',
                      padding: '8px 12px',
                      background: 'rgba(14, 165, 233, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0ea5e9'
                    }}>🏛️ OBJETO DE MUSEO</h4>
                    <p style={{
                      color: '#0369a1',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.4
                    }}>{searchResult.objeto_de_museo}</p>
                  </div>
                  
                  {/* PROCEDENCIA */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 15px rgba(3, 105, 161, 0.2)',
                    borderLeft: '5px solid #0369a1'
                  }}>
                    <h4 style={{
                      color: '#0369a1',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      margin: '0 0 16px 0',
                      padding: '8px 12px',
                      background: 'rgba(3, 105, 161, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0369a1'
                    }}>📍 PROCEDENCIA</h4>
                    <p style={{
                      color: '#0369a1',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.4
                    }}>{searchResult.procedencia}</p>
                  </div>

                </div>
              </div>
            </div>
          )}

          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '24px',
            borderRadius: '16px',
            marginTop: '24px',
            border: '2px solid #0ea5e9',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)'
          }}>
            <h4 style={{
              color: '#0369a1',
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}>📊 Información del Inventario</h4>
            <ul style={{
              color: '#0369a1',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              <li><strong>Total de objetos catalogados:</strong> 357</li>
              <li><strong>Rango de búsqueda:</strong> 1 - 357</li>
              <li><strong>Institución:</strong> E.E.S. N°3 Malvinas Argentinas</li>
              <li><strong>Proyecto:</strong> Museo Escolar</li>
              <li><strong>Tecnología:</strong> Python + JSON + React</li>
            </ul>
            <div style={{
              marginTop: '16px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)', 
              borderRadius: '12px', 
              fontSize: '0.9rem',
              border: '1px solid #0ea5e9'
            }}>
              <strong style={{color: '#0369a1'}}>💡 Ejemplos para probar:</strong><br/>
              <span style={{color: '#0369a1'}}>
                #1: Reloj. Industria Argentina.<br/>
                #6: Mapa de las Islas Malvinas 1982<br/>
                #15: Microscopio óptico Zeiss<br/>
                #50: Máquina de escribir (Variante)
              </span>
            </div>
          </div>
        </div>

        <div className="inventory-modal-footer">
          <button onClick={onClose} style={{
            padding: '14px 28px',
            backgroundColor: '#0369a1',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(3, 105, 161, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            Cerrar Buscador
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModalPython;