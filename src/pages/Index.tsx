import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingView from '@/components/LoadingView';
import ResultsView from '@/components/ResultsView';
import { AppState, FormData, ParsedOutput } from '@/types';
import { parseOutput } from '@/lib/parseOutput';
import { addToHistory } from '@/lib/historyStore';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const LAST_RESULT_KEY = 'ghibli-days-last-result';

function saveLastResult(parsed: ParsedOutput, timestamp: Date) {
  try {
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify({ parsed, timestamp: timestamp.toISOString() }));
  } catch {}
}

function loadLastResult(): { parsed: ParsedOutput; timestamp: Date } | null {
  try {
    const raw = localStorage.getItem(LAST_RESULT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return { parsed: data.parsed, timestamp: new Date(data.timestamp) };
  } catch {
    return null;
  }
}

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [parsed, setParsed] = useState<ParsedOutput | null>(null);
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [showRestore, setShowRestore] = useState(false);
  const lastFormData = useRef<FormData | null>(null);

  // Check for restorable session
  useEffect(() => {
    const last = loadLastResult();
    if (last && last.parsed.titles.length > 0) {
      setShowRestore(true);
    }
  }, []);

  const handleRestore = useCallback(() => {
    const last = loadLastResult();
    if (last) {
      setParsed(last.parsed);
      setTimestamp(last.timestamp);
      setAppState('results');
      setShowRestore(false);
    }
  }, []);

  const handleSubmit = useCallback(async (data: FormData) => {
    lastFormData.current = data;
    setAppState('loading');
    setShowRestore(false);

    try {
      const formData = new window.FormData();
      formData.append('Primary Task', data.primaryTask);
      formData.append('Number of Titles', String(data.numberOfTitles));
      formData.append('Number of Images', String(data.numberOfImages));
      if (data.channelDNAOverride) {
        formData.append('Channel DNA Override', data.channelDNAOverride);
      }
      if (data.screenshot) {
        formData.append('Screenshot', data.screenshot);
      } else if (!data.channelDNAOverride) {
        formData.append('Channel DNA Override', 'Use a default cozy Ghibli-inspired ASMR aesthetic: soft earthy color palette, hand-drawn warmth, gentle nature motifs, lo-fi ambient mood, whimsical storytelling with peaceful pastoral imagery.');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8 * 60 * 1000);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/webhook-proxy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Request failed (${response.status}): ${errText}`);
      }

      const rawText = await response.text();
      const jsonText = rawText.trim();

      if (!jsonText) {
        throw new Error('Empty response from the generation pipeline. Please try again.');
      }

      const responseData = JSON.parse(jsonText);

      if (!responseData) {
        throw new Error('Empty response from the generation pipeline. Please try again.');
      }

      const payload = Array.isArray(responseData) ? responseData[0] : responseData;

      if (payload?.error) {
        throw new Error(payload.error);
      }
      const outputText = payload?.output || JSON.stringify(payload, null, 2);
      const result = parseOutput(outputText);

      setParsed(result);
      const now = new Date();
      setTimestamp(now);
      setAppState('results');

      saveLastResult(result, now);
      addToHistory(data, result);
    } catch (err: any) {
      const retry = () => {
        if (lastFormData.current) {
          handleSubmit(lastFormData.current);
        }
      };

      if (err.name === 'AbortError') {
        toast({
          title: 'Request timed out',
          description: 'The generation took too long (>8 minutes).',
          variant: 'destructive',
          action: <button onClick={retry} className="shrink-0 rounded-md bg-destructive-foreground/20 px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive-foreground/30 transition-colors">Retry</button>,
        });
      } else {
        toast({
          title: "The forest couldn't reach the workshop",
          description: err.message || 'Please try again when the mist clears.',
          variant: 'destructive',
          action: <button onClick={retry} className="shrink-0 rounded-md bg-destructive-foreground/20 px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive-foreground/30 transition-colors">Retry</button>,
        });
      }
      setAppState('form');
    }
  }, []);

  const handleRerun = useCallback((formData: Omit<FormData, 'screenshot'>) => {
    handleSubmit({ ...formData, screenshot: null });
  }, [handleSubmit]);

  const handleViewResult = useCallback((result: ParsedOutput, ts: Date) => {
    setParsed(result);
    setTimestamp(ts);
    setAppState('results');
  }, []);

  const handleReset = useCallback(() => {
    setAppState('form');
    setParsed(null);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Header onReset={handleReset} onRerun={handleRerun} onViewResult={handleViewResult} />

      <main className="relative z-10">
        {/* Restore last session banner */}
        {showRestore && appState === 'form' && (
          <div className="mx-auto max-w-xl px-4 sm:px-6 mb-6">
            <div className="restore-banner flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">📜</span>
                <span className="font-ui text-sm text-foreground">Restore last session?</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs font-ui" onClick={() => setShowRestore(false)}>
                  Dismiss
                </Button>
                <Button size="sm" className="h-7 text-xs font-ui generate-btn" onClick={handleRestore}>
                  Restore
                </Button>
              </div>
            </div>
          </div>
        )}

        {appState === 'form' && <InputForm onSubmit={handleSubmit} />}
        {appState === 'loading' && <LoadingView />}
        {appState === 'results' && parsed && (
          <ResultsView parsed={parsed} timestamp={timestamp} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default Index;
