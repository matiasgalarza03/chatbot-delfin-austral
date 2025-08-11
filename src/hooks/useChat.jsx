import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [message, setMessage] = useState(null);

  // Procesar mensaje del usuario con DeepSeek-R1 usando fetch
  const chat = async (userMessage) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente virtual amigable y servicial. SIEMPRE responde únicamente en español, sin importar el idioma de la pregunta. Si el usuario pregunta en otro idioma, responde en español. Sé claro, conciso y natural. Responde de manera completa y detallada.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ]
        }),
      });
      const data = await response.json();
      let botResponse = data.message?.content || data.message || data.content || data;
      if (!botResponse || (typeof botResponse === 'string' && botResponse.trim() === '')) {
        botResponse = 'Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo o haz otra pregunta.';
      }
      const message = {
        text: botResponse,
        audio: null,
        lipsync: [],
        facialExpression: "smile",
        animation: "Swim",
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    } catch (error) {
      console.error('Error al obtener respuesta del modelo:', error);
      const errorMessage = {
        text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        audio: null,
        lipsync: [],
        facialExpression: "sad",
        animation: "Swim",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  const onMessagePlayed = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
