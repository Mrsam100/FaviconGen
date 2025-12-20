import React from 'react';

const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Field Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

        {/* Animated Aura Blobs - Vibrant & Dynamic */}
        <div 
          className="absolute -top-[10%] -left-[5%] w-[80vw] h-[80vw] bg-violet-400/20 rounded-full blur-[160px] animate-float-slow"
          style={{ animationDuration: '20s' }}
        ></div>
        
        <div 
          className="absolute top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-pink-400/15 rounded-full blur-[140px] animate-float-slow"
          style={{ animationDuration: '18s', animationDelay: '-4s' }}
        ></div>

        <div 
          className="absolute bottom-[10%] left-[10%] w-[90vw] h-[90vw] bg-blue-400/15 rounded-full blur-[180px] animate-float-slow"
          style={{ animationDuration: '25s', animationDelay: '-8s' }}
        ></div>

        <div 
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-amber-300/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: '12s' }}
        ></div>

        {/* Interactive Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}
        ></div>
        
        {/* Grain Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default InteractiveBackground;