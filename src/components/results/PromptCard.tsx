import React from 'react';
import { Image, Film, Layers } from 'lucide-react';
import CopyButton from './CopyButton';

interface PromptCardProps {
  prompt: string;
  index: number;
  type: 'image' | 'video';
  pairedPrompt?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index, type, pairedPrompt }) => {
  const cleaned = prompt.replace(/^(?:Image|Video)\s*(?:Prompt\s*)?\d+\s*[:.]?\s*/i, '').trim();

  const firstBreak = cleaned.indexOf('\n');
  const title = firstBreak > 0 ? cleaned.slice(0, firstBreak).trim() : '';
  const body = firstBreak > 0 ? cleaned.slice(firstBreak).trim() : cleaned;

  const Icon = type === 'image' ? Image : Film;

  const pairedText = pairedPrompt
    ? `--- Image Prompt ${index + 1} ---\n${prompt}\n\n--- Video Prompt ${index + 1} ---\n${pairedPrompt}`
    : undefined;

  return (
    <div className="rounded-xl border border-border/40 bg-background/60 overflow-hidden transition-colors hover:bg-accent/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <span className="font-ui text-xs font-bold text-primary">{index + 1}</span>
          </div>
          <div className="min-w-0">
            {title && (
              <p className="font-ui text-sm font-semibold text-foreground leading-snug mb-0.5">{title}</p>
            )}
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-ui text-[11px] text-muted-foreground uppercase tracking-wider">
                {type === 'image' ? 'Image Prompt' : 'Video Prompt'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {pairedText && (
            <CopyButton text={pairedText} label="Pair" icon={<Layers className="h-3 w-3" />} />
          )}
          <CopyButton text={prompt} />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-1">
        <p className="font-body text-[13px] leading-[1.75] text-muted-foreground pl-10">
          {body}
        </p>
      </div>
    </div>
  );
};

export default PromptCard;
