import { useEffect, useRef } from 'react';
import { CHAPTERS, NAV_CHAPTERS } from './chapters';

const ITEMS = NAV_CHAPTERS.map((id) => CHAPTERS.find((c) => c.id === id)).filter(
  (c): c is (typeof CHAPTERS)[number] => c !== undefined,
);

const SMALL = ['work', 'epilogue'];

const NEAREST = CHAPTERS.reduce<Record<string, string>>((map, c) => {
  const order = CHAPTERS.map((x) => x.id);
  const upto = order.slice(0, order.indexOf(c.id) + 1).reverse();
  map[c.id] = upto.find((id) => NAV_CHAPTERS.includes(id)) ?? '';
  return map;
}, {});

function useProgressBar() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const reach = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = reach <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / reach));
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return bar;
}

export function SiteNav({ active }: { active: string }) {
  const bar = useProgressBar();
  const highlight = NEAREST[active] ?? '';

  return (
    <nav className="top" aria-label="Chapters">
      <a href="#prologue" className="brand">
        Marvel Collin
      </a>
      <ul>
        {ITEMS.map((c, i) => (
          <li key={c.id} className={i < 2 ? 'max-[700px]:hidden' : SMALL.includes(c.id) ? undefined : 'max-[560px]:hidden'}>
            <a href={'#' + c.id} className={highlight === c.id ? 'active' : undefined}>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
      <span ref={bar} className="nav-progress" aria-hidden="true" />
    </nav>
  );
}
