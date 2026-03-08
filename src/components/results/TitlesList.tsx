import React from 'react';
import CopyButton from './CopyButton';

interface TitlesListProps {
  titles: string[];
}

const TitlesList: React.FC<TitlesListProps> = ({ titles }) => {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {titles.map((title, i) => (
        <div
          key={i}
          className="group flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-background px-3 sm:px-4 py-2.5 sm:py-3 transition-all hover:border-primary/20 hover:shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 font-ui text-[11px] font-bold text-primary shrink-0">
              {i + 1}
            </span>
            <span className="font-body text-[13px] sm:text-sm leading-snug text-foreground break-words line-clamp-2">{title}</span>
          </div>
          <CopyButton text={title} />
        </div>
      ))}
    </div>
  );
};

export default TitlesList;
