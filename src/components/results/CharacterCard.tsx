import React from 'react';
import { User } from 'lucide-react';
import CopyButton from './CopyButton';

interface CharacterCardProps {
  char: { label: string; description: string };
}

const CharacterCard: React.FC<CharacterCardProps> = ({ char }) => {
  return (
    <div className="rounded-xl border border-border/40 bg-background/60 p-5 space-y-3 transition-colors hover:bg-accent/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-ui text-sm font-bold text-foreground">{char.label}</span>
        </div>
        <CopyButton text={`${char.label}: ${char.description}`} />
      </div>
      <p className="font-body text-sm leading-[1.75] text-muted-foreground pl-[42px]">
        {char.description}
      </p>
    </div>
  );
};

export default CharacterCard;
