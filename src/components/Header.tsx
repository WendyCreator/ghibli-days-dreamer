import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import HistoryPanel from './HistoryPanel';
import { FormData, ParsedOutput } from '@/types';

const WEBHOOK_KEY = 'ghibli-days-webhook-url';
const DEFAULT_WEBHOOK = 'https://n8n.zaicondigital.com/webhook/ghibliautomation';

export function getWebhookUrl(): string {
  return localStorage.getItem(WEBHOOK_KEY) || DEFAULT_WEBHOOK;
}

export function setWebhookUrl(url: string) {
  localStorage.setItem(WEBHOOK_KEY, url);
}

interface HeaderProps {
  onReset?: () => void;
  onRerun?: (formData: Omit<FormData, 'screenshot'>) => void;
  onViewResult?: (parsed: ParsedOutput, timestamp: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onRerun, onViewResult }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(getWebhookUrl());
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleSave = useCallback(() => {
    setWebhookUrl(url.trim());
    setOpen(false);
  }, [url]);

  return (
    <header className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 md:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <button onClick={onReset} className="group flex items-center gap-2.5 text-left min-w-0">
          <span className="text-xl group-hover:scale-110 transition-transform">🍃</span>
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold leading-tight tracking-tight text-foreground truncate">
              Ghibli Days Studio
            </h1>
            <p className="font-ui text-[10px] sm:text-[11px] tracking-wider text-muted-foreground uppercase font-medium">
              Content Pipeline
            </p>
          </div>
        </button>

        <div className="flex items-center gap-0.5">
          {onRerun && onViewResult && (
            <HistoryPanel onRerun={onRerun} onViewResult={onViewResult} />
          )}

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9" onClick={() => setDark(d => !d)}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="font-display">Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="font-ui text-sm font-medium text-foreground">Webhook URL</label>
                  <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://your-n8n.app/webhook/..."
                    className="mt-1.5 font-ui"
                  />
                  <p className="mt-1 font-ui text-xs text-muted-foreground">
                    Stored locally in your browser.
                  </p>
                </div>
                <Button onClick={handleSave} className="w-full generate-btn font-ui">
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="brushstroke-divider mx-auto mt-3 max-w-4xl" />
    </header>
  );
};

export default Header;
