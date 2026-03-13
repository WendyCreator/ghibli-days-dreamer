import React from 'react';
import { ParsedOutput } from '@/types';

interface StorySectionProps {
  text: string;
  plantedDetails?: string[];
  endingVisual?: string;
}

const StorySection: React.FC<StorySectionProps> = ({ text, plantedDetails, endingVisual }) => {
  // Remove planted details and ending visual from main text to avoid duplication
  let mainText = text;
  if (endingVisual) {
    mainText = mainText.replace(/\[ENDING\s+VISUAL\s*:?\s*[\s\S]*?\]/i, '').trim();
    mainText = mainText.replace(/ENDING\s+VISUAL\s*:?\s*\n[\s\S]*$/i, '').trim();
  }

  const paragraphs = mainText.split(/\n\n+/).filter(p => p.trim().length > 0);

  // Detect dialogue lines for pull-quote styling
  const isDialogue = (p: string) => /^[""]/.test(p.trim()) || /^—/.test(p.trim());

  return (
    <div className="max-w-none space-y-6">
      {/* Planted Details — evidence board */}
      {plantedDetails && plantedDetails.length > 0 && (
        <div className="mb-8">
          <h4 className="font-display text-xs font-semibold text-ochre uppercase tracking-wider mb-4">
            ✦ Three Planted Details
          </h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {plantedDetails.map((detail, i) => (
              <div
                key={i}
                className="parchment rounded-lg p-4 relative"
              >
                <span className="absolute top-2 right-3 font-display text-3xl text-ochre/10 font-bold">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed relative z-10">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Story body */}
      <div className="space-y-5">
        {paragraphs.map((p, i) => {
          if (isDialogue(p)) {
            return (
              <div key={i} className="pull-quote">
                <p className="font-body text-sm leading-[1.9] text-muted-foreground">
                  {p.trim()}
                </p>
              </div>
            );
          }
          return (
            <p
              key={i}
              className={`font-body text-[15px] leading-[1.9] text-foreground/85 ${i === 0 ? 'drop-cap' : ''}`}
            >
              {p.trim()}
            </p>
          );
        })}
      </div>

      {/* Ending Visual */}
      {endingVisual && (
        <div className="ending-visual mt-8">
          <p className="font-display text-base sm:text-lg relative z-10 leading-relaxed">
            {endingVisual}
          </p>
        </div>
      )}
    </div>
  );
};

export default StorySection;
