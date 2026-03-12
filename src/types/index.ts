export interface FormData {
  primaryTask: string;
  numberOfTitles: number;
  numberOfImages: number;
  screenshot?: File | null;
}

export interface ParsedOutput {
  channelDNA: string;
  channelDNAJson: string | null;
  titles: string[];
  story: string;
  characters: { label: string; description: string }[];
  scenes: string[];
  imagePrompts: string[];
  videoPrompts: string[];
  raw: string;
}

export type AppState = 'form' | 'loading' | 'results' | 'error';
