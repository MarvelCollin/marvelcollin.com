import type { ReactNode } from 'react';

export function Tip({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <span className={'group/tip relative inline-flex ' + className}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-line bg-bg-2 px-2 py-1 font-mono text-[11px] tracking-[0.04em] text-fg opacity-0 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)] transition-[opacity,translate] duration-150 group-hover/tip:translate-y-0 group-hover/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
