import React, { useState, useEffect, useRef } from 'react';
import { DiagnosisResult, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { LockIcon, SynkIcon, AnimatedLogoIcon, EmergencyIcon } from './Icons';

interface PracticarPageProps {
  nickname: string;
  diagnosisResult: DiagnosisResult | null;
  successfulPractices: number;
  addPracticeSession: (prompt: string, answer: string, score: number, feedback: string) => void;
}

const scenarios = {
  social_anxiety: {
    title: "Iniciar una Conversación",
    module: "'Rompehielos'",
    character_name: "Alex",
    scenario: "Serás 'Alex', alguien nuevo que el usuario conoce en una cafetería local. El objetivo del usuario es iniciar una conversación contigo usando una pregunta abierta.",
    character_instructions: "Comienza diciendo 'Hola'. Responde positivamente si el usuario hace una buena pregunta. Si te devuelven una respuesta cerrada como 'hola', guíalos amablemente como El Coach para que lo intenten de nuevo.",
  },
  authenticity_boundaries: {
    title: "Establecer un Límite",
    module: "'Rechazar Cortésmente'",
    character_name: "Ben",
    scenario: "Serás 'Ben', un conocido amigable pero insistente. El objetivo del usuario es rechazar cortésmente tu petición de salir ahora mismo.",
    character_instructions: "Comienza charlando normalmente por un mensaje, luego pregunta al usuario si quiere ir al cine ahora mismo. Si dicen que no, sé un poco persistente (ej., '¡Oh, vamos, será divertido!'). Si dicen que no por segunda vez, cede y termina la escena positivamente.",
  },
  communication_gaps: {
    title: "Mantener una Conversación",
    module: "'Encontrando Conexiones'",
    character_name: "Sam",
    scenario: "Eres 'Sam', un/a nuevo/a colega. El usuario acaba de iniciar una conversación. Tus respuestas deben ser un poco breves, requiriendo que el usuario haga preguntas de seguimiento para mantener viva la conversación.",
    character_instructions: "El usuario comenzará. Responde a su pregunta, pero no ofrezcas mucha información extra a menos que hagan una pregunta de seguimiento. El objetivo es que practiquen profundizar más.",
  },
  social_energy: {
    title: "Una Charla de Bajo Riesgo",
    module: "'Práctica Suave'",
    character_name: "Casey",
    scenario: "Eres 'Casey', un/a bibliotecario/a amigable. El usuario está pidiendo una recomendación de libro. El objetivo es una interacción corta, positiva y de baja energía.",
    character_instructions: "Sé cálido/a y servicial. Mantén la conversación ligera y centrada en los libros. Termina la conversación después de 3-4 intercambios.",
  },
  general: {
    title: "Práctica General de Conversación",
    module: "'Charla Abierta'",
    character_name: "Jordan",
    scenario: "Eres 'Jordan', alguien a quien el usuario conoce a través de un amigo en común. El objetivo es simplemente tener una conversación agradable durante unos pocos intercambios.",
    character_instructions: "Sé un/a compañero/a de chat amigable y participativo/a. Habla sobre pasatiempos, planes de fin de semana u otros temas comunes.",
  }
};

const PracticarPage: React.FC<PracticarPageProps> = ({ nickname, diagnosisResult, successfulPractices, addPracticeSession }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentScenarioKey, setCurrentScenarioKey] = useState<keyof typeof scenarios | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentScenario = currentScenarioKey ? scenarios[currentScenarioKey] : null;

  useEffect(() => {
    if (diagnosisResult) {
      if (!currentScenarioKey) {
        const recommended = diagnosisResult.recommended_scenario as keyof typeof scenarios;
        setCurrentScenarioKey(scenarios[recommended] ? recommended : 'general');
      }
    } else {
        setIsLoading(false);
    }
  }, [diagnosisResult, currentScenarioKey]);

  useEffect(() => {
    if (currentScenarioKey) {
        initializeChat(currentScenarioKey);
    }
  }, [currentScenarioKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (currentScenarioKey && chatHistory.length > 0 && !sessionComplete) {
      localStorage.setItem(`synk-chat-practicar-${currentScenarioKey}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, currentScenarioKey, sessionComplete]);


  const initializeChat = async (scenarioKey: keyof typeof scenarios) => {
    setIsLoading(true);
    setChatHistory([]);
    setSessionComplete(false);
    
    const scenarioForChat = scenarios[scenarioKey];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemPrompt = `Eres el "Coach de Entrenamiento de IA de Synk". Tu único propósito es ayudar a un usuario a practicar habilidades de comunicación en un entorno seguro y simulado. Debes seguir estas reglas en todo momento:

**DIRECTIVAS PRINCIPALES:**
1.  **DOBLE PERSONAJE:** Tienes dos identidades: "El Coach" (tu yo primario, empático, un maestro) y "El Personaje de Rol" (tu yo secundario). Cuando hables como un personaje, DEBES encerrar tu texto en asteriscos. (ej., *¿Ah, sí? Cuéntame más.*)

2.  **USA EL ESCENARIO:** Se te darán instrucciones para un escenario específico. Todo el entrenamiento DEBE basarse en estas instrucciones.

3.  **EL CICLO DE RETROALIMENTACIÓN (LO MÁS IMPORTANTE):** Si el mensaje del usuario es bueno, primero responde como "El Coach" (ej., "¡Gran trabajo haciendo una pregunta de seguimiento!"). Luego, responde inmediatamente como "El Personaje de Rol" para continuar la conversación. Si el mensaje del usuario es débil o no cumple el objetivo, DEBES pausar el roleplay. Responde ÚNICAMENTE como "El Coach", da una corrección amable y pídeles que "intenten esa frase de nuevo".

4.  **TONO Y SEGURIDAD:** Como "El Coach," siempre eres paciente y positivo. Como "El Personaje de Rol," nunca debes ser abusivo, agresivo o sexual. Mantente seguro.

5. **FINALIZANDO LA ESCENA**: Después de unos pocos intercambios exitosos (3-5 mensajes), concluye el ejercicio. Responde como "El Coach" con un resumen positivo final, y DEBES terminar tu mensaje con la frase exacta "¡Has ganado la insignia '[NOMBRE_DEL_MÓDULO]'!". Por ejemplo: "¡Has ganado la insignia 'Rompehielos'!".`;
    
    const savedHistoryRaw = localStorage.getItem(`synk-chat-practicar-${scenarioKey}`);
    const savedHistory = savedHistoryRaw ? JSON.parse(savedHistoryRaw) as ChatMessage[] : null;
    
    if (savedHistory && savedHistory.length > 0) {
        setChatHistory(savedHistory);
        const historyForAI = savedHistory.map((msg: ChatMessage) => ({
            role: msg.role === 'error' ? 'model' : msg.role, // Treat previous errors as model history for context
            parts: [{ text: msg.content }]
        }));
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: historyForAI,
            config: { systemInstruction: systemPrompt },
        });
        setChat(newChat);
        setIsLoading(false);
    } else {
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: systemPrompt },
        });
        setChat(newChat);

        const firstMessage = `[REPORTE_DIAGNÓSTICO]: {main_challenge: '${diagnosisResult?.main_challenge || 'general'}'}
[MÓDULO_ACTUAL]: ${scenarioForChat.module}
[ESCENARIO]: ${scenarioForChat.scenario}
[INSTRUCCIONES_PERSONAJE_IA]: ${scenarioForChat.character_instructions}

[MENSAJE_INICIAL_DEL_COACH_IA]: "¡Bienvenido/a, ${nickname}, a tu próxima sesión de práctica! Basado en tu chequeo, vamos a trabajar en **${scenarioForChat.title}**. Para este escenario, seré '${scenarioForChat.character_name}'. Tu objetivo es practicar tus habilidades en un espacio seguro. Te daré retroalimentación en el camino. ¿Listo/a para empezar?"`;

        try {
          const response = await newChat.sendMessage({ message: firstMessage });
          setChatHistory([{ role: 'model', content: response.text }]);
        } catch (e) {
          console.error("Error en la inicialización del chat:", e);
          let errorMessage = "Lo siento, ocurrió un error al iniciar la práctica. Por favor, intenta de nuevo.";
          if (e instanceof Error && (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429'))) {
              errorMessage = "Se ha excedido el límite de solicitudes a la IA. La conversación está en pausa. Por favor, inténtalo de nuevo en unos minutos.";
          }
          setChatHistory([{ role: 'error', content: errorMessage }]);
        } finally {
          setIsLoading(false);
        }
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading || sessionComplete || !currentScenarioKey) return;

    const text = userInput;
    setUserInput('');
    
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: text });
      const modelResponseText = response.text;
      
      setChatHistory(prev => [...prev, { role: 'model', content: modelResponseText }]);

      if (modelResponseText.includes("insignia") && currentScenarioKey) {
          setSessionComplete(true);
          const completedScenario = scenarios[currentScenarioKey];
          addPracticeSession(completedScenario.title, `Completó el módulo ${completedScenario.module}.`, 100, "Sesión completa!");
          localStorage.removeItem(`synk-chat-practicar-${currentScenarioKey}`);
      }
    } catch (e) {
      console.error("Error al enviar mensaje:", e);
      let errorMessage = "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.";
      if (e instanceof Error && (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429'))) {
          errorMessage = "Se ha excedido el límite de solicitudes a la IA. La conversación está en pausa. Por favor, inténtalo de nuevo en unos minutos.";
      }
      setChatHistory(prev => [...prev, { role: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = () => {
    if (currentScenarioKey) {
      localStorage.removeItem(`synk-chat-practicar-${currentScenarioKey}`);
    }
    setChat(null);
    setChatHistory([]);
    setSessionComplete(false);
    setCurrentScenarioKey(null);
    setIsLoading(true);
  };

  const handleStartNewSession = (key: keyof typeof scenarios) => {
    setCurrentScenarioKey(key);
  }

  const parseMessage = (content: string) => {
    const parts = content.split(/(\*.*?\*)/g).filter(part => part);
    return parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="block bg-brand-surface/80 p-3 rounded-lg my-1 not-italic border border-brand-primary/50">{part.slice(1, -1)}</em>;
        }
        return <p key={index} className="py-1">{part}</p>;
    });
  };

  if (!diagnosisResult) {
    return (
        <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
            <LockIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary mb-4">Práctica Bloqueada</h2>
            <p className="text-brand-text-dim">Por favor, completa tu chequeo inicial en la pestaña "Chequeo" para desbloquear el entrenamiento personalizado con IA.</p>
        </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
        <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-brand-title animate-pulse">Cargando Práctica...</h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-200px)] animate-fade-in">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-title mb-2">Práctica: {currentScenario.title}</h2>
        <p className="text-brand-text-dim">Completa 3 prácticas para desbloquear la siguiente fase. ({successfulPractices}/3)</p>
      </div>
      
      <div className="flex-grow bg-brand-surface/50 rounded-xl p-4 overflow-y-auto space-y-4 mb-4 border border-brand-primary/50">
        {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <SynkIcon className="w-6 h-6 flex-shrink-0" />}
                {msg.role === 'error' && <EmergencyIcon className="w-6 h-6 flex-shrink-0 text-red-500" />}
                <div className={`max-w-xl p-3 px-4 rounded-2xl ${
                    msg.role === 'user' ? 'bg-gradient-to-br from-brand-accent to-orange-500 text-white rounded-br-none' :
                    msg.role === 'model' ? 'bg-white border border-brand-primary/80 text-brand-text rounded-bl-none' :
                    'bg-red-100 border border-red-200 text-red-800 rounded-bl-none'
                }`}>
                    {msg.role === 'model' ? parseMessage(msg.content) : msg.content}
                </div>
            </div>
        ))}
        {isLoading && !sessionComplete && (
            <div className="flex justify-start">
                <div className="max-w-xl p-3 px-4 rounded-2xl bg-white border border-brand-primary/80 flex items-center gap-2">
                    <SynkIcon className="w-5 h-5 animate-pulse" />
                    <span className="text-brand-text-dim">El Coach está escribiendo...</span>
                </div>
            </div>
        )}
        {sessionComplete && (
            <div className="p-4 bg-brand-success/20 text-teal-800 rounded-lg text-center border border-brand-success/50">
                <h3 className="font-bold text-lg mb-2">¡Práctica Completada!</h3>
                <p>Has terminado este módulo con éxito. ¿Listo/a para otra ronda? Elige un nuevo escenario a continuación.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                        <button 
                            key={key}
                            onClick={() => handleStartNewSession(key as keyof typeof scenarios)}
                            className="w-full bg-white hover:bg-brand-secondary/50 text-brand-text font-bold py-3 px-4 rounded-lg transition-colors text-left border border-brand-primary"
                        >
                            <span className="font-bold block">{scenario.title}</span>
                            <span className="text-sm text-brand-text-dim">{scenario.module}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-4">
        <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={sessionComplete ? "Elige un nuevo escenario arriba" : "Escribe tu respuesta..."}
            disabled={isLoading || sessionComplete}
            className="flex-grow p-3 bg-brand-surface rounded-lg border-2 border-brand-primary focus:border-brand-accent focus:outline-none transition-colors disabled:opacity-50"
        />
        <button type="submit" disabled={isLoading || sessionComplete} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Enviar
        </button>
      </form>
      {!sessionComplete && (
        <button onClick={handleEndSession} className="text-center text-sm text-brand-text-dim hover:text-brand-text mt-4">
          Finalizar Práctica
        </button>
      )}
    </div>
  );
};

export default PracticarPage;