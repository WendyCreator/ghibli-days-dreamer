import React, { useState, useCallback, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormData } from '@/types';
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
    onSubmit({ primaryTask: primaryTask.trim(), numberOfTitles, numberOfImages, screenshot: screenshot ?? undefined });
  }, [primaryTask, numberOfTitles, numberOfImages, screenshot, onSubmit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up mx-auto max-w-xl space-y-7 px-4 sm:px-6 pb-12"
    >
      {/* Primary Task */}
      <div className="space-y-2.5">
        <label className="font-display text-base font-semibold text-foreground">
          What is the video about?
        </label>
        <Input
          value={primaryTask}
          onChange={e => setPrimaryTask(e.target.value)}
          placeholder="e.g., Forest Tea Ceremony, Campfire Cooking…"
          className="border-border bg-card font-body text-sm h-11 rounded-lg"
          required
        />
        <p className="font-ui text-[11px] text-muted-foreground">
          One activity only — this anchors the entire video
        </p>
      </div>

      {/* Number inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <label className="font-display text-sm font-semibold text-foreground">
            Titles
          </label>
          <Input
            type="number"
            value={numberOfTitles}
            onChange={e => setNumberOfTitles(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            min={1}
            max={20}
            className="border-border bg-card font-ui text-sm h-11 rounded-lg"
          />
        </div>
        <div className="space-y-2.5">
          <label className="font-display text-sm font-semibold text-foreground">
            Image prompts
          </label>
          <Input
            type="number"
            value={numberOfImages}
            onChange={e => setNumberOfImages(Math.min(30, Math.max(5, parseInt(e.target.value) || 5)))}
            min={5}
            max={30}
            className="border-border bg-card font-ui text-sm h-11 rounded-lg"
          />
          <p className="font-ui text-[11px] text-muted-foreground">
            + matching video prompts
          </p>
        </div>
      </div>

      {/* Screenshot upload */}
      <div className="space-y-2.5">
        <label className="font-display text-sm font-semibold text-foreground">
          Channel screenshot <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </label>
        <div
          className={`wooden-frame relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl p-6 transition-all ${
            dragActive ? 'border-primary bg-accent/50' : ''
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
              <img src={preview} alt="Channel screenshot" className="max-h-36 rounded-lg object-contain" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setScreenshot(null); setPreview(null); }}
                className="absolute -top-2 -right-2 rounded-full bg-card border border-border p-1 shadow-md hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-2.5 h-8 w-8 text-muted-foreground/40" />
              <p className="font-ui text-sm text-muted-foreground">
                Drop image or click to upload
              </p>
              <p className="font-ui text-[10px] text-muted-foreground/60 mt-0.5">
                JPG or PNG
              </p>
            </>
          )}
        </div>
        <p className="font-ui text-[11px] text-muted-foreground">
          Upload a YouTube channel homepage screenshot for DNA analysis
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="generate-btn w-full py-5 sm:py-6 font-display text-sm sm:text-base font-semibold text-primary-foreground rounded-xl"
      >
        Generate Content ✦
      </Button>
    </form>
  );
};

export default InputForm;
