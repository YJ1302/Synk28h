import React, { useState, useMemo, useEffect } from 'react';
import { Page, PracticeSession, DiagnosisResult, BaselineCheckin, DailyCheckin } from './types';
import AutoChequeoPage from './components/AutoChequeoPage';
import PracticarPage from './components/PracticarPage';
import ConectarPage from './components/ConectarPage';
import NicknamePage from './components/NicknamePage';
import OnboardingPage from './components/OnboardingPage';
import NosyncModal from './components/NosyncModal';
import BaselineCheckinPage from './components/BaselineCheckinPage';
import DailyCheckinComponent from './components/DailyCheckin';
import TallerPage from './components/TallerPage';
import LoginPage from './components/LoginPage';
import { CheckIcon, PracticeIcon, ConnectIcon, LogoIcon, WorkshopIcon, EmergencyIcon } from './components/Icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('Chequeo');
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [baselineCheckin, setBaselineCheckin] = useState<BaselineCheckin | null>(null);
  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>([]);
  const [hasOptedInPassiveAI, setHasOptedInPassiveAI] = useState<boolean>(false);
  const [isNosyncModalOpen, setIsNosyncModalOpen] = useState(false);
  const [isWorkshopRecommended, setIsWorkshopRecommended] = useState(false);

  useEffect(() => {
    try {
      const savedNickname = localStorage.getItem('synk-nickname');
      if (savedNickname) setNickname(savedNickname);
      
      const savedConsent = localStorage.getItem('synk-consent');
      if (savedConsent === 'true') setHasConsented(true);

      const savedBaseline = localStorage.getItem('synk-baseline-checkin');
      if (savedBaseline) setBaselineCheckin(JSON.parse(savedBaseline));
      
      const savedDailyCheckins = localStorage.getItem('synk-daily-checkins');
      if (savedDailyCheckins) setDailyCheckins(JSON.parse(savedDailyCheckins));

      const savedPassiveAIOptIn = localStorage.getItem('synk-passive-ai-opt-in');
      if (savedPassiveAIOptIn === 'true') setHasOptedInPassiveAI(true);

      const savedDiagnosis = localStorage.getItem('synk-diagnosis');
      if (savedDiagnosis) {
          setDiagnosisResult(JSON.parse(savedDiagnosis));
          const savedPractice = localStorage.getItem('synk-practice-history');
          if (savedPractice) {
              setPracticeHistory(JSON.parse(savedPractice));
          }
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (nickname) localStorage.setItem('synk-nickname', nickname);
      if (hasConsented) localStorage.setItem('synk-consent', 'true');
      if (baselineCheckin) localStorage.setItem('synk-baseline-checkin', JSON.stringify(baselineCheckin));
      if (dailyCheckins.length > 0) localStorage.setItem('synk-daily-checkins', JSON.stringify(dailyCheckins));
      if (hasOptedInPassiveAI) localStorage.setItem('synk-passive-ai-opt-in', 'true');
      if (diagnosisResult) localStorage.setItem('synk-diagnosis', JSON.stringify(diagnosisResult));
      if (practiceHistory.length > 0) localStorage.setItem('synk-practice-history', JSON.stringify(practiceHistory));
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  }, [nickname, hasConsented, baselineCheckin, dailyCheckins, hasOptedInPassiveAI, diagnosisResult, practiceHistory]);
  
  const successfulPractices = useMemo(() => {
    return practiceHistory.filter(p => p.score === 100).length;
  }, [practiceHistory]);

  const isConnectUnlocked = useMemo(() => {
    return !!diagnosisResult && successfulPractices >= 3;
  }, [diagnosisResult, successfulPractices]);

  const addPracticeSession = (prompt: string, answer: string, score: number, feedback: string) => {
    const newSession: PracticeSession = { prompt, answer, score, feedback, timestamp: new Date() };
    setPracticeHistory(prev => [...prev, newSession]);
  };
  
  const handleNicknameSubmit = (name: string) => {
    setNickname(name);
  };

  const handleConsent = () => {
    setHasConsented(true);
  };
  
  const handleBaselineSubmit = (data: { question: string, score: number, note: string }) => {
    const newBaseline: BaselineCheckin = { ...data, timestamp: new Date() };
    setBaselineCheckin(newBaseline);
    if (data.score <= 2) {
      setIsWorkshopRecommended(true);
    }
  };

  const handleDailyCheckinSubmit = (data: Omit<DailyCheckin, 'timestamp'>) => {
    const newCheckin: DailyCheckin = { ...data, timestamp: new Date() };
    setDailyCheckins(prev => [...prev, newCheckin]);
    // Logic to recommend workshop based on daily checkin
    const lowMoodLabels = ['mal', 'meh', 'cansado/a', 'triste'];
    if(lowMoodLabels.includes(data.label.toLowerCase())){
        setIsWorkshopRecommended(true);
    }
  };

  const handlePassiveAIOptIn = (didOptIn: boolean) => {
    setHasOptedInPassiveAI(didOptIn);
  };

  const handleStartPractice = () => {
    setCurrentPage('Práctica');
  };

  const onLoadDemo = () => {
    const demoDiagnosis: DiagnosisResult = {
      main_challenge: 'social_anxiety',
      confidence: 0.95,
      traits: ['reflexivo', 'empático', 'cauteloso'],
      insight: 'Parece que te tomas tiempo para entender las situaciones sociales, pero a veces la ansiedad puede interponerse. Explorar formas de iniciar conversaciones podría aumentar tu confianza.',
      recommended_scenario: 'social_anxiety',
      scores: {
        social_energy: 60,
        social_anxiety: 75,
        communication_gaps: 65,
        authenticity_boundaries: 85,
      },
    };
    const demoHistory: PracticeSession[] = [
      { prompt: 'Iniciar una Conversación', answer: 'Completó el módulo Rompehielos.', score: 100, feedback: 'Sesión completa!', timestamp: new Date() },
      { prompt: 'Establecer un Límite', answer: 'Completó el módulo Rechazar Cortésmente.', score: 100, feedback: 'Sesión completa!', timestamp: new Date() },
      { prompt: 'Mantener una Conversación', answer: 'Completó el módulo Encontrando Conexiones.', score: 100, feedback: 'Sesión completa!', timestamp: new Date() },
    ];

    setNickname('Demo');
    setHasConsented(true);
    setBaselineCheckin({ question: '¿Cómo te sientes en este preciso momento?', score: 4, note: 'Listo para probar la app.', timestamp: new Date() });
    setDiagnosisResult(demoDiagnosis);
    setPracticeHistory(demoHistory);
    setHasOptedInPassiveAI(true);
    setCurrentPage('Práctica');
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (!nickname) {
    return <NicknamePage onNicknameSubmit={handleNicknameSubmit} />;
  }

  if (!hasConsented) {
    return <OnboardingPage onConsent={handleConsent} />;
  }
  
  if (!baselineCheckin) {
      return <BaselineCheckinPage onBaselineSubmit={handleBaselineSubmit} onLoadDemo={onLoadDemo} />;
  }
  
  const compatibilityScore = diagnosisResult ? Math.round(
    (diagnosisResult.scores.social_energy * 0.3) +
    (diagnosisResult.scores.communication_gaps * 0.3) +
    (diagnosisResult.scores.authenticity_boundaries * 0.2) +
    (diagnosisResult.scores.social_anxiety * 0.2)
  ) : 0;

  const getPageContent = () => {
    switch (currentPage) {
      case 'Chequeo':
        return <AutoChequeoPage 
                  nickname={nickname} 
                  setDiagnosisResult={setDiagnosisResult}
                  diagnosisResult={diagnosisResult}
                  baselineCheckin={baselineCheckin}
                  onStartPractice={handleStartPractice}
                  hasOptedInPassiveAI={hasOptedInPassiveAI}
                  onPassiveAIOptIn={handlePassiveAIOptIn}
                  onLoadDemo={onLoadDemo}
                />;
      case 'Práctica':
        return <PracticarPage 
                  nickname={nickname} 
                  diagnosisResult={diagnosisResult}
                  successfulPractices={successfulPractices}
                  addPracticeSession={addPracticeSession}
                />;
      case 'Conectar':
        return <ConectarPage 
                  isUnlocked={isConnectUnlocked} 
                  score={compatibilityScore}
                  nickname={nickname}
                  diagnosisResult={diagnosisResult}
                />;
      case 'Taller':
        return <TallerPage nickname={nickname} isRecommended={isWorkshopRecommended}/>
      default:
        return <div>Página no encontrada</div>;
    }
  };
  
  const hasCompletedDailyCheckinToday = () => {
    if (dailyCheckins.length === 0) return false;
    const lastCheckinDate = new Date(dailyCheckins[dailyCheckins.length - 1].timestamp);
    const today = new Date();
    return lastCheckinDate.toDateString() === today.toDateString();
  };


  return (
    <>
      <div className="min-h-screen flex flex-col p-2 md:p-4">
        <header className="flex-shrink-0 flex justify-between items-center p-4 bg-brand-surface/80 backdrop-blur-sm rounded-t-2xl border-b border-brand-primary/50">
          <LogoIcon />
          <button onClick={() => setIsNosyncModalOpen(true)} className="flex items-center gap-2 bg-red-100/80 hover:bg-red-200/80 text-red-700 font-bold py-2 px-4 rounded-lg transition-colors border border-red-200/80">
            <EmergencyIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Ayuda Inmediata</span>
          </button>
        </header>

        <main className="flex-grow bg-brand-surface shadow-lg relative overflow-y-auto">
            <div className="pb-24">
                 {diagnosisResult && !hasCompletedDailyCheckinToday() && currentPage !== 'Taller' && (
                  <DailyCheckinComponent onCheckinSubmit={handleDailyCheckinSubmit} />
                )}
                {getPageContent()}
            </div>
        </main>
        
        <nav className="flex-shrink-0 bg-brand-surface/95 backdrop-blur-sm rounded-b-2xl shadow-lg border-t border-brand-primary/50">
            <div className="p-2 grid grid-cols-4 gap-2">
                <button onClick={() => setCurrentPage('Chequeo')} className={`nav-button ${currentPage === 'Chequeo' ? 'active' : ''}`}>
                    <CheckIcon className="w-5 h-5" />
                    <span>Chequeo</span>
                </button>
                <button onClick={() => setCurrentPage('Práctica')} disabled={!diagnosisResult} className={`nav-button ${currentPage === 'Práctica' ? 'active' : ''}`}>
                    <PracticeIcon className="w-5 h-5" />
                    <span>Práctica</span>
                </button>
                <button onClick={() => setCurrentPage('Conectar')} disabled={!isConnectUnlocked} className={`nav-button ${currentPage === 'Conectar' ? 'active' : ''}`}>
                    <ConnectIcon className="w-5 h-5" />
                    <span>Conectar</span>
                </button>
                <button onClick={() => setCurrentPage('Taller')} className={`nav-button ${currentPage === 'Taller' ? 'active' : ''}`}>
                    <WorkshopIcon className="w-5 h-5" />
                    <span>Taller</span>
                </button>
            </div>
        </nav>

        <footer className="text-center p-4">
          <p className="text-sm text-brand-text-dim">&copy; {new Date().getFullYear()} Synk. Todos los derechos reservados.</p>
        </footer>
      </div>

      <NosyncModal isOpen={isNosyncModalOpen} onClose={() => setIsNosyncModalOpen(false)} />

      <style>{`
        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.75rem;
          line-height: 1rem;
          transition: all 0.2s ease-in-out;
          background-color: transparent;
          color: #6B7280;
          border: 1px solid transparent;
        }
        .nav-button:hover:not(:disabled) {
          background-color: #F9FAFB;
          color: #374151;
        }
        .nav-button.active {
          color: #F97316;
          background-color: transparent;
          box-shadow: none;
        }
        .nav-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: transparent;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default App;