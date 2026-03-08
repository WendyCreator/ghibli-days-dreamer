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
    <section id={id} className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent shrink-0">
            <Icon className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-display text-sm sm:text-[15px] font-semibold text-foreground truncate">{title}</h3>
          {count !== undefined && (
            <span className="inline-flex items-center justify-center h-5 min-w-[22px] rounded-full bg-primary/10 px-1.5 font-ui text-[11px] font-bold text-primary">
              {count}
            </span>
          )}
        </div>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
};

export default SectionCard;
