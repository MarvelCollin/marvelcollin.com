import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { FaArrowRight, FaArrowUpRightFromSquare, FaBriefcase, FaFolderOpen, FaXmark } from 'react-icons/fa6';
import { useContent } from '../../../../content/use-content';
import { WORK_TYPES } from '../../../../content/work-types';
import { useDismiss } from '../../../../hooks/use-dismiss';
import { useModal } from '../../../../hooks/use-modal';
import { freelanceClients, type Client } from '../../../../lib/clients';
import { setFlipOrigin } from '../../../../lib/flip';
import { img } from '../../../../lib/img';
import { preloadOrgLogos } from '../../../../lib/org-logo';
import { delay } from '../../../../lib/motion';
import { workHref } from '../../../../lib/work-link';
import { Skel } from '../../../../components/ui/skeleton';

function Logo({ client, size }: { client: Client; size: string }) {
  return (
    <span className={'flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1.5 ' + size}>
      {client.logo ? (
        <img src={client.logo} alt="" decoding="async" fetchPriority="high" className="h-full w-full object-contain" />
      ) : (
        <FaBriefcase size={16} className="text-muted" aria-hidden="true" />
      )}
    </span>
  );
}

function count(n: number) {
  return n === 1 ? '1 project' : `${n} projects`;
}

function ClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-sheet]');

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Projects for ${client.name}`}
      {...dismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 outline-none max-[560px]:items-end max-[560px]:p-0"
    >
      <div aria-hidden="true" className="ov-enter absolute inset-0 bg-[var(--scrim)]" />
      <div
        data-sheet
        className="ov-enter relative flex max-h-[min(88vh,820px)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-line bg-bg-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] max-[560px]:max-h-[90vh] max-[560px]:rounded-b-none"
      >
        <header className="flex items-center gap-4 border-b border-line px-6 py-5 max-[560px]:px-4">
          <Logo client={client} size="h-12 w-12" />
          <div className="mr-auto min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2">Freelance client</p>
            <p className="mt-0.5 truncate text-[18px] font-medium text-fg">{client.name}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {client.place ? `${client.place} · ` : ''}
              {count(client.works.length)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line text-fg-dim transition-colors hover:border-accent hover:text-fg"
          >
            <FaXmark size={16} aria-hidden="true" />
          </button>
        </header>
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-6 max-[560px]:p-4">
          {client.works.map((work, i) => (
            <li key={work.slug} className="ov-rise" style={delay(120 + i * 70)}>
              <a
                href={workHref(work.slug)}
                onClick={(e) => {
                  setFlipOrigin(e.currentTarget);
                  onClose();
                }}
                className="group grid grid-cols-[148px_1fr_auto] items-center gap-5 rounded-lg border border-line bg-bg/70 p-2.5 pr-5 transition-colors duration-200 hover:border-accent/50 max-[560px]:grid-cols-[88px_1fr] max-[560px]:gap-3.5 max-[560px]:pr-3"
              >
                <span className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-md border border-line bg-bg-2">
                  {work.cover ? (
                    <img src={img(work.cover, 400)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <FaFolderOpen size={18} className="text-accent-2" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-accent-2">
                    {WORK_TYPES[work.slug] ?? 'Project'} · {work.year}
                  </span>
                  <span className="mt-1 block text-[16px] leading-[1.3] text-fg">{work.name}</span>
                  <span className="mt-1 line-clamp-2 block text-[13px] leading-[1.45] text-fg-dim max-[560px]:hidden">{work.brief}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-200 group-hover:border-accent group-hover:text-accent-soft group-hover:translate-x-0.5 max-[560px]:hidden"
                >
                  <FaArrowRight size={12} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

preloadOrgLogos();

const pop = (ms: number) => ({ ...delay(ms), '--from-scale': '0.85' }) as CSSProperties;

export function Clients({ at }: { at: number }) {
  const { works, loading } = useContent();
  const clients = useMemo(() => freelanceClients(works), [works]);
  const [open, setOpen] = useState<Client | null>(null);

  if (!loading && clients.length === 0) return null;

  return (
    <div data-part="clients" style={delay(at)} className="mt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">My clients</p>
      <ul className="mt-3 flex flex-wrap gap-4">
        {loading && clients.length === 0
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i}>
                <Skel className="block h-14 w-14 rounded-lg" />
              </li>
            ))
          : clients.map((client, i) => (
              <li key={client.key} data-part="logo" style={pop(at + 140 + i * 80)}>
                <button
                  type="button"
                  onClick={() => setOpen(client)}
                  aria-haspopup="dialog"
                  aria-label={`${client.name}, ${count(client.works.length)}. Show projects`}
                  title={client.name}
                  className="group relative block cursor-pointer rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Logo client={client} size="h-14 w-14 transition-[border-color,box-shadow] duration-200 group-hover:border-accent group-hover:shadow-[0_0_0_3px_rgba(224,163,63,0.25)]" />
                  <span
                    aria-hidden="true"
                    className="client-badge absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-bg bg-accent text-accent-ink transition-transform duration-200 group-hover:scale-110"
                  >
                    <FaArrowUpRightFromSquare size={8} />
                  </span>
                </button>
              </li>
            ))}
      </ul>
      {open && <ClientModal client={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
