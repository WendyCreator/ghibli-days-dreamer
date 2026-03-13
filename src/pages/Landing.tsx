import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { emoji: '🎬', title: 'AI-Powered Titles', desc: 'Catchy, optimized titles tailored to your channel style.' },
  { emoji: '📖', title: 'Story Generation', desc: 'Full ASMR scripts written in your unique voice.' },
  { emoji: '🎭', title: 'Characters', desc: 'Detailed character descriptions with visual consistency.' },
  { emoji: '🖼️', title: 'Image Prompts', desc: 'Ready-to-use prompts for Ghibli-style thumbnails.' },
  { emoji: '🎥', title: 'Video Prompts', desc: 'Scene-by-scene direction paired with your imagery.' },
  { emoji: '🎞️', title: 'Scene Scripts', desc: 'Full screenplay breakdowns with sound and visual cues.' },
];

const quotes = [
  "Even the smallest story begins with a single detail...",
  "The forest knows before the characters do...",
  "Every frame is a breath. Every breath is a story.",
];

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating leaves */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="leaf leaf-1" />
        <div className="leaf leaf-2" />
        <div className="leaf leaf-3" />
        <div className="leaf leaf-4" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🍃</span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">Ghibli Days Studio</span>
          </div>
          <Link to="/generate">
            <Button size="sm" className="generate-btn font-ui text-xs h-9 rounded-lg">
              Open Studio <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 md:pt-36 md:pb-40">
        <div className="mx-auto max-w-2xl text-center">
          {/* Forest silhouette SVG */}
          <div className="mb-8 flex justify-center opacity-20">
            <svg width="200" height="60" viewBox="0 0 200 60" fill="currentColor" className="text-forest">
              <path d="M20 60 L30 30 L40 60 M50 60 L65 20 L80 60 M90 60 L100 35 L110 60 M120 60 L140 10 L160 60 M165 60 L175 40 L185 60" />
              <path d="M0 60 L10 45 L20 60 M35 60 L45 25 L55 60 M70 60 L85 15 L100 60 M110 60 L125 28 L140 60 M150 60 L165 35 L180 60 M185 60 L195 50 L200 60" opacity="0.5" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
              Ghibli Days
              <br />
              <span className="text-ochre">Studio</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md font-display text-lg sm:text-xl text-muted-foreground italic">
              Your ASMR Content Pipeline
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-lg font-body text-sm sm:text-base leading-relaxed text-muted-foreground"
          >
            Generate titles, descriptions, stories, characters, image and video prompts —
            all styled with a warm Ghibli aesthetic and powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/generate">
              <Button size="lg" className="generate-btn px-10 font-display text-base rounded-xl h-13">
                Begin the Story <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Cycling quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 font-display text-sm italic text-muted-foreground/60"
          >
            "{quotes[0]}"
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Everything You Need</h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              One workflow. Seven outputs. Zero hassle.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="parchment rounded-xl p-5 transition-all hover:shadow-md"
              >
                <span className="text-2xl mb-3 block">{f.emoji}</span>
                <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="mx-auto max-w-lg parchment rounded-2xl px-6 py-10 sm:px-10 sm:py-14 text-center shadow-sm">
          <span className="text-3xl mb-4 block">✦</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Ready to Create?</h2>
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Describe your vision and let the studio handle the rest.
          </p>
          <Link to="/generate" className="mt-8 inline-block">
            <Button size="lg" className="generate-btn px-10 font-display text-sm rounded-xl h-12">
              Begin the Story ✦
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-ui text-xs text-muted-foreground">© {new Date().getFullYear()} Ghibli Days Studio</span>
          <span className="font-ui text-xs text-muted-foreground">Crafted with 🍃</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
