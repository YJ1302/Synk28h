import React, { useState } from 'react';
import { AnimatedLogoIcon } from './Icons';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'synk28h' && password === 'lima2025') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="w-full max-w-sm text-center">
        <AnimatedLogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-brand-title mb-2">Bienvenido/a a Synk</h1>
        <p className="text-brand-text-dim mb-8">Inicia sesión para continuar.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-primary/50">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-brand-accent focus:outline-none transition-colors"
            aria-label="Nombre de usuario"
            required
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-brand-accent focus:outline-none transition-colors"
            aria-label="Contraseña"
            required
          />
           {error && (
            <p className="text-red-500 text-sm text-left">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
