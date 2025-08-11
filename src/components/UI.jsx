import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { InventorySearch } from "./InventorySearch";
import InventoryModal from "./InventoryModal";
// 🚫 AUDIO DESHABILITADO - manejado por audioManagerFinal
// import { playResponseAudio, stopCurrentAudio } from "../utils/audioManager";

// Importar Montserrat desde Google Fonts (solo una vez en el proyecto, idealmente en index.html)
if (typeof document !== 'undefined' && !document.getElementById('montserrat-font')) {
  const link = document.createElement('link');
  link.id = 'montserrat-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap';
  document.head.appendChild(link);
}

// Preguntas y respuestas preestablecidas
const PRESET_QA = [
  {
    question: "¿Dónde vives?",
    answer: "Vivo en las costas de Argentina y Chile, y suelo visitar las aguas de las Islas Malvinas.",
  },
  {
    question: "¿Qué es el Museo Escolar?",
    answer: "El Museo Escolar de la Escuela de Educación Secundaria N°3 Malvinas Argentinas es un espacio dedicado a la historia y cultura de las Islas Malvinas y la región. Puedes encontrar más información sobre el museo y sus colecciones en la sección 'Museo Escolar' del menú principal.",
  },
  {
    question: "¿Por qué eres un delfín?",
    answer: "Soy un delfín austral porque represento la fauna marina de la región y me encanta interactuar con los visitantes del museo.",
  },
  // Se eliminó la opción de búsqueda de inventario ya que ahora está integrada en el menú del Museo Escolar
];

function splitSentences(text) {
  // Divide en oraciones usando punto, exclamación o interrogación
  return text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g)?.map(s => s.trim()).filter(Boolean) || [text];
}

// Icono de configuración SVG (nuevo, engranaje)
const ConfigIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#0a2233" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="6.5"/><path d="M14 2.5v3M14 22.5v3M4.5 14h-3M26.5 14h-3M6.36 6.36l-2.12-2.12M23.76 23.76l-2.12-2.12M6.36 21.64l-2.12 2.12M23.76 4.24l-2.12 2.12"/></svg>
);

