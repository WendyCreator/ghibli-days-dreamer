import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [primaryTask, setPrimaryTask] = useState('');
  const [numberOfTitles, setNumberOfTitles] = useState(10);
  const [numberOfImages, setNumberOfImages] = useState(20);
  const [channelDNAOverride, setChannelDNAOverride] = useState('');
  const [showDNAOverride, setShowDNAOverride] = useState(false);
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
    onSubmit({
      primaryTask: primaryTask.trim(),
      numberOfTitles,
      numberOfImages,
      channelDNAOverride: channelDNAOverride.trim() || undefined,
      screenshot: screenshot ?? undefined,
    });
  }, [primaryTask, numberOfTitles, numberOfImages, channelDNAOverride, screenshot, onSubmit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up mx-auto max-w-xl px-4 sm:px-6 pb-12"
    >
      <div className="parchment rounded-2xl p-6 sm:p-8 space-y-7">
        {/* Primary Task */}
        <div className="space-y-2.5">
          <label className="font-display text-base font-semibold text-foreground">
            What happens in this video?
          </label>
          <Textarea
            value={primaryTask}
            onChange={e => setPrimaryTask(e.target.value)}
            placeholder="e.g. Cozy pasta cooking in a forest cottage on a rainy evening..."
            className="border-border bg-background/50 font-body text-sm min-h-[100px] rounded-lg resize-none"
            required
          />
          <div className="flex justify-between">
            <p className="font-ui text-[11px] text-muted-foreground">
              One activity only — this anchors the entire video
            </p>
            <span className="font-ui text-[11px] text-muted-foreground">
              {primaryTask.length}
            </span>
          </div>
        </div>

        {/* Number inputs as elegant steppers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <label className="font-display text-sm font-semibold text-foreground">
              How many titles?
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setNumberOfTitles(v => Math.max(5, v - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-display text-lg font-bold text-foreground w-10 text-center">
                {numberOfTitles}
              </span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setNumberOfTitles(v => Math.min(20, v + 1))}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="font-ui text-[10px] text-muted-foreground">5–20 titles</p>
          </div>
          <div className="space-y-2.5">
            <label className="font-display text-sm font-semibold text-foreground">
              How many scenes?
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setNumberOfImages(v => Math.max(5, v - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-display text-lg font-bold text-foreground w-10 text-center">
                {numberOfImages}
              </span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setNumberOfImages(v => Math.min(30, v + 1))}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="font-ui text-[10px] text-muted-foreground">5–30 images + matching video prompts</p>
          </div>
        </div>

        {/* Channel DNA Override */}
        <div>
          <button
            type="button"
            onClick={() => setShowDNAOverride(!showDNAOverride)}
            className="flex items-center gap-2 font-ui text-sm font-medium text-ochre hover:text-ochre/80 transition-colors"
          >
            <span>✦</span>
            Add Channel Style Override
            {showDNAOverride ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <AnimatePresence>
            {showDNAOverride && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Textarea
                  value={channelDNAOverride}
                  onChange={e => setChannelDNAOverride(e.target.value)}
                  placeholder="Describe the aesthetic, mood, color palette, or character style you want applied..."
                  className="mt-3 border-border bg-background/50 font-body text-sm min-h-[80px] rounded-lg resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Screenshot upload */}
        <div className="space-y-2.5">
          <label className="font-display text-sm font-semibold text-foreground">
            Channel screenshot <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </label>
          <div
            className={`wooden-frame relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl p-6 transition-all ${
              dragActive ? 'border-ochre bg-cream/50' : ''
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
                <img src={preview} alt="Channel screenshot" className="max-h-28 rounded-lg object-contain shadow-sm" />
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
                <Upload className="mb-2.5 h-8 w-8 text-muted-foreground/30" />
                <p className="font-ui text-sm text-muted-foreground">
                  Drop a channel screenshot for DNA analysis
                </p>
                <p className="font-ui text-[10px] text-muted-foreground/50 mt-0.5">
                  JPG or PNG · Skip this if using the override above
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="generate-btn w-full py-5 sm:py-6 font-display text-base sm:text-lg font-semibold rounded-xl mt-6"
      >
        Begin the Story →
      </Button>
    </form>
  );
};

export default InputForm;
