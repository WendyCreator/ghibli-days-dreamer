export interface FormData {
  primaryTask: string;
  numberOfTitles: number;
  numberOfImages: number;
  channelDNAOverride?: string;
  screenshot?: File | null;
}

export interface ParsedOutput {
  channelDNA: string;
  channelDNAJson: string | null;
  titles: string[];
  description: string;
  descriptionHook: string;
  descriptionBody: string;
  timestamps: string[];
  closingQuote: string;
  hashtags: string[];
  story: string;
  plantedDetails: string[];
  endingVisual: string;
  characters: { label: string; description: string }[];
  scenes: string[];
  imagePrompts: string[];
  videoPrompts: string[];
  raw: string;
}

export type AppState = 'form' | 'loading' | 'results' | 'error';
