import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormData } from '@/types';
import { getWebhookUrl } from './Header';
import { toast } from '@/hooks/use-toast';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [primaryTask, setPrimaryTask] = useState('');
  const [numberOfTitles, setNumberOfTitles] = useState(10);
  const [numberOfImages, setNumberOfImages] = useState(20);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast({ title: 'Invalid file type', description: 'Please upload a JPG or PNG image.', variant: 'destructive' });
      return;
    }
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryTask.trim()) {
      toast({ title: 'Missing task', description: 'Please describe what the video is about.', variant: 'destructive' });
      return;
    }
    if (!screenshot) {
      toast({ title: 'Missing screenshot', description: 'Please upload a channel screenshot.', variant: 'destructive' });
      return;
    }
    if (!getWebhookUrl()) {
      toast({ title: 'Webhook not configured', description: 'Please set your n8n webhook URL in settings (gear icon).', variant: 'destructive' });
      return;
    }
    onSubmit({ primaryTask: primaryTask.trim(), numberOfTitles, numberOfImages, screenshot });
  }, [primaryTask, numberOfTitles, numberOfImages, screenshot, onSubmit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up mx-auto max-w-2xl space-y-8 px-6 pb-12"
    >
      {/* Primary Task */}
      <div className="space-y-2">
        <label className="font-display text-lg font-semibold text-foreground">
          What is the video about?
        </label>
        <Input
          value={primaryTask}
          onChange={e => setPrimaryTask(e.target.value)}
          placeholder="e.g., Forest Tea Ceremony, Campfire Cooking, Rainy Day Gardening"
          className="ghibli-card border-border bg-card font-body text-base"
          required
        />
        <p className="font-ui text-xs text-muted-foreground">
          One activity only — this anchors the entire video
        </p>
      </div>

      {/* Number inputs */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-display text-lg font-semibold text-foreground">
            How many titles?
          </label>
          <Input
            type="number"
            value={numberOfTitles}
            onChange={e => setNumberOfTitles(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            min={1}
            max={20}
            className="ghibli-card border-border bg-card font-ui"
          />
        </div>
        <div className="space-y-2">
          <label className="font-display text-lg font-semibold text-foreground">
            How many image prompts?
          </label>
          <Input
            type="number"
            value={numberOfImages}
            onChange={e => setNumberOfImages(Math.min(30, Math.max(10, parseInt(e.target.value) || 10)))}
            min={10}
            max={30}
            className="ghibli-card border-border bg-card font-ui"
          />
          <p className="font-ui text-xs text-muted-foreground">
            Each image prompt will also generate a matching video prompt
          </p>
        </div>
      </div>

      {/* Screenshot upload */}
      <div className="space-y-2">
        <label className="font-display text-lg font-semibold text-foreground">
          Upload a YouTube channel screenshot
        </label>
        <div
          className={`wooden-frame relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg p-6 transition-all ${
            dragActive ? 'border-primary bg-primary/5' : ''
          }`}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Channel screenshot" className="max-h-40 rounded-md object-contain" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setScreenshot(null); setPreview(null); }}
                className="absolute -top-2 -right-2 rounded-full bg-card p-1 shadow-md"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-ui text-sm text-muted-foreground">
                Drag & drop or click to upload
              </p>
              <p className="font-ui text-xs text-muted-foreground/70 mt-1">
                JPG or PNG
              </p>
            </>
          )}
        </div>
        <p className="font-ui text-xs text-muted-foreground">
          Upload a screenshot of any YouTube channel homepage for DNA analysis
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="generate-btn w-full bg-primary py-6 font-display text-lg font-semibold text-primary-foreground"
      >
        Generate Content ✦
      </Button>
    </form>
  );
};

export default InputForm;
