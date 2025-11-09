import React from 'react';
import { ProfileScores } from '../types';

interface RadarChartProps {
  scores: ProfileScores;
}

const labels: { key: keyof ProfileScores; name: string }[] = [
  { key: 'social_energy', name: 'Energía Social' },
  { key: 'communication_gaps', name: 'Comunicación' },
  { key: 'authenticity_boundaries', name: 'Autenticidad' },
  { key: 'social_anxiety', name: 'Confianza Social' },
];

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const numLevels = 5;

  const points = labels.map((label, i) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * i) / labels.length;
    const score = scores[label.key] || 0;
    const x = center + radius * (score / 100) * Math.cos(angle);
    const y = center - radius * (score / 100) * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} aria-labelledby="chart-title">
      <title id="chart-title">Gráfico de radar del panorama social</title>
      <g className="grid">
        {[...Array(numLevels)].map((_, levelIndex) => {
          const levelRadius = radius * ((levelIndex + 1) / numLevels);
          const levelPoints = labels.map((_, i) => {
            const angle = (Math.PI / 2) - (2 * Math.PI * i) / labels.length;
            const x = center + levelRadius * Math.cos(angle);
            const y = center - levelRadius * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={levelIndex}
              points={levelPoints}
              className="fill-none stroke-brand-primary stroke-1"
            />
          );
        })}
      </g>
      <g className="axes">
        {labels.map((_, i) => {
          const angle = (Math.PI / 2) - (2 * Math.PI * i) / labels.length;
          const x = center + radius * Math.cos(angle);
          const y = center - radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-brand-primary stroke-1"
            />
          );
        })}
      </g>
      <g className="labels">
        {labels.map((label, i) => {
          const angle = (Math.PI / 2) - (2 * Math.PI * i) / labels.length;
          const labelRadius = radius * 1.25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center - labelRadius * Math.sin(angle);
          return (
            <text
              key={label.key}
              x={x}
              y={y}
              dy="0.3em"
              textAnchor="middle"
              className="text-xs fill-current text-brand-text-dim font-semibold"
            >
              {label.name}
            </text>
          );
        })}
      </g>
      <g className="data">
        <polygon
          points={points}
          className="fill-brand-graphic/50 stroke-brand-graphic stroke-2"
        >
          <animate attributeName="points" from="150,150 150,150 150,150 150,150" to={points} dur="0.8s" fill="freeze" calcMode="spline" keyTimes="0; 1" keySplines="0.25 0.1 0.25 1"/>
        </polygon>
      </g>
    </svg>
  );
};

export default RadarChart;