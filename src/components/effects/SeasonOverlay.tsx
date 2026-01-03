'use client';

import { useEffect, useState } from 'react';
import { seasonAPI } from '@/lib/api';

export function SeasonOverlay() {
  const [season, setSeason] = useState<{ winter?: boolean; spring?: boolean; summer?: boolean; autumn?: boolean } | null>(null);

  useEffect(() => {
    seasonAPI.get().then(setSeason).catch(() => {});
  }, []);

  if (!season) return null;

  if (season.winter) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <style jsx>{`
          @keyframes snowfall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
          }
          .snowflake {
            position: absolute;
            color: white;
            text-shadow: 0 0 5px rgba(255,255,255,0.8);
            animation: snowfall linear infinite;
          }
        `}</style>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${10 + Math.random() * 15}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    );
  }

  if (season.autumn) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <style jsx>{`
          @keyframes leaffall {
            0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 1; }
            50% { transform: translateY(50vh) rotate(180deg) translateX(50px); }
            100% { transform: translateY(110vh) rotate(360deg) translateX(-50px); opacity: 0.3; }
          }
          .leaf { position: absolute; animation: leaffall linear infinite; }
        `}</style>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="leaf" style={{ left: `${Math.random() * 100}%`, animationDuration: `${8 + Math.random() * 12}s`, animationDelay: `${Math.random() * 5}s`, fontSize: `${15 + Math.random() * 20}px` }}>
            {['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>
    );
  }

  if (season.spring) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <style jsx>{`
          @keyframes petalfall {
            0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(100px); opacity: 0.5; }
          }
          .petal { position: absolute; animation: petalfall linear infinite; }
        `}</style>
        {[...Array(25)].map((_, i) => (
          <div key={i} className="petal" style={{ left: `${Math.random() * 100}%`, animationDuration: `${6 + Math.random() * 8}s`, animationDelay: `${Math.random() * 5}s`, fontSize: `${12 + Math.random() * 15}px` }}>
            {['🌸', '🌺', '💮'][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>
    );
  }

  if (season.summer) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute top-4 right-4 text-6xl animate-pulse opacity-30">☀️</div>
      </div>
    );
  }

  return null;
}
