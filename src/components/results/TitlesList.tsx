import React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TitlesListProps {
  titles: string[];
}

const TitlesList: React.FC<TitlesListProps> = ({ titles }) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (title: string, idx: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIdx(idx);
    toast({ title: '✓ Copied to clipboard' });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Primary title — large display */}
      {titles[0] && (
        <div className="text-center py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ochre/5 to-transparent rounded-lg" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground relative z-10 px-4">
            {titles[0]}
          </h3>
          <button
            onClick={() => handleCopy(titles[0], 0)}
            className="wax-seal mt-3 mx-auto relative z-10"
            title="Copy title"
          >
            {copiedIdx === 0 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Remaining titles */}
      <div className="grid gap-2 sm:grid-cols-2">
        {titles.slice(1).map((title, i) => {
          const idx = i + 1;
          return (
            <div
              key={idx}
              className="group flex items-center justify-between gap-3 parchment rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-ochre/10 font-display text-[11px] font-bold text-ochre shrink-0">
                  {idx + 1}
                </span>
                <span className="font-body text-[13px] sm:text-sm leading-snug text-foreground break-words line-clamp-2">{title}</span>
              </div>
              <button
                onClick={() => handleCopy(title, idx)}
                className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-ochre transition-colors"
              >
                {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-forest" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TitlesList;
