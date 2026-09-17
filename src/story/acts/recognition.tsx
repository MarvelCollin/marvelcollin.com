import { useContent } from '../../content/use-content';
import { img } from '../../lib/img';
import { Reveal } from '../../components/reveal';
import { SmartImage } from '../../components/smart-image';

export function Recognition() {
  const { recognition } = useContent();

  return (
    <div className="max-w-[900px] space-y-8">
      {recognition.map((a, i) => (
        <Reveal key={a.id} delay={Math.min(i, 5) * 60}>
          <div className="flex items-baseline gap-4 max-[560px]:flex-col max-[560px]:gap-1">
            <span className="shrink-0 text-[13px] tabular-nums text-muted">{a.yr}</span>
            <span className="text-[16px] font-medium">{a.name}</span>
            <span className="text-[14px] text-fg-dim max-[560px]:hidden">· {a.where}</span>
            <span className="hidden text-[14px] text-fg-dim max-[560px]:block">{a.where}</span>
          </div>
          {a.image && (
            <SmartImage
              src={img(a.image, 1000)}
              alt={a.name}
              wrapClassName="mt-4 w-fit max-w-[520px] rounded-lg border border-line bg-bg-2"
              className="h-auto max-h-[340px] w-auto max-w-full object-contain"
              skelStyle={{ width: 'min(320px, 100%)', aspectRatio: '4 / 3' }}
            />
          )}
        </Reveal>
      ))}
    </div>
  );
}
