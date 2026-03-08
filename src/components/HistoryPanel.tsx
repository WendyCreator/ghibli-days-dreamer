import React, { useState, useEffect, useCallback } from 'react';
import { History, Trash2, Play, X, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HistoryEntry, getHistory, deleteFromHistory, clearHistory } from '@/lib/historyStore';
import { FormData, ParsedOutput } from '@/types';

interface HistoryPanelProps {
  onRerun: (formData: Omit<FormData, 'screenshot'>) => void;
  onViewResult: (parsed: ParsedOutput, timestamp: Date) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onRerun, onViewResult }) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setEntries(getHistory());
  }, [open]);

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory(id);
    setEntries(prev => prev.filter(en => en.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    clearHistory();
    setEntries([]);
  }, []);

  const handleView = useCallback((entry: HistoryEntry) => {
    onViewResult(entry.parsed, new Date(entry.timestamp));
    setOpen(false);
  }, [onViewResult]);

  const handleRerun = useCallback((entry: HistoryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    onRerun(entry.formData);
    setOpen(false);
  }, [onRerun]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <History className="h-5 w-5" />
          {entries.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {entries.length > 9 ? '9+' : entries.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-display text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Generation History
          </SheetTitle>
        </SheetHeader>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted/60 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-ui text-sm text-muted-foreground">No generations yet</p>
            <p className="font-ui text-xs text-muted-foreground/70 mt-1">
              Your past generations will appear here
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-3">
              <Button variant="ghost" size="sm" className="font-ui text-xs text-destructive hover:text-destructive h-7 gap-1" onClick={handleClearAll}>
                <Trash2 className="h-3 w-3" /> Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {entries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => handleView(entry)}
                  className="w-full text-left rounded-lg border border-border/50 bg-card/80 p-3 transition-all hover:bg-accent/30 hover:border-border group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-ui text-sm font-medium text-foreground truncate">
                        {entry.formData.primaryTask}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-ui text-[10px] text-muted-foreground">
                          {entry.formData.numberOfTitles} titles · {entry.formData.numberOfImages} images
                        </span>
                        <span className="font-ui text-[10px] text-muted-foreground/60">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleRerun(entry, e)}
                        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Re-run with same settings"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
