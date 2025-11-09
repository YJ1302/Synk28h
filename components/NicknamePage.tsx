import React, { useState } from 'react';
import { AnimatedLogoIcon } from './Icons';

interface NicknamePageProps {
  onNicknameSubmit: (nickname: string) => void;
}

const NicknamePage: React.FC<NicknamePageProps> = ({ onNicknameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNicknameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md text-center">
        <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-brand-title mb-2">Bienvenido/a a Synk</h1>
        <p className="text-brand-text-dim mb-8">Comencemos con un apodo. ¿Cómo te gustaría que te llamemos?</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu apodo aquí"
            className="w-full p-4 text-center bg-brand-surface rounded-lg border-2 border-brand-primary focus:border-brand-accent focus:outline-none transition-colors"
            aria-label="Campo de apodo"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknamePage;