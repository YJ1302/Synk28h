import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnimatedLogoIcon, SparklesIcon } from './Icons';

interface BaselineCheckinPageProps {
  onBaselineSubmit: (data: { question: string, score: number, note: string }) => void;
  onLoadDemo: () => void;
}

const BaselineCheckinPage: React.FC<BaselineCheckinPageProps> = ({ onBaselineSubmit }) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Genera una única pregunta corta, cálida y concreta para evaluar el estado de ánimo de alguien en este preciso momento. El formato debe ser solo texto, menos de 80 caracteres y sin emojis.",
      });
      const generatedQuestion = response.text.trim();
      if (!generatedQuestion) throw new Error("Empty response from API.");
      setQuestion(generatedQuestion);
    } catch (e) {
      console.error("Error al generar la pregunta:", e);
      let notificationMessage = "No se pudo cargar una pregunta personalizada. ¡No hay problema! Usaremos una estándar para empezar.";
      if (e instanceof Error && (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429'))) {
          notificationMessage = "Debido a la alta demanda, no pudimos generar una pregunta personalizada. Usaremos una estándar para que puedas continuar.";
      }
      setNotification(notificationMessage);
      setQuestion("Para empezar, ¿cómo te sientes en este preciso momento?"); // Fallback question
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score !== null && question) {
      onBaselineSubmit({ question, score, note });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-brand-title animate-pulse">Preparando tu chequeo...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg text-center">
        {notification && (
          <div className="p-3 mb-6 bg-yellow-100/80 text-yellow-900 rounded-lg text-center text-sm border border-yellow-200/80 flex items-center justify-center gap-2">
            <SparklesIcon className="w-5 h-5 flex-shrink-0" />
            <p>{notification}</p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-brand-title mb-6">Un rápido chequeo inicial</h1>
        <form onSubmit={handleSubmit} className="bg-brand-surface p-8 rounded-2xl shadow-lg space-y-8 border border-brand-primary/50">
          <div>
            <label className="block text-xl text-brand-text mb-6">{question}</label>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-brand-text-dim">Muy mal</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    score === value 
                      ? 'bg-brand-accent border-brand-accent text-white scale-110' 
                      : 'bg-white border-brand-primary hover:border-brand-accent'
                  }`}
                  aria-pressed={score === value}
                >
                  {value}
                </button>
              ))}
              <span className="text-xs text-brand-text-dim">Muy bien</span>
            </div>
          </div>
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Algo más que quieras añadir? (Opcional)"
              className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-brand-accent focus:outline-none transition-colors resize-none"
              rows={3}
              aria-label="Nota adicional sobre tu estado de ánimo"
            />
          </div>
          <button
            type="submit"
            disabled={score === null}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar al diagnóstico
          </button>
        </form>
      </div>
    </div>
  );
};

export default BaselineCheckinPage;