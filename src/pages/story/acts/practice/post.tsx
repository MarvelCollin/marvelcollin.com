import { delay } from '../../../../lib/motion';
import type { Related } from '../../../../lib/related';
import { employment, type Employment } from '../../../../lib/employment';
import { orgLogo } from '../../../../lib/org-logo';
import { isLive, type Lane } from '../../../../lib/tenure';
import { OrgMark } from '../../../../components/ui/org-mark';
import { AwardChip, LinkedList, WorkChip } from '../../../../components/ui/linked';
import { hoverProps, type Hover } from './hover';
import { yearsOnly } from '../../../../lib/period';

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

const KIND: Record<Employment, string> = {
  'Full-time': 'border-accent/45 text-accent',
  'Part-time': 'border-accent-2/45 text-accent-2',
  Internship: 'border-dashed border-fg-dim/50 text-fg-dim',
  Freelance: 'border-fg/35 text-fg',
  Contract: 'border-line text-fg-dim',
};

function Role({ role, yr }: { role: string; yr: string }) {
  const { title, kind } = employment(role);
  return (
    <>
      {title && <h4 className="text-[16px] font-medium leading-[1.3]">{title}</h4>}
      <p className={(title ? 'mt-1.5 ' : '') + 'flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] tabular-nums text-muted'}>
        {kind && (
          <span className={'rounded-[4px] border px-1.5 font-mono text-[10px] uppercase leading-[18px] tracking-[0.12em] ' + KIND[kind]}>{kind}</span>
        )}
        <span>{kind === 'Freelance' ? yearsOnly(yr) : yr}</span>
      </p>
    </>
  );
}

function Linked({ related, org, place }: { related: Related; org: string; place: string }) {
  const context = (client: string) =>
    client
      .replace(new RegExp(org.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '')
      .replace(/^[\s·,-]+|[\s·,-]+$/g, '');

  return (
    <LinkedList>
      {related.awards.map((a) => (
        <AwardChip key={a.id} award={a} />
      ))}
      {related.works.map((w) => (
        <WorkChip
          key={w.slug}
          work={w}
          logo={orgLogo(w.client) === orgLogo(`${org} ${place}`) ? null : orgLogo(w.client)}
          context={context(w.client).toLowerCase() === place.toLowerCase() ? undefined : context(w.client)}
        />
      ))}
    </LinkedList>
  );
}

function LogoStack({ logos }: { logos: string[] }) {
  const shown = logos.slice(0, 3);
  const step = shown.length > 1 ? 16 / (shown.length - 1) : 8;
  return (
    <div className="relative h-11 w-11 shrink-0" aria-hidden="true">
      {shown.map((src, i) => (
        <span
          key={src}
          className="absolute flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-bg bg-white p-0.5"
          style={{ left: i * step, top: i * step }}
        >
          <img src={src} alt="" className="h-full w-full object-contain" />
        </span>
      ))}
    </div>
  );
}

export function Post({
  lane,
  hot,
  onHot,
  related,
  wide = false,
}: {
  lane: Lane;
  hot: boolean;
  onHot: Hover;
  related: Map<string, Related>;
  wide?: boolean;
}) {
  const mark = orgLogo(lane.items[0].where);
  const clients = [
    ...new Set(
      lane.items
        .flatMap((i) => related.get(i.id)?.works ?? [])
        .map((w) => orgLogo(w.client))
        .filter((l): l is string => l !== null),
    ),
  ];

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
        {mark || !clients.length ? <OrgMark logo={mark} /> : <LogoStack logos={clients} />}
        <div className="min-w-0">
          <h3 className="text-[18px] font-medium leading-[1.3]">{lane.name}</h3>
          <p className="mt-0.5 text-[14px] leading-[1.45] text-fg-dim">
            {lane.place && <span className="block">{lane.place}</span>}
            <span className="tabular-nums">
              {lane.items.every((i) => employment(i.role).kind === 'Freelance') ? yearsOnly(lane.tenure) : lane.tenure}
            </span>
          </p>
        </div>
      </header>

      <ol className={'space-y-6 pl-6 ' + (wide ? 'max-[900px]:mt-6' : 'mt-6')}>
        {lane.items.map((j, k) => (
          <li key={j.id} id={'role-' + j.id} className="relative">
            <Node live={isLive(j)} />
            {k < lane.items.length - 1 && (
              <span
                aria-hidden="true"
                data-grow="down"
                style={delay(320 + k * 140)}
                className="absolute -bottom-[31px] -left-[21px] top-[14px] w-px bg-line"
              />
            )}
            <Role role={j.role} yr={j.yr} />
            {j.note && <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.65] text-fg-dim">{j.note}</p>}
            {related.has(j.id) && <Linked related={related.get(j.id)!} org={lane.name} place={lane.place} />}
          </li>
        ))}
      </ol>
    </article>
  );
}
