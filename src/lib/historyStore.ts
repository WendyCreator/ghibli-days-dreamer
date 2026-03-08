import { FormData, ParsedOutput } from '@/types';

export interface HistoryEntry {
  id: string;
  formData: Omit<FormData, 'screenshot'>;
  parsed: ParsedOutput;
  timestamp: string; // ISO string
}

const HISTORY_KEY = 'ghibli-days-history';
const MAX_ENTRIES = 20;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(formData: FormData, parsed: ParsedOutput): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    formData: {
      primaryTask: formData.primaryTask,
      numberOfTitles: formData.numberOfTitles,
      numberOfImages: formData.numberOfImages,
    },
    parsed,
    timestamp: new Date().toISOString(),
  };

  const history = getHistory();
  history.unshift(entry);
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return entry;
}

export function deleteFromHistory(id: string) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
