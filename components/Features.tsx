import React, { useEffect, useRef } from 'react';

const Features: React.FC = () => {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const featureList = [
    {
      title: "Visual Intelligence",
      desc: "Gemini AI analyzes your brand geometry to calculate perfect padding and contrast automatically.",
      icon: "🎨",
      gradient: "from-violet-500/20 to-indigo-500/20",
      accent: "bg-violet-600",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Production Ready",
      desc: "One click exports iOS touch icons, Android splash assets, and legacy favicon.ico formats.",
      icon: "🚀",
      gradient: "from-pink-500/20 to-rose-500/20",
      accent: "bg-pink-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Live Simulation",
      desc: "Preview your assets in real-time within browser tab and home screen mockups.",
      icon: "👀",
      gradient: "from-blue-500/20 to-cyan-500/20",
      accent: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-12 max-w-[1400px] mx-auto space-y-20 sm:space-y-32">
      <div className="text-center space-y-6 sm:space-y-8">
        <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-violet-600">Infrastructure</span>
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-tight">
          Built for <span className="text-gradient">Production.</span>
        </h2>
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium px-4">
          Professional grade asset pipelines for teams that value design consistency and platform accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {featureList.map((feature, i) => (
          <div 
            key={i}
            ref={el => revealRefs.current[i] = el}
            className="reveal glass-card p-8 sm:p-10 rounded-[40px] sm:rounded-[50px] space-y-8 sm:space-y-10 hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
          >
            {/* Background Accent Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

            <div className="relative z-10 space-y-6 sm:space-y-10">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl ${feature.accent} flex items-center justify-center text-3xl sm:text-4xl text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                {feature.icon}
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>

                <div className="relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
                <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] brightness-95" 
                    onLoad={(e) => (e.currentTarget.parentElement!.style.background = 'transparent')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;