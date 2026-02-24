import React, { useState, useCallback } from 'react';
import Header, { getWebhookUrl } from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingView from '@/components/LoadingView';
import ResultsView from '@/components/ResultsView';
import { AppState, FormData, ParsedOutput } from '@/types';
import { parseOutput } from '@/lib/parseOutput';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [parsed, setParsed] = useState<ParsedOutput | null>(null);
  const [timestamp, setTimestamp] = useState<Date>(new Date());

  const handleSubmit = useCallback(async (data: FormData) => {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl) {
      toast({ title: 'Webhook not configured', description: 'Please set your n8n webhook URL in settings.', variant: 'destructive' });
      return;
    }

    setAppState('loading');

    try {
      const formData = new window.FormData();
      formData.append('Primary Task', data.primaryTask);
      formData.append('Number of Titles', String(data.numberOfTitles));
      formData.append('Number of Images', String(data.numberOfImages));
      if (data.screenshot) {
        formData.append('Screenshot', data.screenshot);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 min timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const json = await response.json();
      const outputText = json.output || JSON.stringify(json, null, 2);
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
          description: err.message || 'Something went wrong. Please check your webhook URL and try again.',
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
