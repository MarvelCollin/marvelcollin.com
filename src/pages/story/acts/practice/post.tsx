import { delay } from '../../../../lib/motion';
import { orgLogo } from '../../../../lib/org-logo';
import { isLive, type Lane } from '../../../../lib/tenure';
import { OrgMark } from '../../../../components/ui/org-mark';
import { hoverProps, type Hover } from './hover';

export function Pulse({ className = '' }: { className?: string }) {
  return (
    <>
      <span className={'absolute inset-0 animate-ping rounded-full bg-accent/60 [animation-duration:2.4s] motion-reduce:hidden ' + className} />
      <span className="absolute inset-0 rounded-full bg-accent" />
    </>
  );
}

function Node({ live }: { live: boolean }) {
  return (
    <span aria-hidden="true" className="absolute -left-6 top-[7px] h-[7px] w-[7px]">
      {live ? <Pulse /> : <span className="absolute inset-0 rounded-full border border-muted bg-bg" />}
    </span>
  );
}

export function Post({ lane, hot, onHot, wide = false }: { lane: Lane; hot: boolean; onHot: Hover; wide?: boolean }) {
  return (
    <article
      {...hoverProps(lane.key, onHot)}
      className={
        'h-full rounded-xl border p-7 transition-colors duration-300 max-[560px]:p-5 ' +
        (hot ? 'border-accent/50 bg-bg ' : 'border-line bg-bg/40 ') +
        (wide ? 'grid grid-cols-[260px_minmax(0,1fr)] gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-0' : '')
      }
    >
      <header className="flex items-center gap-4 self-start">
        <OrgMark logo={orgLogo(lane.items[0].where)} />
        <div className="min-w-0">
          <h3 className="text-[18px] font-medium leading-[1.3]">{lane.name}</h3>
          <p className="mt-0.5 text-[14px] leading-[1.45] text-fg-dim">
            {lane.place && <span className="block">{lane.place}</span>}
            <span className="tabular-nums">{lane.tenure}</span>
          </p>
        </div>
      </header>

      <ol className={'space-y-6 pl-6 ' + (wide ? 'max-[900px]:mt-6' : 'mt-6')}>
        {lane.items.map((j, k) => (
          <li key={j.id} className="relative">
            <Node live={isLive(j)} />
            {k < lane.items.length - 1 && (
              <span
                aria-hidden="true"
                data-grow="down"
                style={delay(320 + k * 140)}
                className="absolute -bottom-[31px] -left-[21px] top-[14px] w-px bg-line"
              />
            )}
            <h4 className="text-[16px] font-medium leading-[1.3]">{j.role}</h4>
            <p className="mt-0.5 text-[13px] tabular-nums text-muted">{j.yr}</p>
            {j.note && <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.65] text-fg-dim">{j.note}</p>}
          </li>
        ))}
      </ol>
    </article>
  );
}
