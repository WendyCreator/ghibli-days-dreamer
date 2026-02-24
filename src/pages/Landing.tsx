import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Sparkles, Palette, Film, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Sparkles, title: 'AI-Powered Titles', desc: 'Generate catchy, optimized titles tailored to your channel.' },
  { icon: BookOpen, title: 'Story Generation', desc: 'Full ASMR scripts written in your unique voice and style.' },
  { icon: Palette, title: 'Image Prompts', desc: 'Ready-to-use prompts for stunning Ghibli-style thumbnails.' },
  { icon: Film, title: 'Video Prompts', desc: 'Scene-by-scene video direction paired with your imagery.' },
];

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <div className="watercolor-blob-1" />
      <div className="watercolor-blob-2" />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight text-foreground">Ghibli Days</span>
          </div>
          <Link to="/generate">
            <Button size="sm" className="generate-btn bg-primary font-ui">
              Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-20 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-ui text-xs font-medium text-muted-foreground">AI-Powered ASMR Content</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl md:leading-[1.1]">
            Create Beautiful
            <br />
            <span className="text-primary">ASMR Content</span>
            <br />
            in Minutes
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">
            Generate titles, stories, characters, image prompts, and video direction — all styled with a hand-painted Ghibli aesthetic and powered by AI.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/generate">
              <Button size="lg" className="generate-btn bg-primary px-8 font-ui text-base">
                Start Generating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="font-ui text-base">
                See Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="brushstroke-divider mx-auto max-w-5xl" />

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Everything You Need</h2>
            <p className="mt-3 font-body text-sm text-muted-foreground md:text-base">
              One workflow. Six content outputs. Zero hassle.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="ghibli-card rounded-xl border border-border/50 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="ghibli-card mx-auto max-w-2xl rounded-2xl border border-border/50 px-8 py-12 text-center md:px-16">
          <Leaf className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Ready to Create?</h2>
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Upload your channel screenshot, describe your vision, and let AI do the rest.
          </p>
          <Link to="/generate" className="mt-8 inline-block">
            <Button size="lg" className="generate-btn bg-primary px-10 font-ui text-base">
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
