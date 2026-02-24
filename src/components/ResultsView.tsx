import React, { useState, useCallback, useRef } from 'react';
import { Copy, Download, RotateCcw, Check, Dna, Sparkles, BookOpen, Users, Palette, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ParsedOutput } from '@/types';
import { generateDownloadText } from '@/lib/parseOutput';
import { toast } from '@/hooks/use-toast';

interface ResultsViewProps {
  parsed: ParsedOutput;
  timestamp: Date;
  onReset: () => void;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

const sectionNav = [
  { id: 'channel-dna', label: 'Channel DNA', icon: Dna },
  { id: 'titles', label: 'Titles', icon: Sparkles },
  { id: 'story', label: 'Story', icon: BookOpen },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'image-prompts', label: 'Images', icon: Palette },
  { id: 'video-prompts', label: 'Videos', icon: Film },
];

const ResultsView: React.FC<ResultsViewProps> = ({ parsed, timestamp, onReset }) => {
  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(parsed.raw);
    toast({ title: 'Copied!', description: 'All content copied to clipboard.' });
  }, [parsed]);

  const handleDownload = useCallback(() => {
    const text = generateDownloadText(parsed);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghibli-days-${timestamp.toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [parsed, timestamp]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="animate-fade-in-up mx-auto max-w-4xl px-6 pb-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Your Content is Ready ✦
        </h2>
        <p className="mt-1 font-ui text-sm text-muted-foreground">
          Generated on {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString()}
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" className="font-ui" onClick={handleCopyAll}>
          <Copy className="mr-1.5 h-4 w-4" /> Copy All
        </Button>
        <Button variant="outline" size="sm" className="font-ui" onClick={handleDownload}>
          <Download className="mr-1.5 h-4 w-4" /> Download .txt
        </Button>
        <Button variant="outline" size="sm" className="font-ui" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" /> Generate Again
        </Button>
      </div>

      {/* Section nav */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {sectionNav.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-ui text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <Accordion type="multiple" defaultValue={['channel-dna', 'titles', 'story', 'characters', 'image-prompts', 'video-prompts']}>

        {/* Channel DNA */}
        <AccordionItem value="channel-dna" id="channel-dna" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Dna className="h-5 w-5 text-primary" /> Channel DNA Analysis</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-end mb-2"><CopyBtn text={parsed.channelDNA} /></div>
            <div className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
              {parsed.channelDNA}
            </div>
            {parsed.channelDNAJson && (
              <pre className="code-block mt-4 text-xs">{parsed.channelDNAJson}</pre>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Titles */}
        <AccordionItem value="titles" id="titles" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-secondary" /> Titles</span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-3">
              {parsed.titles.map((title, i) => (
                <li key={i} className="flex items-start justify-between gap-3 rounded-md border border-border/50 bg-background/50 p-3">
                  <span className="font-body text-sm">
                    <span className="font-ui text-xs font-semibold text-muted-foreground mr-2">{i + 1}.</span>
                    {title}
                  </span>
                  <CopyBtn text={title} />
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>

        {/* Story */}
        <AccordionItem value="story" id="story" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Story</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-end mb-2"><CopyBtn text={parsed.story} /></div>
            <div className="whitespace-pre-wrap font-body text-base leading-[1.8] text-foreground">
              {parsed.story}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Characters */}
        <AccordionItem value="characters" id="characters" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-secondary" /> Characters</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {parsed.characters.map((char, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 font-ui text-xs font-semibold text-primary">
                      {char.label}
                    </span>
                    <CopyBtn text={`${char.label}: ${char.description}`} />
                  </div>
                  <p className="font-body text-sm leading-relaxed text-foreground">{char.description}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Image Prompts */}
        <AccordionItem value="image-prompts" id="image-prompts" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Image Prompts</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {parsed.imagePrompts.map((prompt, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-body text-sm leading-relaxed">
                      <span className="font-ui text-xs font-bold text-muted-foreground mr-2">#{i + 1}</span>
                      {prompt}
                    </span>
                    <CopyBtn text={prompt} />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Video Prompts */}
        <AccordionItem value="video-prompts" id="video-prompts" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Film className="h-5 w-5 text-secondary" /> Video Prompts</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {parsed.videoPrompts.map((prompt, i) => (
                <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-body text-sm leading-relaxed">
                      <span className="font-ui text-xs font-bold text-muted-foreground mr-2">
                        🎬 #{i + 1} <span className="text-muted-foreground/60">(Image #{i + 1})</span>
                      </span>
                      {prompt}
                    </span>
                    <CopyBtn text={prompt} />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Fallback raw output if parsing found nothing */}
      {!parsed.titles.length && !parsed.story && !parsed.imagePrompts.length && (
        <div className="ghibli-card mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Raw Output</h3>
            <CopyBtn text={parsed.raw} />
          </div>
          <p className="font-ui text-xs text-muted-foreground mb-3">
            ⚠️ Could not parse sections automatically. Showing raw output below.
          </p>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">{parsed.raw}</pre>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
