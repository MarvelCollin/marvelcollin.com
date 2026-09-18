import { useState } from 'react';
import { CHAPTERS, NAV_CHAPTERS } from '../chapters';
import { useProgressBar } from './use-progress-bar';
import { useNavMark } from './use-nav-mark';

const ITEMS = CHAPTERS.filter((c) => NAV_CHAPTERS.includes(c.id));

const ALWAYS_SHOWN = ['work', 'epilogue'];

const ORDER = CHAPTERS.map((c) => c.id);

function nearestNavItem(active: string) {
  const upto = ORDER.slice(0, ORDER.indexOf(active) + 1).reverse();
  return upto.find((id) => NAV_CHAPTERS.includes(id)) ?? '';
}

function hideOnSmall(id: string, i: number) {
  if (i < 2) return 'max-[700px]:hidden';
  return ALWAYS_SHOWN.includes(id) ? undefined : 'max-[560px]:hidden';
}

export function SiteNav({ active }: { active: string }) {
  const bar = useProgressBar();
  const [hover, setHover] = useState<string | null>(null);
  const current = hover ?? nearestNavItem(active);
  const { wrap, mark } = useNavMark(current);

  return (
    <nav className="top" aria-label="Chapters">
      <a href="#prologue" className="brand">
        Marvel Collin
      </a>
      <div ref={wrap} className="nav-links" onPointerLeave={() => setHover(null)}>
        <ul>
          {ITEMS.map((c, i) => (
            <li key={c.id} className={hideOnSmall(c.id, i)}>
              <a
                href={'#' + c.id}
                data-id={c.id}
                className={current === c.id ? 'active' : undefined}
                onPointerEnter={() => setHover(c.id)}
                onFocus={() => setHover(c.id)}
                onBlur={() => setHover(null)}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <span ref={mark} className="nav-mark" aria-hidden="true">
          <i />
          <i />
        </span>
      </div>
      <span ref={bar} className="nav-progress" aria-hidden="true" />
    </nav>
  );
}
