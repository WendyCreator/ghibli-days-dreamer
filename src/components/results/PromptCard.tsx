import React from 'react';
import { Layers } from 'lucide-react';
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

  const pairedText = pairedPrompt
    ? `--- Image Prompt ${index + 1} ---\n${prompt}\n\n--- Video Prompt ${index + 1} ---\n${pairedPrompt}`
    : undefined;

  // Video prompts: parse cuts and sound layer
  const isVideo = type === 'video';
  const bodyLines = body.split('\n');
  const soundLine = isVideo ? bodyLines.find(l => /sound|audio|ambient/i.test(l)) : undefined;
  const cutLines = isVideo ? bodyLines.filter(l => /\[cut|opening shot|filler/i.test(l)) : [];

  const accentColor = type === 'video' ? 'forest' : type === 'scene' ? 'sage' : 'ochre';

  return (
    <div className={`parchment rounded-xl overflow-hidden transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 mt-0.5 ${
            type === 'video' ? 'bg-forest/10 text-forest' :
            type === 'scene' ? 'bg-sage/10 text-sage' :
            'bg-ochre/10 text-ochre'
          }`}>
            <span className="font-display text-sm font-bold">{index + 1}</span>
          </div>
          <div className="min-w-0">
            {title && (
              <p className="font-display text-sm font-semibold text-foreground leading-snug mb-1">{title}</p>
            )}
            <span className="font-ui text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              {type === 'image' ? '🖼️ Image' : type === 'video' ? '🎥 Video' : '🎞️ Scene'} Prompt
            </span>
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
        {/* Scene: screenplay style with left border */}
        {type === 'scene' ? (
          <div className="screenplay pl-4 ml-8">
            <p className="font-body text-[13px] leading-[1.85] text-muted-foreground break-words whitespace-pre-wrap">
              {body}
            </p>
          </div>
        ) : isVideo && cutLines.length > 0 ? (
          <div className="ml-11 space-y-2">
            <p className="font-body text-[13px] leading-[1.85] text-muted-foreground break-words">
              {bodyLines.filter(l => !cutLines.includes(l) && l !== soundLine).join('\n')}
            </p>
            {cutLines.map((cut, ci) => (
              <div key={ci} className="border-l-2 border-forest/20 pl-3 ml-2">
                <p className="font-body text-xs text-muted-foreground/70">{cut.trim()}</p>
              </div>
            ))}
            {soundLine && (
              <p className="font-body text-xs italic text-muted-foreground/50 mt-2">
                🔊 {soundLine.replace(/^.*?sound\s*(?:layer)?:?\s*/i, '').trim() || soundLine}
              </p>
            )}
          </div>
        ) : (
          <p className="font-body text-[13px] leading-[1.85] text-muted-foreground pl-11 break-words">
            {body}
          </p>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
