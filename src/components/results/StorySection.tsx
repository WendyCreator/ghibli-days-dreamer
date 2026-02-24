import React from 'react';

interface StorySectionProps {
  text: string;
}

const StorySection: React.FC<StorySectionProps> = ({ text }) => {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  return (
    <div className="max-w-none prose-sm">
      <div className="space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-body text-[0.925rem] leading-[1.9] text-foreground/90 first-letter:text-lg first-letter:font-semibold first-letter:text-foreground"
          >
            {p.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StorySection;
