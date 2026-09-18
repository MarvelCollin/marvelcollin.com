import { useEffect, useState } from 'react';
import type { Project } from '../../../types/content';

function framesOf(p: Project | undefined) {
  if (!p) return { images: [], captions: [] };
  const gallery = (p.images ?? []).filter((src) => src && src !== p.cover);
  const images = [p.cover, ...gallery].filter(Boolean) as string[];
  const captions = [p.name, ...gallery.map((_, i) => p.stills[i] ?? '')];
  return { images, captions };
}

export function useFrames(p: Project | undefined, slug: string) {
  const { images, captions } = framesOf(p);
  const count = images.length;
  const [slide, setSlide] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);

  const wrap = (i: number) => (i + count) % count;
  const step = (d: number) => setSlide((i) => wrap(i + d));

  const nav = (d: number) => {
    const to = wrap((viewing ?? 0) + d);
    setViewing(to);
    setSlide(to);
  };

  useEffect(() => {
    setSlide(0);
    setViewing(null);
  }, [slug]);

  const lightboxOpen = viewing !== null;

  useEffect(() => {
    if (count < 2 || lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSlide((i) => (i + 1) % count);
      else if (e.key === 'ArrowLeft') setSlide((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, lightboxOpen]);

  return { images, captions, slide, setSlide, step, viewing, open: setViewing, close: () => setViewing(null), nav };
}
