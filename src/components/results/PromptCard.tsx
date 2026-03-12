import React from 'react';
import { Image, Film, Layers, Clapperboard } from 'lucide-react';
import CopyButton from './CopyButton';

interface PromptCardProps {
  prompt: string;
  index: number;
  type: 'image' | 'video' | 'scene';
  pairedPrompt?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index, type, pairedPrompt }) => {
  const cleaned = prompt.replace(/^(?:Image|Video|Scene)\s*(?:Prompt\s*)?\d+\s*[:.]?\s*/i, '').trim();
  const firstBreak = cleaned.indexOf('\n');
  const title = firstBreak > 0 ? cleaned.slice(0, firstBreak).trim() : '';
  const body = firstBreak > 0 ? cleaned.slice(firstBreak).trim() : cleaned;

  const Icon = type === 'image' ? Image : type === 'video' ? Film : Clapperboard;

  const pairedText = pairedPrompt
    ? `--- Image Prompt ${index + 1} ---\n${prompt}\n\n--- Video Prompt ${index + 1} ---\n${pairedPrompt}`
    : undefined;

  return (
    <div className="rounded-xl border border-border/40 bg-background overflow-hidden transition-all hover:border-primary/20 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 shrink-0 mt-0.5">
            <span className="font-ui text-xs font-bold text-primary">{index + 1}</span>
          </div>
          <div className="min-w-0">
            {title && (
              <p className="font-display text-sm font-semibold text-foreground leading-snug mb-1">{title}</p>
            )}
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-ui text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                {type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'Scene'} Prompt
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
      <div className="px-4 pb-4 pt-1">
        <p className="font-body text-[13px] leading-[1.8] text-muted-foreground pl-10 break-words">
          {body}
        </p>
      </div>
    </div>
  );
};

export default PromptCard;
