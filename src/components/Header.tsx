import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Leaf, Moon, Sun } from 'lucide-react';
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
    <header className="relative z-10 px-4 py-4 sm:px-6 sm:py-6 md:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <button onClick={onReset} className="group flex items-center gap-2 sm:gap-3 text-left min-w-0">
          <div className="relative shrink-0">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary transition-transform group-hover:rotate-12" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight text-foreground truncate">
              Ghibli Days
            </h1>
            <p className="font-ui text-[10px] sm:text-xs tracking-widest text-muted-foreground uppercase">
              ASMR Content Generator
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {onRerun && onViewResult && (
            <HistoryPanel onRerun={onRerun} onViewResult={onViewResult} />
          )}

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setDark(d => !d)}>
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-display">Webhook Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="font-ui text-sm font-medium text-foreground">n8n Webhook URL</label>
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://your-n8n.app/webhook/..."
                  className="mt-1.5 font-ui"
                />
                <p className="mt-1 font-ui text-xs text-muted-foreground">
                  Paste your n8n webhook URL here. It will be stored locally in your browser.
                </p>
              </div>
              <Button onClick={handleSave} className="w-full generate-btn bg-primary font-ui">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
      <div className="brushstroke-divider mx-auto mt-3 sm:mt-4 max-w-4xl" />
    </header>
  );
};

export default Header;
