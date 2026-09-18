import { useEffect, useRef } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { createScope, createTimeline, stagger } from 'animejs';
import { CHAPTERS } from '../chapters';
import { EASE_OUT, FADE_UP, MEDIA } from '../../lib/motion';

const COUNT = CHAPTERS.length - 1;
const PARTS = '[data-part="kicker"], [data-part="title"], [data-part="intro"], [data-part="meta"], [data-part="cta"], [data-part="cue"]';

export function Prologue() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;
      const parts = Array.from(el.querySelectorAll(PARTS));
      if (parts.length === 0) return;

      createTimeline({ defaults: { ease: EASE_OUT, duration: 880 } }).add(parts, {
        ...FADE_UP(24),
        delay: stagger(110, { start: 120 }),
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section
      ref={root as never}
      id="prologue"
      data-chapter="prologue"
      aria-label="Prologue"
      className="relative flex min-h-[94vh] flex-col justify-center px-10 pt-[120px] pb-16 max-[900px]:min-h-[86vh] max-[900px]:px-[22px] max-[900px]:pt-[96px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div data-part="kicker" className="flex items-center gap-4">
          <span className="h-px w-10 bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-accent-2">Prologue</span>
        </div>

        <h1 data-part="title" className="mt-10 font-display text-[clamp(56px,10vw,148px)] font-semibold leading-[0.92] tracking-[-0.015em] max-[900px]:mt-7">
          Marvel<br />Collin.
        </h1>

        <div className="mt-12 flex items-start justify-between gap-16 max-[900px]:flex-col max-[900px]:gap-8">
          <p data-part="intro" className="max-w-[46ch] text-[17px] leading-[1.7] text-fg-dim">
            Fullstack engineer and R&D staff at BINUS University. I build internal platforms in Go, .NET Core, and TypeScript, run the Linux servers under them, and take freelance work out of Singapore and Jakarta.
          </p>
          <div data-part="meta" className="shrink-0 text-right text-[14px] leading-[1.8] text-fg-dim max-[900px]:text-left">
            <p>Fullstack Engineer</p>
            <p>Jakarta, Indonesia</p>
            <a className="mt-2 inline-block text-accent-soft transition-colors hover:text-fg" href="mailto:marvelcollin7@gmail.com">marvelcollin7@gmail.com</a>
          </div>
        </div>

        <a
          data-part="cta"
          className="group mt-12 flex w-fit items-center gap-3 rounded-lg border border-accent bg-accent px-6 py-4 font-mono text-[14px] font-medium uppercase tracking-[0.08em] text-accent-ink transition-transform duration-300 hover:-translate-y-0.5 max-[560px]:w-full max-[560px]:justify-center"
          href="https://github.com/MarvelCollin"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size={20} />
          Check out my GitHub profile
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>

        <a
          data-part="cue"
          href="#origin"
          className="group mt-16 flex w-fit items-center gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg max-[900px]:mt-12"
        >
          <span className="tabular-nums">{COUNT} chapters</span>
          <span className="h-px w-12 bg-line transition-all duration-300 group-hover:w-20 group-hover:bg-accent" />
          <span>Start reading</span>
        </a>
      </div>
    </section>
  );
}
