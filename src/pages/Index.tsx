import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingView from '@/components/LoadingView';
import ResultsView from '@/components/ResultsView';
import { AppState, FormData, ParsedOutput } from '@/types';
import { parseOutput } from '@/lib/parseOutput';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [parsed, setParsed] = useState<ParsedOutput | null>(null);
  const [timestamp, setTimestamp] = useState<Date>(new Date());

  const handleSubmit = useCallback(async (data: FormData) => {
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
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

      const { data: responseData, error } = await supabase.functions.invoke('webhook-proxy', {
        body: formData,
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || 'Proxy request failed');
      }

      // n8n may return an array of objects or a single object
      const payload = Array.isArray(responseData) ? responseData[0] : responseData;
      const outputText = payload?.output || JSON.stringify(payload, null, 2);
      const result = parseOutput(outputText);

      setParsed(result);
      setTimestamp(new Date());
      setAppState('results');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast({
          title: 'Request timed out',
          description: 'The generation took too long (>5 minutes). Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation failed',
          description: err.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
      setAppState('form');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('form');
    setParsed(null);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Watercolor blobs */}
      <div className="watercolor-blob-1" />
      <div className="watercolor-blob-2" />

      <Header onReset={handleReset} />

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
