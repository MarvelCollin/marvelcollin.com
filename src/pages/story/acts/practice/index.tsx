import { useMemo, useState } from 'react';
import { useContent } from '../../../../content/use-content';
import { chronicle } from '../../../../lib/tenure';
import { relate } from '../../../../lib/related';
import { Reveal } from '../../../../components/ui/reveal';
import { EntrySkeleton } from '../../../../components/ui/skeleton';
import { Timeline } from './timeline';
import { Post } from './post';

export function Practice() {
  const { experience, recognition, works, loading } = useContent();
  const lanes = useMemo(() => chronicle(experience), [experience]);
  const related = useMemo(() => relate(lanes, recognition, works), [lanes, recognition, works]);
  const [hot, setHot] = useState<string | null>(null);

  return (
    <div className="max-w-[1080px]">
      {loading && experience.length === 0 && <EntrySkeleton count={3} />}
      {lanes.length > 0 && (
        <Reveal>
          <Timeline lanes={lanes} hot={hot} onHot={setHot} />
        </Reveal>
      )}
      <div className="mt-16 space-y-16 max-[900px]:mt-12 max-[900px]:space-y-12">
        {lanes.map((l, i) => (
          <Reveal key={l.key} delay={Math.min(i, 4) * 60}>
            <Post lane={l} hot={hot === l.key} onHot={setHot} related={related} wide />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
