import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type TerminalAccordionProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accentClass?: string;
  borderClass?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function TerminalAccordion({
  title,
  subtitle,
  icon,
  accentClass = 'text-amber',
  borderClass = 'border-amber-dim/50',
  children,
  defaultOpen = false,
}: TerminalAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border ${borderClass} bg-black/50 rounded overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <div className="min-w-0">
            <h3 className={`font-share tracking-widest uppercase ${accentClass}`}>{title}</h3>
            {subtitle ? (
              <p className="font-vt323 text-sm text-amber-dim mt-0.5 truncate">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-amber-dim transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? <div className="px-4 pb-4 border-t border-amber-dim/20">{children}</div> : null}
    </div>
  );
}
