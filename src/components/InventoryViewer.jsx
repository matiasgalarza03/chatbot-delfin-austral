import React, { useState, useEffect } from 'react';

const InventoryViewer = ({ isOpen, onClose }) => {
  const [inventoryContent, setInventoryContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadInventoryContent();
    }
  }, [isOpen]);

  const loadInventoryContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar cargar el PDF primero
      const pdfUrl = '/Inventario/Inventario Museo Escolar. Secundaria 3.pdf';
      
      setInventoryContent({
        type: 'pdf',
        url: pdfUrl,
        title: 'Inventario Museo Escolar - Secundaria 3'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error cargando inventario:', err);
      setError('Error al cargar el inventario');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inventory-viewer-overlay">
      <div className="inventory-viewer-modal">
        {/* Header */}
        <div className="inventory-viewer-header">
          <h2>📚 Inventario Completo del Museo Escolar</h2>
          <button 
            onClick={onClose}
            className="inventory-viewer-close"
            aria-label="Cerrar visor de inventario"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="inventory-viewer-content">
          {loading && (
            <div className="inventory-viewer-loading">
              <div className="loading-spinner"></div>
              <p>Cargando inventario completo...</p>
            </div>
          )}

          {error && (
            <div className="inventory-viewer-error">
              <p>❌ {error}</p>
              <button onClick={loadInventoryContent}>Reintentar</button>
            </div>
          )}

          {inventoryContent && !loading && (
            <div className="inventory-viewer-document">
              {inventoryContent.type === 'pdf' && (
                <iframe
                  src={inventoryContent.url}
                  title={inventoryContent.title}
                  className="inventory-pdf-viewer"
                  frameBorder="0"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="inventory-viewer-footer">
          <p>📋 Inventario completo con 357 objetos catalogados</p>
          <p>🏛️ Museo Escolar - E.E.S. N°3 Malvinas Argentinas</p>
        </div>
      </div>

      <style jsx>{`
        .inventory-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          padding: 20px;
        }

        .inventory-viewer-modal {
          background: white;
          border-radius: 12px;
          width: 95%;
          height: 95%;
          max-width: 1200px;
          max-height: 900px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .inventory-viewer-header {
          background: linear-gradient(135deg, #2c3e50, #3498db);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #34495e;
        }

        .inventory-viewer-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .inventory-viewer-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .inventory-viewer-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .inventory-viewer-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .inventory-viewer-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .inventory-viewer-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #e74c3c;
        }

        .inventory-viewer-error button {
          margin-top: 15px;
          padding: 10px 20px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .inventory-viewer-document {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .inventory-pdf-viewer {
          width: 100%;
          height: 100%;
          border: none;
          background: #f8f9fa;
        }

        .inventory-viewer-footer {
          background: #f8f9fa;
          padding: 15px 20px;
          border-top: 1px solid #dee2e6;
          text-align: center;
          color: #666;
        }

        .inventory-viewer-footer p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .inventory-viewer-modal {
            width: 98%;
            height: 98%;
            margin: 1%;
          }

          .inventory-viewer-header {
            padding: 15px;
          }

          .inventory-viewer-header h2 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InventoryViewer;