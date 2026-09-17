import { CHAPTERS } from './chapters';

export function ChapterRail({ active }: { active: string }) {
  return (
    <nav
      aria-label="Chapter index"
      className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block"
    >
      <ol className="flex flex-col">
        {CHAPTERS.map((c) => {
          const on = active === c.id;
          return (
            <li key={c.id}>
              <a
                href={'#' + c.id}
                aria-current={on ? 'true' : undefined}
                className="group relative flex h-11 w-11 items-center justify-end gap-2.5 pr-1"
              >
                <span
                  className={
                    'pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded bg-bg-2 px-2 py-1 font-sans text-[11px] uppercase tracking-[0.16em] text-fg opacity-0 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }
                >
                  {c.label}
                </span>
                <span
                  className={
                    'font-sans text-[10px] tabular-nums tracking-[0.1em] transition-colors duration-300 ' +
                    (on ? 'text-accent' : 'text-muted group-hover:text-fg-dim')
                  }
                >
                  {c.numeral}
                </span>
                <span
                  className={
                    'h-px transition-all duration-300 ' +
                    (on ? 'w-4 bg-accent' : 'w-2 bg-line group-hover:w-3.5 group-hover:bg-fg-dim')
                  }
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
