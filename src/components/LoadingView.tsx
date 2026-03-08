import React, { useState, useEffect } from 'react';

const stages = [
  'Analyzing channel DNA…',
  'Crafting titles…',
  'Writing the story…',
  'Designing characters…',
  'Generating image prompts…',
  'Creating video prompts…',
  'Compiling your document…',
];

const LoadingView: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const progress = ((activeStage + 1) / stages.length) * 100;

  return (
    <div className="animate-fade-in-up mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="leaf leaf-1" />
        <div className="leaf leaf-2" />
        <div className="leaf leaf-3" />
        <div className="leaf leaf-4" />
        <div className="leaf leaf-5" />
        <div className="leaf leaf-6" />
      </div>

      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-accent mb-6">
        <span className="text-2xl">✦</span>
      </div>

      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">
        Generating your content…
      </h2>
      <p className="font-ui text-sm text-muted-foreground mb-10 text-center">
        This takes about 2–3 minutes
      </p>

      {/* Progress bar */}
      <div className="ink-progress-bar mb-10 w-full">
        <div className="ink-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Stages */}
      <div className="space-y-2.5 w-full">
        {stages.map((stage, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 font-ui text-sm transition-all duration-500 ${
              i < activeStage
                ? 'text-primary'
                : i === activeStage
                ? 'text-foreground font-medium'
                : 'text-muted-foreground/30'
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-500 ${
              i < activeStage ? 'bg-primary' : i === activeStage ? 'bg-foreground' : 'bg-muted-foreground/20'
            }`} />
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingView;
