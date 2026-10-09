import React from 'react';

interface EmotionalPulseVisualizerProps {
  nervousElated?: number;
  lonelyConnected?: number;
  uncertainCertain?: number;
  heavyLight?: number;
  quietElectric?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const EmotionalPulseVisualizer: React.FC<EmotionalPulseVisualizerProps> = ({
  nervousElated = 50,
  lonelyConnected = 50,
  uncertainCertain = 50,
  heavyLight = 50,
  quietElectric = 50,
  size = 'md',
  showLabels = true
}) => {
  // Dimensions
  const dim = size === 'sm' ? 120 : size === 'md' ? 200 : 280;
  const center = dim / 2;
  const radius = dim * 0.38;

  // 5 axes:
  // 0: Nervous -> Elated (Top)
  // 1: Lonely -> Connected (Top Right)
  // 2: Uncertain -> Certain (Bottom Right)
  // 3: Heavy -> Light (Bottom Left)
  // 4: Quiet -> Electric (Top Left)
  const values = [
    nervousElated / 100,
    lonelyConnected / 100,
    uncertainCertain / 100,
    heavyLight / 100,
    quietElectric / 100
  ];

  const labels = [
    { start: 'Nervous', end: 'Elated', val: nervousElated },
    { start: 'Lonely', end: 'Connected', val: lonelyConnected },
    { start: 'Uncertain', end: 'Certain', val: uncertainCertain },
    { start: 'Heavy', end: 'Light', val: heavyLight },
    { start: 'Quiet', end: 'Electric', val: quietElectric }
  ];

  const points = values.map((val, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    // val ranges from 0.1 to 1.0 to always show shape
    const r = radius * (0.2 + val * 0.8);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="overflow-visible">
          <defs>
            <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C89D3C" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#7D6B91" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4A7C9B" stopOpacity="0.05" />
            </radialGradient>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C89D3C" />
              <stop offset="50%" stopColor="#B66E6F" />
              <stop offset="100%" stopColor="#4A7C9B" />
            </linearGradient>
          </defs>

          {/* Reference concentric webs */}
          {gridLevels.map((lvl) => {
            const r = radius * lvl;
            const pts = [0, 1, 2, 3, 4].map((i) => {
              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                key={lvl}
                points={pts}
                fill="none"
                stroke="currentColor"
                strokeOpacity={lvl === 1 ? '0.15' : '0.07'}
                strokeWidth={lvl === 1 ? '1' : '0.75'}
              />
            );
          })}

          {/* Spokes */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            );
          })}

          {/* Emotional fingerprint area */}
          <polygon
            points={points}
            fill="url(#pulseGlow)"
            stroke="url(#strokeGrad)"
            strokeWidth="1.75"
            className="transition-all duration-500 ease-out"
          />

          {/* Small vertex dots */}
          {values.map((val, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const r = radius * (0.2 + val * 0.8);
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#FAF8F5"
                stroke="#C89D3C"
                strokeWidth="1.5"
                className="transition-all duration-500 ease-out shadow-sm"
              />
            );
          })}
        </svg>
      </div>

      {showLabels && (
        <div className="mt-4 w-full max-w-xs space-y-2 text-xs">
          {labels.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span className={item.val < 50 ? 'font-medium text-stone-800 dark:text-stone-200' : ''}>
                {item.start}
              </span>
              <div className="mx-2 flex-1 h-[2px] bg-stone-200 dark:bg-stone-800 relative rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-700 dark:bg-stone-300 rounded-full"
                  style={{ width: `${item.val}%` }}
                />
              </div>
              <span className={item.val >= 50 ? 'font-medium text-stone-800 dark:text-stone-200' : ''}>
                {item.end}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
