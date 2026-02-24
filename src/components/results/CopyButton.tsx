import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label, size = 'sm' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 transition-all hover:bg-accent hover:border-border ${
        size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs'
      } font-ui text-muted-foreground hover:text-foreground shrink-0`}
    >
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
      {label || (copied ? 'Copied!' : 'Copy')}
    </button>
  );
};

export default CopyButton;
