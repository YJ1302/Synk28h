import React, { useState } from 'react';
import { Answers, DiagnosisResult, BaselineCheckin, MainChallenge } from '../types';
import { QUESTIONS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { AnimatedLogoIcon, EmergencyIcon } from './Icons';
import RadarChart from './RadarChart';

interface AutoChequeoPageProps {
  nickname: string;
  setDiagnosisResult: (result: DiagnosisResult | null) => void;
  diagnosisResult: DiagnosisResult | null;
  baselineCheckin: BaselineCheckin;
  onStartPractice: () => void;
  hasOptedInPassiveAI: boolean;
  onPassiveAIOptIn: (didOptIn: boolean) => void;
  onLoadDemo: () => void;
}

const challengeLabels: { [key in MainChallenge]: string } = {
    social_anxiety: 'Ansiedad Social',
    boundary_issues: 'Límites y Autenticidad',
    communication_gaps: 'Habilidades de Comunicación',
    authenticity_doubt: 'Duda sobre Autenticidad',
    other: 'Bienestar General'
};

const AutoChequeoPage: React.FC<AutoChequeoPageProps> = ({ nickname, setDiagnosisResult, diagnosisResult, baselineCheckin, onStartPractice, hasOptedInPassiveAI, onPassiveAIOptIn, onLoadDemo }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    }
  };

  const getDiagnosis = async () => {
    setIsLoading(true);
    setError(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const formattedAnswers = QUESTIONS.map(q => `P${q.id}: "${q.text}"\nR: "${answers[q.id] || 'No respondida'}"`).join('\n\n');

    const baselineInfo = `Información del chequeo inicial de ${nickname}:
- Pregunta de estado de ánimo: "${baselineCheckin.question}"
- Puntuación: ${baselineCheckin.score}/5
- Nota adicional: "${baselineCheckin.note || 'Ninguna'}"
Utiliza esta información como contexto clave para tu análisis.`;

    const prompt = `Eres "Synk Diagnóstico". Recibirás respuestas de una encuesta y un chequeo de estado de ánimo de un usuario llamado ${nickname}.
Analiza las respuestas a través de 4 factores clave: Energía Social, Ansiedad Social, Habilidades de Comunicación y Autenticidad/Límites.

${baselineInfo}

Respuestas de ${nickname} a la encuesta principal:
${formattedAnswers}

Basado en todo esto, devuelve un único objeto JSON estricto con la siguiente estructura:
1.  \`main_challenge\`: Elige uno de: ["social_anxiety", "boundary_issues", "communication_gaps", "authenticity_doubt", "other"].
2.  \`confidence\`: Un número de 0 a 1 que representa tu confianza en el diagnóstico.
3.  \`traits\`: Un array de 3 a 5 etiquetas en minúsculas y en español que describen al usuario.
4.  \`insight\`: Un párrafo breve (≤80 palabras) en un tono cálido y empático.
5.  \`recommended_scenario\`: Elige uno de: ["social_anxiety", "authenticity_boundaries", "communication_gaps", "social_energy", "general"]. Debe corresponder al 'main_challenge' o ser 'general' si no hay un enfoque claro.
6.  \`scores\`: Un objeto con puntuaciones numéricas del 1 al 100 para los 4 factores ('social_energy', 'social_anxiety', 'communication_gaps', 'authenticity_boundaries') para el gráfico de radar. Una puntuación más alta es mejor.

No incluyas comentarios fuera del objeto JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              main_challenge: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              traits: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              insight: { type: Type.STRING },
              recommended_scenario: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  social_energy: { type: Type.NUMBER },
                  social_anxiety: { type: Type.NUMBER },
                  communication_gaps: { type: Type.NUMBER },
                  authenticity_boundaries: { type: Type.NUMBER }
                },
                required: ['social_energy', 'social_anxiety', 'communication_gaps', 'authenticity_boundaries']
              }
            },
            required: ['main_challenge', 'confidence', 'traits', 'insight', 'recommended_scenario', 'scores']
          }
        }
      });
      
      const jsonStr = response.text.trim();
      const result = JSON.parse(jsonStr);
      setDiagnosisResult(result);

    } catch (e) {
      console.error("Error al obtener diagnóstico:", e);
      let errorMessage = "Lo siento, no pude generar un diagnóstico en este momento. Por favor, inténtalo de nuevo más tarde.";
      if (e instanceof Error && (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429'))) {
        errorMessage = "Se ha excedido el límite de solicitudes a la IA. No se pudo generar tu perfil. Puedes esperar unos minutos e 'Intentar de Nuevo', o 'Cargar Demo' para explorar la aplicación con datos de ejemplo.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
        <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-brand-title animate-pulse">Creando Tu Perfil...</h2>
        <p className="text-brand-text-dim">Analizando tus respuestas para crear tu experiencia personalizada.</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
            <EmergencyIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Ocurrió un Error</h2>
            <p className="text-brand-text-dim mb-6 max-w-md">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={getDiagnosis}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-transform"
                >
                    Intentar de Nuevo
                </button>
                 <button 
                    onClick={onLoadDemo}
                    className="bg-brand-secondary hover:bg-gray-400 text-brand-text font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-transform"
                >
                    Cargar Demo
                </button>
            </div>
        </div>
     );
  }

  if (diagnosisResult) {
    const mainChallengeLabel = challengeLabels[diagnosisResult.main_challenge] || "Bienestar General";
    return (
      <div className="p-4 md:p-8 space-y-6 animate-fade-in">
        <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-title">Tu Perfil Synk, {nickname}</h2>
            <p className="text-brand-text-dim max-w-2xl mx-auto mt-2">{diagnosisResult.insight}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-surface rounded-xl p-6 border border-brand-primary/50">
                <h3 className="text-xl font-semibold text-brand-title mb-4 text-center">Tu Panorama Social</h3>
                <RadarChart scores={diagnosisResult.scores} />
            </div>
            <div className="bg-brand-surface rounded-xl p-6 flex flex-col justify-center border border-brand-primary/50">
                <h3 className="text-xl font-semibold text-brand-title mb-4">Rasgos Clave</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {diagnosisResult.traits.map((trait, index) => (
                        <span key={index} className="bg-brand-graphic/20 text-brand-graphic font-semibold px-3 py-1 rounded-full text-sm">
                            {trait}
                        </span>
                    ))}
                </div>

                <div className="bg-brand-accent/10 border-l-4 border-brand-accent text-brand-accent p-4 rounded-r-lg">
                    <h4 className="font-bold text-lg">Área de Enfoque Principal</h4>
                    <p className="text-brand-text-dim">Basado en tus respuestas, tu viaje comenzará centrándose en <strong className="text-brand-accent">{mainChallengeLabel}</strong>.</p>
                </div>
            </div>
        </div>

        <div className="bg-brand-surface rounded-xl p-6 space-y-4 border border-brand-primary/50">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-brand-title">Activar IA Pasiva (Opcional)</h4>
                    <p className="text-sm text-brand-text-dim max-w-prose">Permite que Synk analice de forma anónima los metadatos de tus prácticas para ofrecerte sugerencias personalizadas y detectar riesgos. Nunca leeremos tus conversaciones.</p>
                </div>
                <label htmlFor="passive-ai-toggle" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input 
                        type="checkbox" 
                        id="passive-ai-toggle" 
                        className="sr-only peer"
                        checked={hasOptedInPassiveAI}
                        onChange={(e) => onPassiveAIOptIn(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-brand-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                </label>
            </div>
        </div>

        <div className="text-center pt-4">
            <button
                onClick={onStartPractice}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
            >
                Iniciar Práctica Recomendada
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-title mb-2">Chequeo Principal para {nickname}</h2>
        <p className="text-brand-text-dim mb-6">Responde estas preguntas para personalizar tu experiencia.</p>
        <div className="w-full bg-brand-primary rounded-full h-2.5 mb-2">
            <div className="bg-brand-success h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <p className="text-right text-sm text-brand-text-dim">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</p>
      </div>

      <div className="bg-brand-surface p-6 rounded-xl min-h-[300px] flex flex-col justify-between border border-brand-primary/50">
        <div>
          <h3 className="text-xl font-semibold mb-1">{currentQuestion.text}</h3>
          {currentQuestion.helperText && <p className="text-sm text-brand-text-dim mb-6">{currentQuestion.helperText}</p>}
        </div>
        
        <div className={`grid gap-3 ${currentQuestion.type === 'scale' ? 'grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`p-4 text-left rounded-lg transition-all duration-200 border-2 ${answers[currentQuestion.id] === option ? 'bg-brand-accent border-brand-accent text-white font-bold transform scale-105' : 'bg-white border-brand-primary hover:border-brand-accent hover:bg-brand-accent/5'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} 
            disabled={currentQuestionIndex === 0}
            className="bg-brand-primary hover:bg-brand-secondary text-brand-text font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        {currentQuestionIndex === totalQuestions - 1 ? (
             <button 
                onClick={getDiagnosis}
                disabled={!answers[currentQuestion.id]}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Obtener Mi Perfil
            </button>
        ) : (
            <button 
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={!answers[currentQuestion.id]}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente
            </button>
        )}
      </div>
    </div>
  );
};

export default AutoChequeoPage;