import React from 'react';
import { User } from 'lucide-react';
import CopyButton from './CopyButton';

interface CharacterCardProps {
  char: { label: string; description: string };
}

const CharacterCard: React.FC<CharacterCardProps> = ({ char }) => {
  return (
    <div className="rounded-xl border border-border/40 bg-background p-4 space-y-2.5 transition-all hover:border-primary/20 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-accent">
            <User className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">{char.label}</span>
        </div>
        <CopyButton text={`${char.label}: ${char.description}`} />
      </div>
      <p className="font-body text-[13px] leading-[1.8] text-muted-foreground pl-[46px]">
        {char.description}
      </p>
    </div>
  );
};

export default CharacterCard;
