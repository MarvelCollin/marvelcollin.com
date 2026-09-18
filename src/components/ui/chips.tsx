export interface Chip {
  key: string;
  label: string;
  count: number;
}

const BASE = 'cursor-pointer rounded-full border px-3.5 py-[7px] text-[12px] tracking-[0.04em] transition-colors ';
const ON = 'border-accent bg-accent text-accent-ink';
const OFF = 'border-line text-fg-dim hover:border-accent hover:text-accent';

export function Chips({ chips, value, onChange }: { chips: Chip[]; value: string; onChange: (key: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button key={c.key} type="button" onClick={() => onChange(c.key)} aria-pressed={value === c.key} className={BASE + (value === c.key ? ON : OFF)}>
          {c.label} ({c.count})
        </button>
      ))}
    </div>
  );
}
