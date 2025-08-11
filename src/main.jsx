import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ChatProvider } from "./hooks/useChat";
import { AnimationProvider } from "./contexts/AnimationContext";
import "./index.css";
import LoadingScreen from "./components/LoadingScreen";

// Componente principal de la aplicación
const AppRoot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, setData] = useState(null);

  // Cargar los datos necesarios
  React.useEffect(() => {
    fetch("/data/Respuestas.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setIsDataLoaded(true);
      })
      .catch((error) => {
        console.error("Error cargando datos:", error);
        // Continuar incluso si hay un error al cargar los datos
        setIsDataLoaded(true);
      });
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
