import { CHAPTERS } from './chapters';

const LAST = CHAPTERS.length - 1;

export function ChapterRail({ active }: { active: string }) {
  const index = Math.max(0, CHAPTERS.findIndex((c) => c.id === active));
  const reached = (index / LAST) * 100;

  return (
    <nav
      aria-label="Chapter index"
      className="fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block"
    >
      <div className="relative h-[340px] w-px bg-line">
        <span
          className="absolute left-0 top-0 w-px bg-accent transition-[height] duration-500 ease-out"
          style={{ height: reached + '%' }}
        />
        <span className="absolute bottom-0 right-full top-0 mr-3 flex items-center [writing-mode:vertical-rl]">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-dim">
            {CHAPTERS[index].label}
          </span>
        </span>
        <ol>
          {CHAPTERS.map((c, i) => {
            const on = i === index;
            return (
              <li
                key={c.id}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: (i / LAST) * 100 + '%' }}
              >
                <a
                  href={'#' + c.id}
                  aria-label={c.label}
                  aria-current={on ? 'true' : undefined}
                  className="group flex h-9 w-9 items-center justify-center"
                >
                  <span
                    className={
                      'block rounded-full transition-all duration-300 ' +
                      (on ? 'h-2 w-2 bg-accent' : 'h-1 w-1 bg-line group-hover:h-1.5 group-hover:w-1.5 group-hover:bg-fg-dim')
                    }
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
