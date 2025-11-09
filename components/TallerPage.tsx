import React from 'react';
import { WorkshopIcon } from './Icons';

interface TallerPageProps {
  nickname: string;
  isRecommended: boolean;
}

const TallerPage: React.FC<TallerPageProps> = ({ nickname }) => {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
       <div className="w-full max-w-md bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-primary/50">
          <WorkshopIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-title mb-4">Taller en Construcción</h2>
          <p className="text-brand-text-dim">
            ¡Hola, {nickname}! Estamos trabajando en nuevas y emocionantes herramientas para esta sección. Vuelve pronto para descubrir ejercicios guiados y talleres interactivos. ¡Gracias por tu paciencia!
          </p>
       </div>
    </div>
  );
};

export default TallerPage;
