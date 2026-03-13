import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  { emoji: '🌿', label: 'Analyzing Channel DNA' },
  { emoji: '📜', label: 'Writing Titles & Description' },
  { emoji: '📖', label: 'Crafting the Story' },
  { emoji: '🎭', label: 'Designing Characters' },
  { emoji: '🖼️', label: 'Building Image Prompts' },
  { emoji: '🎞️', label: 'Writing Scene Script' },
  { emoji: '🎥', label: 'Generating Video Prompts' },
  { emoji: '✨', label: 'Compiling Output' },
];

// Realistic timing: stages vary, total ~90 seconds
const stageDurations = [8, 12, 18, 12, 14, 12, 10, 4]; // seconds

const quotes = [
  "Even the smallest story begins with a single detail...",
  "The forest knows before the characters do...",
  "Every frame is a breath. Every breath is a story.",
  "In the quiet, the best stories find their voice...",
  "The mist parts only for those who are patient...",
];

const LoadingView: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Auto-advance stages on realistic timers
  useEffect(() => {
    let stageTime = 0;
    const interval = setInterval(() => {
      stageTime += 1;
      setActiveStage(prev => {
        if (prev >= stages.length - 1) return prev;
        const duration = stageDurations[prev] || 10;
        if (stageTime >= duration) {
          stageTime = 0;
          return prev + 1;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle quotes every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((activeStage + 1) / stages.length) * 100;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-6">
      {/* Floating elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="leaf leaf-1" />
        <div className="leaf leaf-2" />
        <div className="leaf leaf-3" />
        <div className="leaf leaf-4" />
        <div className="leaf leaf-5" />
        <div className="leaf leaf-6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center"
      >
        <span className="text-4xl mb-6 block">✦</span>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Crafting your story…
        </h2>
        <p className="font-ui text-sm text-muted-foreground mb-10">
          <span className="font-medium text-foreground/70">{formatTime(elapsed)}</span> elapsed
        </p>

        {/* Progress bar */}
        <div className="ink-progress-bar mb-10 w-full">
          <div className="ink-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Journey path - stages */}
        <div className="space-y-3 w-full text-left mb-10">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`flex items-center gap-3 font-ui text-sm transition-all duration-500 ${
                i < activeStage
                  ? 'text-forest'
                  : i === activeStage
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground/25'
              }`}
            >
              <span className="text-base w-6 text-center shrink-0">
                {i < activeStage ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" className="inline text-forest">
                    <path
                      d="M3 8 L6 11 L13 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ink-check"
                    />
                  </svg>
                ) : i === activeStage ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {stage.emoji}
                  </motion.span>
                ) : (
                  <span className="opacity-30">{stage.emoji}</span>
                )}
              </span>
              {stage.label}
              {i === activeStage && (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-ochre text-xs"
                >
                  ●
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Cycling quote */}
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.6 }}
            className="font-display text-sm italic text-muted-foreground/60 mb-4"
          >
            "{quotes[quoteIndex]}"
          </motion.p>
        </AnimatePresence>

        <p className="font-ui text-xs text-muted-foreground/40">
          This takes about 90 seconds. The best things do.
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingView;
