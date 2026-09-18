import { useEffect, useMemo } from 'react';
import { CHAPTERS } from './chapters';
import { Chapter } from './chapter';
import { SiteNav } from './nav';
import { ChapterRail } from './rail';
import { Prologue } from './acts/prologue';
import { Origin } from './acts/origin';
import { Practice } from './acts/practice';
import { Craft } from './acts/craft';
import { Work } from './acts/work';
import { Research } from './acts/research';
import { Recognition } from './acts/recognition';
import { Epilogue } from './acts/epilogue';
import { ProjectOverlay } from '../../components/project/overlay';
import { Backdrop } from './backdrop';
import { useActiveChapter } from '../../hooks/use-story-progress';
import { useWorkHash } from '../../hooks/use-work-hash';

const META = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

const ACTS = [
  { id: 'origin', body: <Origin /> },
  { id: 'practice', body: <Practice /> },
  { id: 'craft', body: <Craft /> },
  { id: 'work', body: <Work /> },
  { id: 'research', body: <Research /> },
  { id: 'recognition', body: <Recognition /> },
  { id: 'epilogue', body: <Epilogue /> },
];

export function Story() {
  const ids = useMemo(() => CHAPTERS.map((c) => c.id), []);
  const active = useActiveChapter(ids);
  const { slug, close } = useWorkHash();

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id || id.startsWith('/')) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant' }));
  }, []);

  const sheet = Math.max(0, CHAPTERS.findIndex((c) => c.id === active));

  return (
    <>
      <a href="#origin" className="skip-link">Skip to the story</a>
      <Backdrop
        numeral={CHAPTERS[sheet].numeral}
        label={CHAPTERS[sheet].label}
        sheet={sheet + 1}
        total={CHAPTERS.length}
      />
      <SiteNav active={active} />
      <ChapterRail active={active} />
      <main>
        <Prologue />
        {ACTS.map((act) => (
          <Chapter key={act.id} meta={META[act.id]}>
            {act.body}
          </Chapter>
        ))}
      </main>
      {slug && <ProjectOverlay slug={slug} onClose={close} />}
    </>
  );
}
