import React from 'react';
import { ParsedOutput } from '@/types';
import CopyButton from './CopyButton';
import { toast } from '@/hooks/use-toast';

interface DescriptionSectionProps {
  parsed: ParsedOutput;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ parsed }) => {
  const copyHashtag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast({ title: 'Copied!', description: `${tag} copied to clipboard.` });
  };

  const copyAllHashtags = () => {
    navigator.clipboard.writeText(parsed.hashtags.join(' '));
    toast({ title: 'Copied!', description: 'All hashtags copied.' });
  };

  return (
    <div className="space-y-5">
      {/* Hook */}
      {parsed.descriptionHook && (
        <p className="font-display text-base sm:text-lg italic text-foreground/90 leading-relaxed">
          {parsed.descriptionHook}
        </p>
      )}

      {/* Body */}
      {parsed.descriptionBody && (
        <div className="font-body text-sm leading-[1.85] text-foreground/80 whitespace-pre-wrap">
          {parsed.descriptionBody}
        </div>
      )}

      {/* Timestamps */}
      {parsed.timestamps.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Chapters
          </h4>
          {parsed.timestamps.map((ts, i) => {
            const match = ts.match(/^(\d{1,2}:\d{2})\s*(.*)/);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="time-badge">{match?.[1] || ts.slice(0, 5)}</span>
                <span className="font-body text-sm text-muted-foreground">{match?.[2] || ts}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Closing quote */}
      {parsed.closingQuote && (
        <div className="pull-quote">
          <p className="font-display text-base text-muted-foreground">
            {parsed.closingQuote}
          </p>
        </div>
      )}

      {/* Hashtags */}
      {parsed.hashtags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider">
              Hashtags
            </h4>
            <button onClick={copyAllHashtags} className="font-ui text-[10px] text-ochre hover:underline">
              Copy all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parsed.hashtags.map((tag, i) => (
              <button key={i} onClick={() => copyHashtag(tag)} className="hashtag-pill">
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fallback: raw description */}
      {!parsed.descriptionHook && !parsed.descriptionBody && parsed.description && (
        <div className="font-body text-sm leading-[1.85] text-foreground/80 whitespace-pre-wrap">
          {parsed.description}
        </div>
      )}
    </div>
  );
};

export default DescriptionSection;
