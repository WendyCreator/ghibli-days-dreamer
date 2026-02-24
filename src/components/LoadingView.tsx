import React, { useState, useEffect } from 'react';

const stages = [
  '✦ Analyzing channel DNA...',
  '✦ Crafting titles...',
  '✦ Writing the story...',
  '✦ Designing characters...',
  '✦ Generating image prompts...',
  '✦ Creating video prompts...',
  '✦ Compiling your document...',
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
    <div className="animate-fade-in-up mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6">
      {/* Floating leaves */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="leaf leaf-1" />
        <div className="leaf leaf-2" />
        <div className="leaf leaf-3" />
        <div className="leaf leaf-4" />
        <div className="leaf leaf-5" />
        <div className="leaf leaf-6" />
      </div>

      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
        Your Ghibli world is being painted...
      </h2>
      <p className="font-ui text-sm text-muted-foreground mb-10">
        This takes about 2–3 minutes. Please be patient.
      </p>

      {/* Progress bar */}
      <div className="ink-progress-bar mb-10 w-full max-w-md">
        <div className="ink-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Stages */}
      <div className="space-y-3 w-full max-w-md">
        {stages.map((stage, i) => (
          <div
            key={i}
            className={`font-ui text-sm transition-all duration-700 ${
              i <= activeStage
                ? 'text-foreground opacity-100'
                : 'text-muted-foreground/40 opacity-60'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingView;
