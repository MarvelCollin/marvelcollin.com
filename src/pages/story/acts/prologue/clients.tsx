import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { FaArrowRight, FaBriefcase, FaFolderOpen, FaXmark } from 'react-icons/fa6';
import { useContent } from '../../../../content/use-content';
import { WORK_TYPES } from '../../../../content/work-types';
import { useDismiss } from '../../../../hooks/use-dismiss';
import { useModal } from '../../../../hooks/use-modal';
import { freelanceClients, type Client } from '../../../../lib/clients';
import { setFlipOrigin } from '../../../../lib/flip';
import { img } from '../../../../lib/img';
import { workHref } from '../../../../lib/work-link';
import { Skel } from '../../../../components/ui/skeleton';

function Logo({ client, size }: { client: Client; size: string }) {
  return (
    <span className={'flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1.5 ' + size}>
      {client.logo ? (
        <img src={client.logo} alt="" className="h-full w-full object-contain" />
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
          {client.works.map((work) => (
            <li key={work.slug}>
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

export function Clients({ style }: { style?: CSSProperties }) {
  const { works, loading } = useContent();
  const clients = useMemo(() => freelanceClients(works), [works]);
  const [open, setOpen] = useState<Client | null>(null);

  if (!loading && clients.length === 0) return null;

  return (
    <div data-part="clients" style={style} className="mt-12">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">Freelance clients</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted max-[560px]:hidden">Pick one to see the work</span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-3">
        {loading && clients.length === 0
          ? Array.from({ length: 3 }, (_, i) => (
              <li key={i}>
                <Skel className="block h-[66px] w-[250px] rounded-lg" />
              </li>
            ))
          : clients.map((client) => (
              <li key={client.key} className="max-[560px]:w-full">
                <button
                  type="button"
                  onClick={() => setOpen(client)}
                  aria-haspopup="dialog"
                  aria-label={`${client.name}, ${count(client.works.length)}. Show projects`}
                  className="group flex w-full cursor-pointer items-center gap-3.5 rounded-lg border border-line bg-bg/70 py-2 pl-2 pr-3 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60"
                >
                  <Logo client={client} size="h-12 w-12" />
                  <span className="mr-2 min-w-0 flex-1">
                    <span className="block text-[15px] leading-[1.3] text-fg">{client.name}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      {count(client.works.length)}
                      {client.place && ` · ${client.place.split(',')[0]}`}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent-soft transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
                  >
                    <FaArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>
              </li>
            ))}
      </ul>
      {open && <ClientModal client={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
