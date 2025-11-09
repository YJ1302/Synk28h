import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LockIcon, SparklesIcon, Avatar1, Avatar2, Avatar3, Avatar4, EmergencyIcon } from './Icons';
import { ChatbotProfile, ChatMessage, DiagnosisResult } from '../types';
import { CHATBOT_PROFILES } from '../constants';
import { GoogleGenAI, Chat } from "@google/genai";


interface ConectarPageProps {
  isUnlocked: boolean;
  score: number;
  nickname: string;
  diagnosisResult: DiagnosisResult | null;
}

const avatarMap = {
  avatar1: Avatar1,
  avatar2: Avatar2,
  avatar3: Avatar3,
  avatar4: Avatar4,
};


const ConectarPage: React.FC<ConectarPageProps> = ({ isUnlocked, score, nickname, diagnosisResult }) => {
  const [selectedProfile, setSelectedProfile] = useState<ChatbotProfile | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const recommendedProfileId = useMemo(() => {
    if (!diagnosisResult) return null;
    
    const scenario = diagnosisResult.recommended_scenario;
    if (scenario === 'social_anxiety' || scenario === 'social_energy') return 'mateo';
    if (scenario === 'authenticity_boundaries') return 'clara';
    if (scenario === 'communication_gaps') return 'leo';
    
    switch (diagnosisResult.main_challenge) {
      case 'social_anxiety': return 'mateo';
      case 'boundary_issues': return 'clara';
      case 'communication_gaps': return 'leo';
      case 'authenticity_doubt': return 'sofia';
      default: return 'leo';
    }
  }, [diagnosisResult]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (selectedProfile && chatHistory.length > 0) {
      localStorage.setItem(`synk-chat-conectar-${selectedProfile.id}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, selectedProfile]);

  const initializeChat = async (profile: ChatbotProfile) => {
    setSelectedProfile(profile);
    setIsLoading(true);
    setChatHistory([]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `Eres un personaje de chatbot llamado ${profile.name}. Tu personalidad se describe como: ${profile.personality.join(', ')}.
Tu biografía es: "${profile.bio}".
Debes conversar con el usuario, ${nickname}, manteniéndote siempre fiel a tu personaje. No reveles que eres una IA. Simplemente actúa como ${profile.name}. Sé amigable, interesante y mantén la conversación fluyendo de forma natural. Tu primera respuesta debe ser un saludo inicial que refleje tu personalidad.`;

    const savedHistoryRaw = localStorage.getItem(`synk-chat-conectar-${profile.id}`);
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

      try {
        const response = await newChat.sendMessage({ message: "Hola" });
        setChatHistory([{ role: 'model', content: response.text }]);
      } catch (e) {
        console.error("Error en la inicialización del chat:", e);
        let errorMessage = "Lo siento, ocurrió un error al iniciar el chat. Por favor, intenta de nuevo.";
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
    if (!userInput.trim() || !chat || isLoading) return;

    const text = userInput;
    setUserInput('');
    
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: text });
      setChatHistory(prev => [...prev, { role: 'model', content: response.text }]);
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

  const handleEndChat = () => {
    setSelectedProfile(null);
    setChat(null);
    setChatHistory([]);
  };

  if (!isUnlocked) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
        <div className="w-full max-w-md bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-primary/50">
          <LockIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary mb-4">Página Bloqueada</h2>
          <p className="text-brand-text-dim mb-6">Completa tu chequeo y 3 sesiones de práctica para desbloquear esta sección y conocer a nuestros perfiles de IA.</p>
        </div>
      </div>
    );
  }

  if (selectedProfile) {
    const AvatarComponent = avatarMap[selectedProfile.avatar];
    return (
       <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-200px)] animate-fade-in">
        <div className="flex items-center mb-4">
          <button onClick={handleEndChat} className="text-brand-accent font-semibold mr-4 hover:underline">&larr; Guardar y Volver</button>
          <AvatarComponent className="w-10 h-10 mr-3" />
          <h2 className="text-2xl font-bold text-brand-title">{selectedProfile.name}</h2>
        </div>
        
        <div className="flex-grow bg-brand-surface/50 rounded-xl p-4 overflow-y-auto space-y-4 mb-4 border border-brand-primary/50">
          {chatHistory.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && <AvatarComponent className="w-8 h-8 flex-shrink-0" />}
                  {msg.role === 'error' && <EmergencyIcon className="w-8 h-8 flex-shrink-0 text-red-500" />}
                   <div className={`max-w-xl p-3 px-4 rounded-2xl ${
                       msg.role === 'user' ? 'bg-gradient-to-br from-brand-accent to-orange-500 text-white rounded-br-none' :
                       msg.role === 'model' ? 'bg-white border border-brand-primary/80 text-brand-text rounded-bl-none' :
                       'bg-red-100 border border-red-200 text-red-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                  </div>
              </div>
          ))}
          {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-xl p-3 px-4 rounded-2xl bg-white border border-brand-primary/80 flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 animate-pulse text-brand-accent" />
                      <span className="text-brand-text-dim">{selectedProfile.name} está escribiendo...</span>
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
              placeholder={`Habla con ${selectedProfile.name}...`}
              disabled={isLoading}
              className="flex-grow p-3 bg-brand-surface rounded-lg border-2 border-brand-primary focus:border-brand-accent focus:outline-none transition-colors disabled:opacity-50"
          />
          <button type="submit" disabled={isLoading} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              Enviar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-title mb-2">Conecta con Perfiles</h2>
        <p className="text-brand-text-dim max-w-2xl mx-auto">Tu puntaje de compatibilidad es de <span className="font-bold text-brand-success">{score}%</span>. ¡Felicidades! Ahora estás listo para practicar en conversaciones abiertas. Elige un perfil para comenzar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHATBOT_PROFILES.map((profile) => {
          const AvatarComponent = avatarMap[profile.avatar];
          const isRecommended = profile.id === recommendedProfileId;
          return (
            <div 
              key={profile.id} 
              className={`relative bg-brand-surface rounded-xl shadow-md p-6 flex flex-col transition-all duration-300 ${isRecommended ? 'border-2 border-brand-accent shadow-lg' : 'border border-brand-primary/50 hover:shadow-xl hover:border-brand-accent/50'}`}
            >
              {isRecommended && (
                <div className="absolute top-3 right-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                  <SparklesIcon className="w-3 h-3" />
                  Recomendado
                </div>
              )}
              <div className="flex items-center mb-4">
                <AvatarComponent className="w-16 h-16 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-brand-title">{profile.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {profile.personality.map(p => <span key={p} className="text-xs bg-brand-graphic/20 text-brand-graphic font-semibold px-2 py-0.5 rounded-full">{p}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-brand-text-dim text-sm mb-6 flex-grow">{profile.bio}</p>
              
              {isRecommended && (
                  <p className="text-sm text-brand-accent-hover bg-brand-accent/10 p-3 rounded-md mb-4 -mt-2">
                      Basado en tu perfil, una charla con {profile.name} podría ser un gran punto de partida.
                  </p>
              )}

              <button 
                onClick={() => initializeChat(profile)}
                className="w-full mt-auto bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Chatear con {profile.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConectarPage;
