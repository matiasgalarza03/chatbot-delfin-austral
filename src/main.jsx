import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ChatProvider } from "./hooks/useChat";
import { AnimationProvider } from "./contexts/AnimationContext";
import { getDataPath } from "./utils/pathUtils";
import "./index.css";
import LoadingScreen from "./components/LoadingScreen";

// Componente principal de la aplicación
const AppRoot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, setData] = useState(null);

  // Cargar los datos necesarios
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(getDataPath("respuestas.json"));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        // Intentar cargar desde ruta alternativa en caso de error
        try {
          const fallbackResponse = await fetch("/data/respuestas.json");
          if (fallbackResponse.ok) {
            const jsonData = await fallbackResponse.json();
            setData(jsonData);
          }
        } catch (fallbackError) {
          console.error("Error en carga alternativa de datos:", fallbackError);
        }
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // Cargar la aplicación real de forma diferida
  const App = React.lazy(() => import("./App"));

  // Mostrar pantalla de carga personalizada
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // Mostrar la aplicación principal una vez que los datos estén cargados
  return (
    <React.Suspense
      fallback={
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "white",
          fontSize: "24px",
          zIndex: 10000,
        }}>
          <div>Cargando aplicación...</div>
        </div>
      }
    >
      <App data={data} isDataLoaded={isDataLoaded} />
    </React.Suspense>
  );
};

// Componente wrapper para mantener la compatibilidad
const SimpleApp = () => {
  return <AppRoot />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <AnimationProvider>
        <SimpleApp />
      </AnimationProvider>
    </ChatProvider>
  </React.StrictMode>,
);
