import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Download, RotateCcw, Dna, Sparkles, BookOpen, Users, Palette, Film, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ParsedOutput } from '@/types';
import { generateDownloadText } from '@/lib/parseOutput';
import { toast } from '@/hooks/use-toast';
import SectionCard from './results/SectionCard';
import CopyButton from './results/CopyButton';
import TitlesList from './results/TitlesList';
import StorySection from './results/StorySection';
import CharacterCard from './results/CharacterCard';
import PromptCard from './results/PromptCard';

interface ResultsViewProps {
  parsed: ParsedOutput;
  timestamp: Date;
  onReset: () => void;
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
    <div className="animate-fade-in-up mx-auto max-w-4xl px-4 sm:px-6 pb-20">
      {/* Header */}
      <div className="mb-8 text-center pt-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Your Content is Ready
        </h2>
        <p className="mt-2 font-ui text-sm text-muted-foreground">
          Generated on {timestamp.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" className="font-ui text-xs h-9 gap-1.5" onClick={handleCopyAll}>
          <Copy className="h-3.5 w-3.5" /> Copy All
        </Button>
        <Button variant="outline" size="sm" className="font-ui text-xs h-9 gap-1.5" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
        <Button variant="outline" size="sm" className="font-ui text-xs h-9 gap-1.5" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" /> New Generation
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search content…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 font-ui text-sm h-10 bg-card border-border/60"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mb-5 text-center font-ui text-xs text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? 's' : ''} for "<span className="font-semibold text-foreground">{searchQuery}</span>"
        </p>
      )}

      {/* Jump-to navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-1.5">
        {sectionNav.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-3 py-1.5 font-ui text-[11px] font-medium text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-sm"
          >
            <s.icon className="h-3 w-3" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content sections */}
      <div className="space-y-5">
        {/* Channel DNA */}
        {filtered.channelDNA && (
          <SectionCard id="channel-dna" icon={Dna} title="Channel DNA Analysis" actions={<CopyButton text={filtered.channelDNA} />}>
            <div className="whitespace-pre-wrap font-body text-sm leading-[1.8] text-foreground/85">
              {filtered.channelDNA}
            </div>
            {filtered.channelDNAJson && (
              <pre className="code-block mt-4 text-xs">{filtered.channelDNAJson}</pre>
            )}
          </SectionCard>
        )}

        {/* Titles */}
        {filtered.titles.length > 0 && (
          <SectionCard id="titles" icon={Sparkles} title="Titles" count={filtered.titles.length}>
            <TitlesList titles={filtered.titles} />
          </SectionCard>
        )}

        {/* Story */}
        {filtered.story && (
          <SectionCard id="story" icon={BookOpen} title="Story" actions={<CopyButton text={filtered.story} />}>
            <StorySection text={filtered.story} />
          </SectionCard>
        )}

        {/* Characters */}
        {filtered.characters.length > 0 && (
          <SectionCard id="characters" icon={Users} title="Characters" count={filtered.characters.length}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filtered.characters.map((char, i) => (
                <CharacterCard key={i} char={char} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Image Prompts */}
        {filtered.imagePrompts.length > 0 && (
          <SectionCard id="image-prompts" icon={Palette} title="Image Prompts" count={filtered.imagePrompts.length}>
            <div className="space-y-3">
              {filtered.imagePrompts.map((prompt, i) => (
                <PromptCard key={i} prompt={prompt} index={i} type="image" pairedPrompt={parsed.videoPrompts[i]} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Video Prompts */}
        {filtered.videoPrompts.length > 0 && (
          <SectionCard id="video-prompts" icon={Film} title="Video Prompts" count={filtered.videoPrompts.length}>
            <div className="space-y-3">
              {filtered.videoPrompts.map((prompt, i) => (
                <PromptCard key={i} prompt={prompt} index={i} type="video" pairedPrompt={parsed.imagePrompts[i]} />
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* No results */}
      {searchQuery && totalResults === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted/60 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-ui text-sm text-muted-foreground">No results for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="mt-2 font-ui text-xs text-primary hover:underline">Clear search</button>
        </div>
      )}

      {/* Fallback raw output */}
      {!searchQuery && !parsed.titles.length && !parsed.story && !parsed.imagePrompts.length && (
        <SectionCard id="raw" icon={BookOpen} title="Raw Output" actions={<CopyButton text={parsed.raw} />}>
          <p className="font-ui text-xs text-muted-foreground mb-3">
            Could not parse sections automatically. Showing raw output below.
          </p>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/85">{parsed.raw}</pre>
        </SectionCard>
      )}
    </div>
  );
};

export default ResultsView;
