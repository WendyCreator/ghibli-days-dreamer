import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Copy, Download, RotateCcw, Dna, BookOpen, Users, Film, Search, X, FileText, Clapperboard, FileType, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ParsedOutput } from '@/types';
import { generateDownloadText } from '@/lib/parseOutput';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import SectionCard from './results/SectionCard';
import CopyButton from './results/CopyButton';
import TitlesList from './results/TitlesList';
import StorySection from './results/StorySection';
import CharacterCard from './results/CharacterCard';
import PromptCard from './results/PromptCard';
import DescriptionSection from './results/DescriptionSection';
import PdfRenderer from './results/PdfRenderer';

interface ResultsViewProps {
  parsed: ParsedOutput;
  timestamp: Date;
  onReset: () => void;
}

const sectionNav = [
  { id: 'titles', label: 'Titles', icon: '🎬' },
  { id: 'description', label: 'Description', icon: '📋' },
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'characters', label: 'Characters', icon: '🎭' },
  { id: 'scenes', label: 'Scenes', icon: '🎞️' },
  { id: 'image-prompts', label: 'Images', icon: '🖼️' },
  { id: 'video-prompts', label: 'Videos', icon: '🎥' },
];

const ResultsView: React.FC<ResultsViewProps> = ({ parsed, timestamp, onReset }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // Intersection Observer for scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [parsed]);

  const handleExportPdf = useCallback(async () => {
    if (!pdfRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const el = pdfRef.current;
      el.style.position = 'fixed';
      el.style.left = '0';
      el.style.top = '0';
      el.style.zIndex = '9999';
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
        width: 794, windowWidth: 794,
      });
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.zIndex = '-1';
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`ghibli-days-${timestamp.toISOString().slice(0, 10)}.pdf`);
      toast({ title: '✓ PDF exported' });
    } catch (err) {
      console.error('PDF export error:', err);
      toast({ title: 'Export failed', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  }, [timestamp]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return parsed;
    const match = (s: string) => s.toLowerCase().includes(q);
    return {
      ...parsed,
      channelDNA: match(parsed.channelDNA) ? parsed.channelDNA : '',
      channelDNAJson: parsed.channelDNAJson && match(parsed.channelDNAJson) ? parsed.channelDNAJson : null,
      titles: parsed.titles.filter(match),
      description: match(parsed.description) ? parsed.description : '',
      story: match(parsed.story) ? parsed.story : '',
      characters: parsed.characters.filter(c => match(c.label) || match(c.description)),
      scenes: parsed.scenes.filter(match),
      imagePrompts: parsed.imagePrompts.filter(match),
      videoPrompts: parsed.videoPrompts.filter(match),
    };
  }, [parsed, searchQuery]);

  const totalResults = filtered.titles.length + filtered.scenes.length + filtered.imagePrompts.length + filtered.videoPrompts.length + filtered.characters.length + (filtered.story ? 1 : 0) + (filtered.description ? 1 : 0) + (filtered.channelDNA ? 1 : 0);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(parsed.raw);
    toast({ title: '✓ Copied everything to clipboard' });
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
    toast({ title: '✓ Download started' });
  }, [parsed, timestamp]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
      <PdfRenderer ref={pdfRef} parsed={parsed} timestamp={timestamp} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center pt-2"
      >
        <span className="text-2xl mb-3 block">✦</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Your Story is Ready
        </h2>
        <p className="mt-2 font-ui text-sm text-muted-foreground">
          {timestamp.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Sticky export bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md py-3 mb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="font-ui text-xs h-8 gap-1.5 rounded-lg" onClick={handleCopyAll}>
            <Copy className="h-3.5 w-3.5" /> Copy Everything
          </Button>
          <Button variant="outline" size="sm" className="font-ui text-xs h-8 gap-1.5 rounded-lg" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" /> Download .txt
          </Button>
          <Button
            variant="outline" size="sm"
            className="font-ui text-xs h-8 gap-1.5 rounded-lg border-ochre/30 text-ochre hover:bg-cream"
            onClick={handleExportPdf} disabled={exporting}
          >
            <FileText className="h-3.5 w-3.5" /> {exporting ? 'Exporting…' : 'Export PDF'}
          </Button>
          <Button variant="outline" size="sm" className="font-ui text-xs h-8 gap-1.5 rounded-lg" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" /> Start New Story
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search content…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 font-ui text-sm h-10 bg-card border-border/60 rounded-lg"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mb-4 text-center font-ui text-xs text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? 's' : ''} for "<span className="font-semibold text-foreground">{searchQuery}</span>"
        </p>
      )}

      {/* Section navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-1.5">
        {sectionNav.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-3 py-1.5 font-ui text-[11px] font-medium text-muted-foreground transition-all hover:bg-ochre hover:text-white hover:border-ochre hover:shadow-sm active:scale-95"
          >
            <span className="text-xs">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content sections */}
      <div className="space-y-5">
        {filtered.channelDNA && (
          <div className="reveal-section">
            <SectionCard id="channel-dna" icon={Dna} title="Channel DNA Analysis" actions={<CopyButton text={filtered.channelDNA} />}>
              <div className="whitespace-pre-wrap font-body text-[13px] leading-[1.85] text-foreground/80">
                {filtered.channelDNA}
              </div>
              {filtered.channelDNAJson && (
                <pre className="code-block mt-4 text-xs">{filtered.channelDNAJson}</pre>
              )}
            </SectionCard>
          </div>
        )}

        {filtered.titles.length > 0 && (
          <div className="reveal-section">
            <SectionCard id="titles" icon={FileType} title="Titles" count={filtered.titles.length}>
              <TitlesList titles={filtered.titles} />
            </SectionCard>
          </div>
        )}

        {filtered.description && (
          <div className="reveal-section">
            <SectionCard id="description" icon={FileText} title="Description" actions={<CopyButton text={filtered.description} label="Copy Full Description" size="md" />}>
              <DescriptionSection parsed={filtered as ParsedOutput} />
            </SectionCard>
          </div>
        )}

        {filtered.story && (
          <div className="reveal-section">
            <SectionCard id="story" icon={BookOpen} title="Story" actions={<CopyButton text={filtered.story} label="Copy Story" size="md" />}>
              <StorySection
                text={filtered.story}
                plantedDetails={parsed.plantedDetails}
                endingVisual={parsed.endingVisual}
              />
            </SectionCard>
          </div>
        )}

        {filtered.characters.length > 0 && (
          <div className="reveal-section">
            <SectionCard
              id="characters"
              icon={Users}
              title="Characters"
              count={filtered.characters.length}
              actions={<CopyButton text={parsed.characters.map(c => `${c.label}: ${c.description}`).join('\n\n')} label="Copy All" size="md" />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.characters.map((char, i) => (
                  <CharacterCard key={i} char={char} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {filtered.scenes.length > 0 && (
          <div className="reveal-section">
            <SectionCard
              id="scenes"
              icon={Clapperboard}
              title="Scenes"
              count={filtered.scenes.length}
              actions={<CopyButton text={parsed.scenes.join('\n\n---\n\n')} label="Copy Full Script" size="md" />}
            >
              <div className="space-y-3">
                {filtered.scenes.map((scene, i) => (
                  <PromptCard key={i} prompt={scene} index={i} type="scene" />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {filtered.imagePrompts.length > 0 && (
          <div className="reveal-section">
            <SectionCard
              id="image-prompts"
              icon={Image}
              title="Image Prompts"
              count={filtered.imagePrompts.length}
              actions={<CopyButton text={parsed.imagePrompts.join('\n\n---\n\n')} label="Copy All Image Prompts" size="md" />}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-ochre/10 px-3 py-1 mb-4">
                <span className="font-ui text-xs font-medium text-ochre">{filtered.imagePrompts.length} prompts ready</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.imagePrompts.map((prompt, i) => (
                  <PromptCard key={i} prompt={prompt} index={i} type="image" pairedPrompt={parsed.videoPrompts[i]} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {filtered.videoPrompts.length > 0 && (
          <div className="reveal-section">
            <SectionCard
              id="video-prompts"
              icon={Film}
              title="Video Prompts"
              count={filtered.videoPrompts.length}
              actions={<CopyButton text={parsed.videoPrompts.join('\n\n---\n\n')} label="Copy All Video Prompts" size="md" />}
            >
              <div className="space-y-3">
                {filtered.videoPrompts.map((prompt, i) => (
                  <PromptCard key={i} prompt={prompt} index={i} type="video" pairedPrompt={parsed.imagePrompts[i]} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {/* No results */}
      {searchQuery && totalResults === 0 && (
        <div className="text-center py-16">
          <span className="text-3xl block mb-4">🔍</span>
          <p className="font-ui text-sm text-muted-foreground">No results for "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="mt-2 font-ui text-xs text-ochre hover:underline">Clear search</button>
        </div>
      )}

      {/* Fallback raw output */}
      {!searchQuery && !parsed.titles.length && !parsed.story && !parsed.imagePrompts.length && !parsed.description && (
        <SectionCard id="raw" icon={BookOpen} title="Raw Output" actions={<CopyButton text={parsed.raw} />}>
          <p className="font-ui text-xs text-muted-foreground mb-3">
            Could not parse sections automatically. Showing raw output below.
          </p>
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/80">{parsed.raw}</pre>
        </SectionCard>
      )}
    </div>
  );
};

export default ResultsView;