export const UI = ({ hidden, ...props }) => {
  const { chat } = useChat();
  const [showPresets, setShowPresets] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [currentSentence, setCurrentSentence] = useState("");
  const [sentences, setSentences] = useState([]);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [lastUser, setLastUser] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [donePetitions, setDonePetitions] = useState([]);
  const [displayedWords, setDisplayedWords] = useState("");
  const wordIntervalRef = useRef(null);
  const [showConfig, setShowConfig] = useState(false);
  const [botName, setBotName] = useState("Delfín");
  const [bgColor, setBgColor] = useState("#EFE9E9");
  const colorOptions = ["#EFE9E9", "#F8FAFC", "#F1F5F9", "#E0F2FE", "#F3D1D1", "#E6D1F3", "#FFE5B4", "#FEF9C3"];
  const [progreso, setProgreso] = useState(0);
  const [mensajeProgreso, setMensajeProgreso] = useState('Iniciando integración...');
  const [respuestas, setRespuestas] = useState(null);
  const [gruposListos, setGruposListos] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  // Reset total
  const handleReset = () => {
    console.log("🔄 Reiniciando aplicación desde UI - Botón esquina superior izquierda");
    setShowPresets(false);
    setIsBotSpeaking(false);
    setCurrentSentence("");
    setSentences([]);
    setSentenceIdx(0);
    setLastUser(null);
    setShowPopup(true);
    setHistory([]);
    setDonePetitions([]);
    setJustSelected(false);
    setDisplayedWords("");
    setShowConfig(false);
    setHistoryOpen(false);
    if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    
    // 🎯 RESETEAR PREGUNTAS VISITADAS
    if (onResetPreguntasVisitadas) {
      onResetPreguntasVisitadas();
      console.log("🔄 ✅ Preguntas visitadas reseteadas desde botón principal UI");
    }
  };

  // Maneja la síntesis de voz y detecta cuando termina
  const speak = (text, onEnd, onWord) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        let spanishVoice = voices.find(voice => voice.lang === 'es-ES');
        if (!spanishVoice) {
          spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
        }
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        utterance.onend = onEnd;
        utterance.onboundary = (event) => {
          if (event.name === 'word' && onWord) {
            onWord(event.charIndex);
          }
        };
        window.speechSynthesis.speak(utterance);
      };
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }
    } else {
      if (onEnd) onEnd();
    }
  };

  // Mostrar respuesta de a dos oraciones progresivamente
  useEffect(() => {
    if (sentences.length > 0 && sentenceIdx < sentences.length) {
      setCurrentSentence("");
      setDisplayedWords("");
      setTimeout(() => {
        // Mostrar de a dos oraciones, pero asegurar que no se corte la respuesta
        const remainingSentences = sentences.length - sentenceIdx;
        const sentencesToShow = Math.min(2, remainingSentences);
        const nextSentences = sentences.slice(sentenceIdx, sentenceIdx + sentencesToShow).join(" ");
        
        // Verificar que tenemos contenido válido
        if (!nextSentences || nextSentences.trim() === '') {
          console.error('Oraciones vacías detectadas, saltando al siguiente índice');
          setSentenceIdx(idx => idx + sentencesToShow);
          return;
        }
        
        setCurrentSentence(nextSentences);
        // Animación palabra por palabra
        const words = nextSentences.split(" ").filter(word => word.trim() !== '');
        let wordIdx = 0;
        setDisplayedWords("");
        if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
        wordIntervalRef.current = setInterval(() => {
          wordIdx++;
          setDisplayedWords(words.slice(0, wordIdx).join(" "));
          if (wordIdx >= words.length) {
            clearInterval(wordIntervalRef.current);
          }
        }, 120);
        // Voz sincronizada
        speak(nextSentences, () => {
          setTimeout(() => {
            setCurrentSentence("");
            setDisplayedWords("");
            setSentenceIdx(idx => idx + sentencesToShow);
          }, 400);
        });
      }, 300);
    } else if (sentences.length > 0 && sentenceIdx >= sentences.length) {
      // Asegurar que la respuesta se completó totalmente antes de continuar
      setTimeout(() => {
        setIsBotSpeaking(false);
        // Mostrar las preguntas después de completar la respuesta
        setTimeout(() => {
          setShowPresets(true);
          setDonePetitions((prev) => lastUser ? [...prev, lastUser] : prev);
        }, 500); // Dar más tiempo para que se complete la visualización
      }, 800); // Tiempo adicional para asegurar que se vea la respuesta completa
    }
    return () => {
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    };
  }, [sentences, sentenceIdx]);

  // Al seleccionar una pregunta preestablecida
  const handlePresetClick = (preset) => {
    // Si es el buscador de inventario, mostrarlo y no procesar como mensaje normal
    if (preset.isInventorySearch) {
      setShowInventorySearch(true);
      return;
    }
    
    // Asegurar que tenemos una respuesta completa
    if (!preset.answer || preset.answer.trim() === '') {
      console.error('Respuesta vacía o indefinida para la pregunta:', preset.question);
      return;
    }
    
    // 🚫 AUDIO DESHABILITADO - manejado por audioManagerFinal
    // stopCurrentAudio();
    
    // Comportamiento normal para otras preguntas
    setShowPresets(false);
    setIsBotSpeaking(true);
    setLastUser(preset.question);
    setJustSelected(true);
    
    // Asegurar que la respuesta se procese completamente
    const fullAnswer = preset.answer.trim();
    const sents = splitSentences(fullAnswer);
    
    // Verificar que tenemos oraciones válidas
    if (sents.length === 0) {
      console.error('No se pudieron procesar las oraciones de la respuesta:', fullAnswer);
      setSentences([fullAnswer]); // Usar la respuesta completa como fallback
    } else {
      setSentences(sents);
    }
    
    // 🚫 AUDIO DESHABILITADO - manejado por RespuestaPredefinida.jsx
    console.log('🚫 UI.jsx playResponseAudio DESHABILITADO');
    // playResponseAudio(
    //   'ui_basicas', 
    //   preset.question,
    //   null,
    //   () => {
    //     console.log('🎵 Audio de respuesta terminado');
    //   },
    //   (error) => {
    //     console.warn('🎵 No se pudo reproducir audio, continuando solo con texto:', error.message);
    //   }
    // );
    
    setSentenceIdx(0);
    setHistory((prev) => [...prev, { q: preset.question, a: fullAnswer }]);
  };

  // Cuando termina la animación de la petición seleccionada
  useEffect(() => {
    if (!isBotSpeaking && justSelected) {
      setTimeout(() => setJustSelected(false), 400);
    }
  }, [isBotSpeaking, justSelected]);

  // Cargar y parsear Respuestas.json al iniciar
  useEffect(() => {
    setProgreso(10);
    setMensajeProgreso('Cargando datos de preguntas y respuestas...');
    fetch('/src/data/Respuestas.json')
      .then(res => res.json())
      .then(data => {
        setProgreso(30);
        setMensajeProgreso('Datos cargados. Preparando grupos...');
        setRespuestas(data);
        setTimeout(() => {
          setProgreso(50);
          setMensajeProgreso('Grupos listos para mostrar.');
          setGruposListos(true);
        }, 800);
      });
  }, []);

  // Renderizar los íconos de los grupos alrededor del delfín
  const renderGrupos = () => {
    if (!respuestas) return null;
    const grupos = Object.entries(respuestas);
    // Posiciones relativas para los 4 íconos (arriba, izquierda, derecha, abajo)
    const posiciones = [
      { top: '18%', left: '50%', transform: 'translate(-50%, -50%)' }, // arriba
      { top: '50%', left: '18%', transform: 'translate(-50%, -50%)' }, // izquierda
      { top: '50%', left: '82%', transform: 'translate(-50%, -50%)' }, // derecha
      { top: '82%', left: '50%', transform: 'translate(-50%, -50%)' }, // abajo
    ];
    return grupos.map(([key, grupo], idx) => (
      <button
        key={key}
        style={{
          position: 'fixed',
          ...posiciones[idx],
          zIndex: 100,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#f3f4f6',
          border: grupoSeleccionado === key ? '4px solid #0ea5e9' : '2px solid #64748b',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1em',
          color: '#0a2233',
          cursor: 'pointer',
          transition: 'border 0.2s, background 0.2s',
          pointerEvents: 'auto',
        }}
        onClick={() => {
          setGrupoSeleccionado(key);
          setProgreso(70);
          setMensajeProgreso(`Grupo "${grupo.nombre}" seleccionado. Mostrando temas...`);
        }}
      >
        {grupo.nombre}
      </button>
    ));
  };

  if (hidden) return null;

  return (
    <>
      {/* Pop-up en la esquina superior izquierda */}
      {showPopup && (
        <div
          className="popup-question"
          style={{
            position: "fixed",
            top: 32,
            left: 32,
            zIndex: 50,
            background: "rgba(30, 41, 59, 0.92)",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
            padding: "18px 28px",
            fontSize: "1.1rem",
            fontWeight: 500,
            letterSpacing: 0.2,
            maxWidth: 320,
            pointerEvents: "auto",
            border: "2px solid #000",
            animation: "fadeInPopup 0.7s",
            fontFamily: 'Montserrat',
            textAlign: 'center',
          }}
        >
          Selecciona tu pregunta para comenzar
        </div>
      )}
      <style>{`
        html, body, #root {
          font-family: 'Montserrat', Arial, sans-serif !important;
          font-size: 1.092em !important;
        }
        @keyframes fadeInPopup {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-sentence {
          animation: fadeSentence 0.5s;
        }
        @keyframes fadeSentence {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .reset-btn, .history-btn, .config-btn, .inventory-btn {
          position: fixed;
          right: 32px;
          z-index: 60;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 2px solid #0a2233;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .reset-btn:hover, .history-btn:hover, .config-btn:hover {
          background: #64748b;
          transform: scale(1.12);
        }
        .reset-btn { top: 32px; }
        .history-btn { top: 90px; }
        .config-btn { top: 148px; }
        .reset-btn svg, .history-btn svg, .config-btn svg {
          stroke: #0a2233 !important;
        }
        .option-btn {
          font-family: 'Montserrat', Arial, sans-serif !important;
          font-size: 1em !important;
          text-align: center !important;
          transition: transform 0.18s;
          background: #e5e7eb;
          color: #0a2233;
        }
        .option-btn:hover {
          transform: scale(1.06);
          background: #cbd5e1;
        }
        .option-btn.done {
          background: #a3a3a3 !important;
          color: #64748b !important;
          opacity: 0.6;
        }
        .option-btn.selected {
          background: #f1f5f9 !important;
          color: #334155 !important;
          border: 2px solid #0a2233 !important;
          animation: fadeSentence 0.5s;
        }
        .bot-response {
          display: block;
          max-width: 90vw;
          margin: 0 auto;
          font-size: 1.68em;
          font-weight: 400;
          color: #0a2233;
          background: none;
          text-align: center;
          margin-top: 7vh;
          margin-bottom: 0;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        .bot-response.initial {
          margin-top: 13vh;
        }
        .name-input {
          background: #fff !important;
          color: #0a2233 !important;
          border: 2px solid #0a2233 !important;
        }
        .chat-history-container {
          position: fixed;
          top: 150px;
          right: 32px;
          z-index: 100;
          background: rgba(255,255,255,0.98);
          border-radius: 16px;
          box-shadow: 0 4px 24px 0 rgba(0,0,0,0.15);
          padding: 24px 32px;
          min-width: 320px;
          max-width: 400px;
          max-height: 400px;
          overflow-y: auto;
          font-family: 'Montserrat';
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.98em;
        }
        .chat-bubble {
          max-width: 70%;
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 0.95em;
          margin-bottom: 4px;
          word-break: break-word;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
        }
        .bubble-user {
          background: #e0f2fe;
          color: #0a2233;
          align-self: flex-start;
          border-bottom-left-radius: 6px;
        }
        .bubble-bot {
          background: #f1f5f9;
          color: #0a2233;
          align-self: flex-end;
          border-bottom-right-radius: 6px;
          margin-top: 16px;
        }
        .popup-question {
          border: 2px solid #000 !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-scale {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }
        .pregunta-bloque-animado {
          animation: float-scale 6s ease-in-out infinite;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          will-change: transform;
        }
        .pregunta-bloque-animado:hover {
          transform: scale(1.12);
          z-index: 10;
        }
      `}</style>
      {/* Botón de reset circular */}
      {!showPresets && (
        <button className="reset-btn" title="Reiniciar conversación" onClick={handleReset}>
          <svg width="24" height="24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 9a9 9 0 1 0 2.13-3.36L1 10"/></svg>
        </button>
      )}
      {/* Botón de historial circular */}
      {!showPresets && (
        <button className="history-btn" title="Ver historial" onClick={() => setHistoryOpen(h => !h)}>
          <svg width="24" height="24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </button>
      )}
      {/* Botón de configuración circular */}
      {!showPresets && (
        <button className="config-btn" title="Configuración" onClick={() => setShowConfig(v => !v)}>
          <ConfigIcon />
        </button>
      )}
      
      {/* Botón de búsqueda de inventario */}
      {!showPresets && (
        <button 
          className="inventory-btn" 
          title="Buscar en inventario" 
          onClick={() => setShowInventorySearch(true)}
          style={{
            position: 'fixed',
            right: '32px',
            top: 'calc(120px + 56px + 16px)', // Debajo del botón de configuración
            zIndex: 60,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#cbd5e1',
            border: '2px solid #0a2233',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              background: '#94a3b8',
              transform: 'scale(1.05)'
            }
          }}
        >
          <svg width="24" height="24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      )}
      {/* Panel de configuración */}
      {showConfig && (
        <div style={{
          position: 'fixed',
          top: 210,
          right: 32,
          zIndex: 100,
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
          padding: '24px 32px',
          minWidth: 320,
          maxWidth: 400,
          fontFamily: 'Montserrat',
        }}>
          <div style={{fontWeight: 700, fontSize: '1.1em', marginBottom: 12, textAlign: 'center'}}>Configuración</div>
          <form onSubmit={e => { e.preventDefault(); setShowConfig(false); }}>
            <div style={{marginBottom: 16}}>
              <label style={{fontWeight: 500}}>Nombre del chatbot:</label>
              <input type="text" value={botName} onChange={e => setBotName(e.target.value)} style={{width: '100%', padding: 8, borderRadius: 8, border: '1px solid #38bdf8', marginTop: 6}} />
            </div>
            <div style={{marginBottom: 16}}>
              <label style={{fontWeight: 500}}>Color de fondo:</label>
              <div style={{display: 'flex', gap: 8, marginTop: 6}}>
                {colorOptions.map((color, idx) => (
                  <div key={color} style={{width: 32, height: 32, borderRadius: '50%', background: color, border: bgColor === color ? '2px solid #38bdf8' : '2px solid #e5e7eb', cursor: 'pointer', transition: 'transform 0.18s'}}
                    onClick={() => setBgColor(color)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="option-btn" style={{width: '100%', marginTop: 12, background: '#38bdf8', color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600}}>Guardar</button>
          </form>
        </div>
      )}
      {/* Historial de conversación */}
      {historyOpen && (
        <div className="chat-history-container">
          <div style={{fontWeight: 700, fontSize: '1.1em', marginBottom: 12, textAlign: 'center'}}>Historial de conversación</div>
          {history.length === 0 && <div style={{color: '#64748b', textAlign: 'center'}}>Sin mensajes aún.</div>}
          {history.map((item, idx) => (
            <div key={idx} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10}}>
              <div className="chat-bubble bubble-user">{item.q}</div>
              <div className="chat-bubble bubble-bot">{item.a}</div>
            </div>
          ))}
        </div>
      )}
      <div className="fixed left-0 right-0 bottom-0 z-10 flex flex-col items-center pointer-events-none" style={{fontFamily: 'Montserrat', fontSize: '1.092em'}}>
        {/* Conversación: solo mostrar la última pregunta del usuario y la oración actual del bot */}
        <div className="w-full max-w-screen-sm mx-auto mb-2 min-h-[80px] flex flex-col items-center pointer-events-auto" style={{alignItems: 'center', justifyContent: 'center'}}>
          {/* Mostrar solo la respuesta del bot cuando está hablando, sin mostrar la petición anterior */}
          {isBotSpeaking && currentSentence && (
            <div className="mb-2 flex justify-center w-full">
              <span className={`bot-response${showPresets ? ' initial' : ''}`}>{displayedWords}</span>
            </div>
          )}
        </div>
        {/* Preguntas preestablecidas después de la intro */}
        {showPresets && !isBotSpeaking && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto 20px auto',
            pointerEvents: 'auto',
            padding: '0 16px',
            transition: 'all 0.3s ease-in-out'
          }}>
            {PRESET_QA.map((preset, idx) => (
              <div 
                key={idx}
                className="pregunta-bloque-animado"
                style={{
                  position: 'relative',
                  marginBottom: '12px',
                  animationDelay: `${idx * 0.2}s`,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <button
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    color: '#0f172a',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    textAlign: 'left',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.95em',
                    fontWeight: 500,
                    fontFamily: 'Montserrat, sans-serif',
                    cursor: 'pointer',
                    lineHeight: '1.5',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 1,
                  }}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.question}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mostrar el contador de progreso en la esquina superior derecha */}
      <div style={{
        position: 'fixed',
        top: 32,
        right: 32,
        zIndex: 1000,
        background: 'rgba(30,41,59,0.92)',
        color: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
        padding: '14px 22px',
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: 0.2,
        maxWidth: 320,
        pointerEvents: 'auto',
        border: '2px solid #000',
        textAlign: 'center',
        display: progreso < 100 ? 'block' : 'none'
      }}>
        <div>Progreso de integración</div>
        <div style={{fontSize: '2em', margin: '6px 0'}}>{progreso}%</div>
        <div style={{fontSize: '0.95em', fontWeight: 400}}>{mensajeProgreso}</div>
      </div>
      {/* Mostrar los íconos de los grupos si están listos y no hay grupo seleccionado */}
      {gruposListos && !grupoSeleccionado && renderGrupos()}
      
      {/* Mostrar el buscador de inventario cuando esté activo */}
      {showInventorySearch ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            position: 'relative',
            width: '95%',
            maxWidth: '1000px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxHeight: '95vh',
            overflowY: 'auto',
            boxShadow: '0 10px 50px rgba(0,0,0,0.3)'
          }}>
            <button 
              onClick={() => setShowInventorySearch(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748b',
                zIndex: 1001,
                transition: 'all 0.2s ease',
                ':hover': {
                  background: '#e2e8f0',
                  color: '#475569'
                }
              }}
              aria-label="Cerrar buscador de inventario"
            >
              ×
            </button>
            <InventorySearch onClose={() => setShowInventorySearch(false)} />
          </div>
        </div>
      ) : (
        <div className="fixed left-0 right-0 bottom-0 z-10 flex flex-col items-center pointer-events-none" style={{fontFamily: 'Montserrat', fontSize: '1.092em'}}>
          {/* Conversación: solo mostrar la última pregunta del usuario y la oración actual del bot */}
          <div className="w-full max-w-screen-sm mx-auto mb-2 min-h-[80px] flex flex-col items-center pointer-events-auto" style={{alignItems: 'center', justifyContent: 'center'}}>
            {/* Mostrar solo la respuesta del bot cuando está hablando, sin mostrar la petición anterior */}
            {isBotSpeaking && currentSentence && (
              <div className="mb-2 flex justify-center w-full">
                <span className={`bot-response${showPresets ? ' initial' : ''}`}>{displayedWords}</span>
              </div>
            )}
          </div>
          {/* Preguntas preestablecidas después de la intro */}
          {/* BLOQUE ELIMINADO: aquí estaba el bloque duplicado sin animación */}
        </div>
      )}

      {/* Modal del Inventario del Museo */}
      <InventoryModal 
        isOpen={showInventoryModal} 
        onClose={() => setShowInventoryModal(false)} 
      />
    </>
  );
};
