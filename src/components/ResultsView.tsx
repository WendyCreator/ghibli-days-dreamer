import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Download, RotateCcw, Check, Dna, Sparkles, BookOpen, Users, Palette, Film, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-ui text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground shrink-0"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

/** Render story text with proper paragraph breaks */
function StoryContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="font-body text-[0.95rem] leading-[1.85] text-foreground first-letter:text-lg first-letter:font-semibold">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

/** Render a single image or video prompt card */
function PromptCard({ prompt, index, type }: { prompt: string; index: number; type: 'image' | 'video' }) {
  // Split prompt into first sentence (scene summary) and rest (details)
  const firstBreak = prompt.indexOf('\n');
  const title = firstBreak > 0 ? prompt.slice(0, firstBreak).trim() : '';
  const body = firstBreak > 0 ? prompt.slice(firstBreak).trim() : prompt.trim();

  return (
    <div className="rounded-lg border border-border/50 bg-background/50 p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 font-ui text-xs font-bold text-primary shrink-0">
            {index + 1}
          </span>
          {title && (
            <span className="font-ui text-sm font-semibold text-foreground">{title.replace(/^(Image|Video)\s*\d+\s*[:.]?\s*/i, '')}</span>
          )}
          {type === 'video' && (
            <span className="text-xs text-muted-foreground/60 font-ui">(🎬 pairs with Image #{index + 1})</span>
          )}
        </div>
        <CopyBtn text={prompt} />
      </div>
      <p className="font-body text-sm leading-relaxed text-muted-foreground pl-8">
        {body}
      </p>
    </div>
  );
}

/** Render a character card */
function CharacterCard({ char }: { char: { label: string; description: string } }) {
  // Try to split description into physical appearance and clothing
  const lines = char.description.split(/[.,]/).map(s => s.trim()).filter(Boolean);

  return (
    <div className="rounded-lg border border-border/50 bg-background/50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-ui text-xs font-bold text-primary tracking-wide uppercase">
          {char.label}
        </span>
        <CopyBtn text={`${char.label}: ${char.description}`} />
      </div>
      <p className="font-body text-sm leading-[1.7] text-foreground">{char.description}</p>
    </div>
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
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return parsed;
    const match = (s: string) => s.toLowerCase().includes(q);
    return {
      ...parsed,
      channelDNA: match(parsed.channelDNA) ? parsed.channelDNA : '',
      channelDNAJson: parsed.channelDNAJson && match(parsed.channelDNAJson) ? parsed.channelDNAJson : null,
      titles: parsed.titles.filter(match),
      story: match(parsed.story) ? parsed.story : '',
      characters: parsed.characters.filter(c => match(c.label) || match(c.description)),
      imagePrompts: parsed.imagePrompts.filter(match),
      videoPrompts: parsed.videoPrompts.filter(match),
    };
  }, [parsed, searchQuery]);

  const totalResults = filtered.titles.length + filtered.imagePrompts.length + filtered.videoPrompts.length + filtered.characters.length + (filtered.story ? 1 : 0) + (filtered.channelDNA ? 1 : 0);

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

      {/* Search bar */}
      <div className="mb-6 relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search titles, prompts, characters…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 font-ui text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mb-4 text-center font-ui text-xs text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}

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
        {filtered.channelDNA && (
          <AccordionItem value="channel-dna" id="channel-dna" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2"><Dna className="h-5 w-5 text-primary" /> Channel DNA Analysis</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end mb-2"><CopyBtn text={filtered.channelDNA} /></div>
              <div className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
                {filtered.channelDNA}
              </div>
              {filtered.channelDNAJson && (
                <pre className="code-block mt-4 text-xs">{filtered.channelDNAJson}</pre>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Titles */}
        {filtered.titles.length > 0 && (
          <AccordionItem value="titles" id="titles" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary-foreground" /> Titles
                <span className="ml-1 text-xs font-normal text-muted-foreground">({filtered.titles.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {filtered.titles.map((title, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-background/50 px-3 py-2.5">
                    <span className="font-body text-sm leading-snug">
                      <span className="font-ui text-xs font-bold text-muted-foreground mr-2">{i + 1}.</span>
                      {title}
                    </span>
                    <CopyBtn text={title} />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Story */}
        {filtered.story && (
          <AccordionItem value="story" id="story" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Story</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end mb-3"><CopyBtn text={filtered.story} /></div>
              <StoryContent text={filtered.story} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Characters */}
        {filtered.characters.length > 0 && (
          <AccordionItem value="characters" id="characters" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Characters
                <span className="ml-1 text-xs font-normal text-muted-foreground">({filtered.characters.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.characters.map((char, i) => (
                  <CharacterCard key={i} char={char} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Image Prompts */}
        {filtered.imagePrompts.length > 0 && (
          <AccordionItem value="image-prompts" id="image-prompts" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Image Prompts
                <span className="ml-1 text-xs font-normal text-muted-foreground">({filtered.imagePrompts.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {filtered.imagePrompts.map((prompt, i) => (
                  <PromptCard key={i} prompt={prompt} index={i} type="image" />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Video Prompts */}
        {filtered.videoPrompts.length > 0 && (
          <AccordionItem value="video-prompts" id="video-prompts" className="ghibli-card mb-4 rounded-lg border border-border bg-card px-6">
            <AccordionTrigger className="font-display text-lg font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" /> Video Prompts
                <span className="ml-1 text-xs font-normal text-muted-foreground">({filtered.videoPrompts.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {filtered.videoPrompts.map((prompt, i) => (
                  <PromptCard key={i} prompt={prompt} index={i} type="video" />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* No results message */}
      {searchQuery && totalResults === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="font-ui text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="mt-2 font-ui text-xs text-primary hover:underline">Clear search</button>
        </div>
      )}

      {/* Fallback raw output if parsing found nothing */}
      {!searchQuery && !parsed.titles.length && !parsed.story && !parsed.imagePrompts.length && (
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
