import type { Project } from '../../../../types/content';
import { Thumbnail } from '../../../../components/project/thumbnail';
import { Reveal } from '../../../../components/ui/reveal';
import { workHref } from '../../../../lib/work-link';
import { setFlipOrigin } from '../../../../lib/flip';

const SHADE =
  "after:absolute after:inset-0 after:z-[1] after:content-[''] after:bg-[linear-gradient(to_top,rgba(20,18,14,0.45),transparent_40%),linear-gradient(to_bottom,rgba(20,18,14,0.3),transparent_28%)]";

function Print({ p }: { p: Project }) {
  return (
    <a
      className="group relative block origin-center -rotate-1 transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.015]"
      onClick={(e) => setFlipOrigin(e.currentTarget)}
      href={workHref(p.slug)}
    >
      <span className="pointer-events-none absolute -top-4 left-1/2 z-10 h-8 w-36 -translate-x-1/2 -rotate-2 bg-tape shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
      <div className="bg-paper p-[18px] shadow-[0_24px_56px_-18px_rgba(0,0,0,0.75)] transition-shadow duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]">
        <div className={'relative aspect-[16/9] overflow-hidden bg-bg-2 ' + SHADE}>
          <Thumbnail p={p} sizes="(max-width: 900px) 92vw, 680px" />
          <span className="absolute left-6 top-5 z-[2] font-mono text-[11px] uppercase tracking-[0.11em] text-[rgba(247,244,234,0.85)] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
            {p.name} · {p.year}
          </span>
        </div>
        <div className="px-1 pt-4 text-center">
          <div className="text-[20px] font-medium leading-tight text-paper-ink">{p.name}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            {p.stack} · {p.year}
          </div>
        </div>
      </div>
    </a>
  );
}

export function FeaturedWork({ p }: { p: Project }) {
  return (
    <Reveal className="mb-24 max-[900px]:mb-16">
      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">Featured</p>
          <h3 className="mt-4 font-display text-[clamp(28px,3.6vw,46px)] font-semibold leading-[1.08] tracking-[-0.012em]">{p.name}</h3>
          <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.6] text-fg-dim">{p.body[0]}</p>
          <a href={workHref(p.slug)} className="group mt-8 inline-flex items-center gap-3 text-[14px] text-accent-soft transition-colors hover:text-fg">
            Open case
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
        <Print p={p} />
      </div>
    </Reveal>
  );
}
