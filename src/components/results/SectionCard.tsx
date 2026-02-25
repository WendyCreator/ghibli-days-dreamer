import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  count?: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ id, icon: Icon, title, count, children, actions }) => {
  return (
    <section id={id} className="ghibli-card rounded-xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary/10 shrink-0">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground truncate">{title}</h3>
          {count !== undefined && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary/10 px-1.5 font-ui text-[11px] font-bold text-primary">
              {count}
            </span>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-3 sm:p-5">{children}</div>
    </section>
  );
};

export default SectionCard;
