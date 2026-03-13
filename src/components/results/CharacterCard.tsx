import React from 'react';
import CopyButton from './CopyButton';

interface CharacterCardProps {
  char: { label: string; description: string };
}

const CharacterCard: React.FC<CharacterCardProps> = ({ char }) => {
  return (
    <div className="parchment rounded-xl p-5 space-y-3 transition-all hover:shadow-md relative overflow-hidden">
      {/* Watermark silhouette */}
      <svg className="absolute bottom-2 right-2 w-16 h-20 text-ochre/5" viewBox="0 0 40 50" fill="currentColor">
        <ellipse cx="20" cy="12" rx="8" ry="10" />
        <path d="M10 22 C10 22 8 50 20 50 C32 50 30 22 30 22" />
      </svg>

      <div className="flex items-start justify-between relative z-10">
        <h4 className="font-display text-base font-semibold text-foreground">{char.label}</h4>
        <CopyButton text={`${char.label}: ${char.description}`} />
      </div>

      {/* Ink divider */}
      <div className="h-px bg-gradient-to-r from-ochre/20 via-ochre/10 to-transparent" />

      <p className="font-body text-[13px] leading-[1.85] text-muted-foreground relative z-10">
        {char.description}
      </p>
    </div>
  );
};

export default CharacterCard;
