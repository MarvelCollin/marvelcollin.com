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
  const blocks = useMemo(() => chronicle(experience), [experience]);
  const related = useMemo(
    () => relate(blocks.flatMap((b) => (b.kind === 'solo' ? [b.lane] : b.lanes)), recognition, works),
    [blocks, recognition, works],
  );
  const [hot, setHot] = useState<string | null>(null);

  return (
    <div className="max-w-[1080px]">
      {loading && experience.length === 0 && <EntrySkeleton count={3} />}
      {blocks.length > 0 && (
        <Reveal>
          <Timeline blocks={blocks} hot={hot} onHot={setHot} />
        </Reveal>
      )}
      <div className="mt-16 space-y-16 max-[900px]:mt-12 max-[900px]:space-y-12">
        {blocks.map((b, i) => (
          <Reveal key={b.kind === 'solo' ? b.lane.key : b.lanes[0].key} delay={Math.min(i, 4) * 60}>
            {b.kind === 'solo' ? (
              <Post lane={b.lane} hot={hot === b.lane.key} onHot={setHot} related={related} wide />
            ) : (
              <div className="space-y-16 max-[900px]:space-y-12">
                {b.lanes.map((l) => (
                  <Post key={l.key} lane={l} hot={hot === l.key} onHot={setHot} related={related} wide />
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
