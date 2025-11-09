import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { DailyCheckin } from '../types';
import { SparklesIcon } from './Icons';

interface DailyCheckinProps {
  onCheckinSubmit: (data: Omit<DailyCheckin, 'timestamp'>) => void;
}

interface AIDailyQuestion {
    question: string;
    answers: string[];
}

const DailyCheckinComponent: React.FC<DailyCheckinProps> = ({ onCheckinSubmit }) => {
  const [data, setData] = useState<AIDailyQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Genera un objeto JSON para un chequeo de estado de ánimo diario. El objeto debe tener dos claves:
1. "question": una pregunta corta, única y cálida para el usuario sobre cómo se siente hoy (en español, <100 caracteres).
2. "answers": un array de 4 respuestas de una sola palabra (en español) que cubran un rango de sentimientos.

No incluyas comentarios fuera del JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answers: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ['question', 'answers']
            }
          }
        });
        const result = JSON.parse(response.text.trim());
        if (result.answers.length >= 3) {
            setData(result);
        } else {
            throw new Error("La IA no devolvió suficientes respuestas.");
        }
      } catch (e) {
        console.error("Error al generar la pregunta diaria:", e);
        let errorMessage = "No se pudo cargar el chequeo. No te preocupes, se usará una pregunta predeterminada.";
        if (e instanceof Error && (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429'))) {
          errorMessage = "Se ha superado la cuota de la API. No te preocupes, puedes usar la pregunta predeterminada para el chequeo de hoy.";
        }
        setError(errorMessage);
        // Use fallback data on error to not block user
        setData({
            question: "¿Cómo te sientes hoy?",
            answers: ["Bien", "Normal", "Meh", "Mal"]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLabel && data) {
      onCheckinSubmit({ question: data.question, label: selectedLabel, note });
      setIsSubmitted(true);
    }
  };
  
  if (isSubmitted) {
    return (
        <div className="p-4 my-4 bg-brand-success/20 text-teal-800 rounded-lg text-center animate-fade-in border border-brand-success/50">
            <p>¡Gracias por tu chequeo de hoy! Vuelve mañana.</p>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="p-4 my-4 bg-brand-surface rounded-lg text-center">
            <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse mx-auto" />
        </div>
    );
  }

  return (
    <div className="p-4 my-4 bg-brand-surface rounded-xl shadow-sm animate-fade-in border border-brand-primary/50">
       {error && (
         <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-center text-sm">
            <p>{error}</p>
        </div>
       )}
       {data && (
         <form onSubmit={handleSubmit}>
              <p className="font-bold text-brand-title text-center mb-4">{data.question}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {data.answers.map((label) => (
                      <button
                          key={label}
                          type="button"
                          onClick={() => setSelectedLabel(label)}
                          className={`p-3 text-center rounded-lg transition-all duration-200 border-2 ${selectedLabel === label ? 'bg-brand-accent border-brand-accent text-white font-bold' : 'bg-white border-brand-primary hover:border-brand-accent/50'}`}
                      >
                          {label}
                      </button>
                  ))}
              </div>
               <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Añadir una nota (opcional)..."
                className="w-full p-2 bg-slate-100 rounded-lg border-2 border-transparent focus:border-brand-accent focus:outline-none transition-colors resize-none text-sm"
                rows={2}
              />
              <button
                  type="submit"
                  disabled={!selectedLabel}
                  className="w-full mt-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Guardar Chequeo
              </button>
         </form>
       )}
    </div>
  );
};

export default DailyCheckinComponent;