import React, { useState } from 'react';
import { AnimatedLogoIcon } from './Icons';

interface OnboardingPageProps {
  onConsent: () => void;
}

const slides = [
  {
    icon: '👋',
    title: '¿Qué es Synk?',
    content: 'Synk es tu compañero de IA personal para el bienestar social. Te ayudamos a comprenderte mejor, practicar conversaciones y construir confianza en un espacio seguro y sin juicios.',
  },
  {
    icon: '🔒',
    title: 'Tu Privacidad es Primero',
    content: 'Operamos de forma anónima. No pedimos tu nombre real. Todas las conversaciones son privadas y los datos que recopilamos se utilizan únicamente para personalizar tu experiencia en la aplicación.',
  },
  {
    icon: '🤖',
    title: 'Tu Acompañante de IA',
    content: 'Nuestra IA está aquí para guiarte. Aprenderá contigo para ofrecerte prácticas personalizadas y perspectivas útiles. Recuerda, Synk es una herramienta de apoyo, no un reemplazo de la terapia.',
  },
];

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onConsent }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleStartJourney = () => {
    if (isChecked) {
      setIsTransitioning(true);
      setTimeout(() => {
        onConsent();
      }, 2000); // Wait for animation
    }
  };

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md text-center">
            <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-brand-title animate-pulse">Configurando tu espacio...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md text-center bg-brand-surface p-8 rounded-2xl shadow-lg flex flex-col justify-between min-h-[500px] border border-brand-primary/50">
        <div>
            <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
            <h1 className="text-3xl font-bold text-brand-title mb-4">{slides[currentSlide].title}</h1>
            <p className="text-brand-text-dim mb-8">{slides[currentSlide].content}</p>
        </div>

        <div>
          {isLastSlide && (
            <div className="text-left mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="h-5 w-5 rounded border-brand-secondary text-brand-accent focus:ring-brand-accent"
                />
                <span className="ml-3 text-sm text-brand-text-dim">
                  Acepto los Términos de Servicio y la Política de Privacidad.
                </span>
              </label>
            </div>
          )}
           <div className="flex items-center justify-center space-x-2 mb-6">
                {slides.map((_, index) => (
                    <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        currentSlide === index ? 'bg-brand-accent' : 'bg-brand-primary'
                    }`}
                    />
                ))}
            </div>
          {isLastSlide ? (
            <button
              onClick={handleStartJourney}
              disabled={!isChecked}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar mi viaje
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Siguiente
            </button>
          )}

            <p className="text-xs text-brand-text-dim mt-6 italic">
                Synk no reemplaza la atención clínica. Si sientes que estás en riesgo, busca ayuda profesional.
            </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;