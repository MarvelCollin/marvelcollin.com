import { useEffect, useState } from 'react';

export function useActiveChapter(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.38;
        let current = sections[0].id;
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= line) current = el.id;
        }
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
          current = sections[sections.length - 1].id;
        }
        setActive(current);
      },
      { threshold: [0, 0.02, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
