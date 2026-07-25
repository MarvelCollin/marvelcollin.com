import type { ReactNode } from 'react';

export function MetaList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="grid grid-cols-[2.5rem_150px_1fr] items-baseline gap-x-6 border-b border-line py-[18px] transition-[padding] duration-300 ease-out hover:pl-2 max-[560px]:grid-cols-[2.5rem_1fr] max-[560px]:gap-y-1"
        >
          <span className="font-sans text-[13px] tabular-nums leading-none text-muted">{String(i + 1).padStart(2, '0')}</span>
          <span className="font-sans text-[11px] tracking-[0.02em] text-muted max-[560px]:hidden">{item.label}</span>
          <span className="font-sans text-[16px] leading-snug text-fg">
            <span className="mb-1 hidden text-[11px] tracking-[0.02em] text-muted max-[560px]:block">{item.label}</span>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
