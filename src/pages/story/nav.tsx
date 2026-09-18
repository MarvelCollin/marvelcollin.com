import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

function useMark(target: string) {
  const wrap = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = wrap.current;
    const el = mark.current;
    if (!box || !el) return;

    const place = () => {
      const link = box.querySelector<HTMLElement>(`a[data-id="${target}"]`);
      if (!link || link.offsetParent === null) {
        el.style.opacity = '0';
        return;
      }
      const outer = box.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      el.style.setProperty('--x', `${r.left - outer.left - 8}px`);
      el.style.setProperty('--w', `${r.width + 16}px`);
      el.style.setProperty('--y', `${r.top - outer.top - 6}px`);
      el.style.setProperty('--h', `${r.height + 12}px`);
      el.style.opacity = '1';
      if (!el.dataset.ready) requestAnimationFrame(() => (el.dataset.ready = 'true'));
    };

    place();
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [target]);

  return { wrap, mark };
}

export function SiteNav({ active }: { active: string }) {
  const bar = useProgressBar();
  const highlight = NEAREST[active] ?? '';
  const [hover, setHover] = useState<string | null>(null);
  const { wrap, mark } = useMark(hover ?? highlight);

  return (
    <nav className="top" aria-label="Chapters">
      <a href="#prologue" className="brand">
        Marvel Collin
      </a>
      <div ref={wrap} className="nav-links" onPointerLeave={() => setHover(null)}>
        <ul>
          {ITEMS.map((c, i) => (
            <li key={c.id} className={i < 2 ? 'max-[700px]:hidden' : SMALL.includes(c.id) ? undefined : 'max-[560px]:hidden'}>
              <a
                href={'#' + c.id}
                data-id={c.id}
                className={(hover ?? highlight) === c.id ? 'active' : undefined}
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
