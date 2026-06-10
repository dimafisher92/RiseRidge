'use client';

import { useEffect, useState } from 'react';

function colorForScore(score: number): string {
  if (score >= 80) return '#00D4AA'; // success
  if (score >= 50) return '#FF8C42'; // gold
  return '#FF5470'; // low / danger
}

interface ScoreGaugeProps {
  score: number;
  size?: number;
  stroke?: number;
  /** When true, the numeric score is hidden behind a blur (lead gate). */
  blurred?: boolean;
  label?: string;
  animate?: boolean;
}

export function ScoreGauge({
  score,
  size = 176,
  stroke = 12,
  blurred = false,
  label = '/ 100',
  animate = true,
}: ScoreGaugeProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = colorForScore(score);

  // Count-up + ring sweep animation.
  const [display, setDisplay] = useState(animate ? 0 : score);
  useEffect(() => {
    if (!animate) {
      setDisplay(score);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, animate]);

  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1B3A5C"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display font-[800] text-5xl tabular-nums transition-all ${
            blurred ? 'blur-md select-none' : ''
          }`}
          style={{ color }}
        >
          {blurred ? '00' : display}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{label}</span>
      </div>
    </div>
  );
}
