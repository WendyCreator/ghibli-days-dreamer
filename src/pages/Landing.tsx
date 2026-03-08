import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, Film, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Sparkles, title: 'AI-Powered Titles', desc: 'Catchy, optimized titles tailored to your channel style.' },
  { icon: BookOpen, title: 'Story Generation', desc: 'Full ASMR scripts written in your unique voice.' },
  { icon: Palette, title: 'Image Prompts', desc: 'Ready-to-use prompts for Ghibli-style thumbnails.' },
  { icon: Film, title: 'Video Prompts', desc: 'Scene-by-scene direction paired with your imagery.' },
];

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Nav */}
      <nav className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">Ghibli Days</span>
          </div>
          <Link to="/generate">
            <Button size="sm" className="generate-btn font-ui text-xs h-9 rounded-lg">
              Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-36">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="font-ui text-xs font-medium text-accent-foreground">AI-Powered Content</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
            Create ASMR
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">
              Content
            </span>
            {' '}in Minutes
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-body text-sm sm:text-base leading-relaxed text-muted-foreground">
            Generate titles, stories, characters, image and video prompts — all styled with a Ghibli aesthetic and powered by AI.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/generate">
              <Button size="lg" className="generate-btn px-8 font-ui text-sm rounded-xl h-12">
                Start Generating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="font-ui text-sm rounded-xl h-12">
                See Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Everything You Need</h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              One workflow. Six outputs. Zero hassle.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <f.icon className="h-4.5 w-4.5 text-accent-foreground" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-card px-6 py-10 sm:px-10 sm:py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Ready to Create?</h2>
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Describe your vision and let AI handle the rest.
          </p>
          <Link to="/generate" className="mt-8 inline-block">
            <Button size="lg" className="generate-btn px-10 font-ui text-sm rounded-xl h-12">
              Get Started ✦
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-ui text-xs text-muted-foreground">© {new Date().getFullYear()} Ghibli Days</span>
          <span className="font-ui text-xs text-muted-foreground">Crafted with ✦</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
