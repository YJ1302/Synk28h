import React, { useState } from 'react';
import { PhoneIcon, WhatsAppIcon, HeartHandIcon, MedicalCrossIcon, ShieldIcon, PoliceBadgeIcon, FireIcon } from './Icons';

interface Resource {
  name: string;
  type: 'call' | 'whatsapp';
  contact: string;
  info: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{className?: string}>;
  resources: Resource[];
}

const EMERGENCY_RESOURCES: Category[] = [
  {
    id: 'mental_health',
    title: 'Hablar con alguien',
    description: 'Recursos de salud mental disponibles 24/7.',
    icon: HeartHandIcon,
    resources: [
      { name: 'Línea 113 (Opción 5)', type: 'call', contact: '113', info: 'Línea de ayuda del MINSA.' },
      { name: 'WhatsApp/Telegram', type: 'whatsapp', contact: '51955557000', info: 'Chatea con un especialista.' },
      { name: 'WhatsApp/Telegram 2', type: 'whatsapp', contact: '51952842623', info: 'Soporte adicional.' },
    ],
  },
  {
    id: 'medical',
    title: 'Emergencia Médica',
    description: 'Asistencia médica y ambulancias.',
    icon: MedicalCrossIcon,
    resources: [
      { name: 'SAMU', type: 'call', contact: '106', info: 'Servicio de Atención Móvil de Urgencia.' },
    ],
  },
  {
    id: 'violence',
    title: 'Violencia Doméstica/Sexual',
    description: 'Líneas de ayuda para víctimas de violencia.',
    icon: ShieldIcon,
    resources: [
      { name: 'Línea 100', type: 'call', contact: '100', info: 'Programa Nacional Aurora.' },
    ],
  },
  {
    id: 'police',
    title: 'Policía Nacional',
    description: 'Para emergencias que requieren intervención policial.',
    icon: PoliceBadgeIcon,
    resources: [
      { name: 'Emergencias Policiales', type: 'call', contact: '105', info: 'Central de emergencias.' },
    ],
  },
   {
    id: 'firefighters',
    title: 'Bomberos',
    description: 'Para incendios, rescates y otras emergencias.',
    icon: FireIcon,
    resources: [
      { name: 'Bomberos Voluntarios', type: 'call', contact: '116', info: 'Central de emergencias de bomberos.' },
    ],
  },
];

interface NosyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NosyncModal: React.FC<NosyncModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedCategory(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-brand-surface rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        <button onClick={handleClose} className="absolute top-4 right-4 text-brand-text-dim hover:text-brand-text text-3xl font-light">&times;</button>
        
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-title text-center mb-2">Recursos de Ayuda Inmediata</h2>
            <p className="text-brand-text-dim text-center mb-6">Si estás pasando por un momento difícil, no estás solo/a. Elige una opción para ver a quién contactar.</p>
            <div className="space-y-3">
              {EMERGENCY_RESOURCES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left p-4 bg-white hover:bg-slate-50 rounded-lg transition-all border border-brand-primary/50 flex items-center gap-4 hover:border-brand-accent/50 hover:shadow-sm"
                >
                  <category.icon className="w-8 h-8 text-brand-accent flex-shrink-0" />
                  <div>
                    <span className="font-bold text-brand-text">{category.title}</span>
                    <p className="text-sm text-brand-text-dim">{category.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedCategory && (
          <div>
            <button onClick={handleBack} className="text-brand-accent font-semibold mb-4 hover:underline">&larr; Volver a categorías</button>
            <div className="flex items-center gap-3 mb-4">
              <selectedCategory.icon className="w-8 h-8 text-brand-accent"/>
              <h2 className="text-2xl font-bold text-brand-title">{selectedCategory.title}</h2>
            </div>
            <div className="space-y-4">
              {selectedCategory.resources.map((resource) => (
                <div key={resource.name} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-brand-primary/30">
                  <div>
                    <p className="font-bold text-brand-text">{resource.name}</p>
                    <p className="text-sm text-brand-text-dim">{resource.info}</p>
                  </div>
                  {resource.type === 'call' ? (
                    <a href={`tel:${resource.contact}`} className="flex items-center gap-2 bg-brand-graphic hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      <PhoneIcon className="w-5 h-5" />
                      Llamar
                    </a>
                  ) : (
                    <a href={`https://wa.me/${resource.contact}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      <WhatsAppIcon className="w-5 h-5" />
                      Chat
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NosyncModal;