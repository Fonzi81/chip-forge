
import React from 'react';

const LivingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated circuit traces */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 0 60 L 30 60 L 30 30 L 90 30 L 90 90 L 120 90" 
                  stroke="rgb(6 182 212 / 0.3)" strokeWidth="1" fill="none" 
                  strokeDasharray="4,4" className="animate-trace-flow"/>
            <path d="M 60 0 L 60 30 L 90 30 L 90 60 L 30 60 L 30 120" 
                  stroke="rgb(59 130 246 / 0.2)" strokeWidth="0.8" fill="none" 
                  strokeDasharray="3,6" className="animate-trace-flow" 
                  style={{animationDelay: '1.5s'}}/>
          </pattern>
          <pattern id="chip-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect x="85" y="85" width="30" height="30" fill="rgb(6 182 212 / 0.1)" rx="4" 
                  className="animate-data-pulse"/>
            <rect x="82" y="82" width="36" height="36" fill="none" stroke="rgb(6 182 212 / 0.2)" 
                  strokeWidth="1" rx="6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        <rect width="100%" height="100%" fill="url(#chip-pattern)" />
      </svg>

      {/* Floating chip elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-silicon-etch opacity-30"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${10 + (i * 8)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + i}s`
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded border border-cyan-500/30 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-400/40 rounded-sm"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Data flow particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/60 rounded-full animate-code-compile"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Morphing gradient overlays */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-silicon-etch"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-silicon-etch" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl animate-silicon-etch" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default LivingBackground;
