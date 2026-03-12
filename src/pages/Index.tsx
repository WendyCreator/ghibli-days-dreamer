import React, { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingView from '@/components/LoadingView';
import ResultsView from '@/components/ResultsView';
import { AppState, FormData, ParsedOutput } from '@/types';
import { parseOutput } from '@/lib/parseOutput';
import { addToHistory } from '@/lib/historyStore';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [parsed, setParsed] = useState<ParsedOutput | null>(null);
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const lastFormData = useRef<FormData | null>(null);

  const handleSubmit = useCallback(async (data: FormData) => {
    lastFormData.current = data;
    setAppState('loading');

    try {
      const formData = new window.FormData();
      formData.append('Primary Task', data.primaryTask);
      formData.append('Number of Titles', String(data.numberOfTitles));
      formData.append('Number of Images', String(data.numberOfImages));
      if (data.screenshot) {
        formData.append('Screenshot', data.screenshot);
      } else {
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
        throw new Error(`Proxy request failed (${response.status}): ${errText}`);
      }

      // Read the streaming response (contains keepalive spaces + JSON at end)
      const rawText = await response.text();
      // Strip keepalive spaces to get the JSON payload
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

      // Save to history
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
          description: 'The generation took too long (>8 minutes). Scene generation may need more time.',
          variant: 'destructive',
          action: <button onClick={retry} className="shrink-0 rounded-md bg-destructive-foreground/20 px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive-foreground/30 transition-colors">Retry</button>,
        });
      } else {
        toast({
          title: 'Generation failed',
          description: err.message || 'Something went wrong.',
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
      <div className="watercolor-blob-1" />
      <div className="watercolor-blob-2" />

      <Header onReset={handleReset} onRerun={handleRerun} onViewResult={handleViewResult} />

      <main className="relative z-10">
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
