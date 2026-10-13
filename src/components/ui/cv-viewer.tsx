import { useEffect, useState, type ReactNode } from 'react';
import { FaArrowUpRightFromSquare, FaDownload, FaXmark } from 'react-icons/fa6';
import { useModal } from '../../hooks/use-modal';
import { useDismiss } from '../../hooks/use-dismiss';

export const CV_PDF = '/cv/marvel-collin-cv.pdf';
export const CV_FILE = 'Marvel-Collin-CV.pdf';
const CV_PAGE = '/cv/marvel-collin-cv.webp';
const DESKTOP = '(min-width: 768px)';

const ACTION =
  'flex h-10 items-center gap-2 rounded-lg border px-4 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors max-[560px]:px-3';

export function CvViewer({ onClose }: { onClose: () => void }) {
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-sheet]');
  const [desktop, setDesktop] = useState(() => matchMedia(DESKTOP).matches);

  useEffect(() => {
    const media = matchMedia(DESKTOP);
    const sync = () => setDesktop(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum vitae"
      {...dismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 outline-none max-[560px]:p-3"
    >
      <div aria-hidden="true" className="ov-enter absolute inset-0 bg-[var(--scrim)]" />
      <div
        data-sheet
        className="ov-enter relative flex h-[min(92vh,1180px)] w-full max-w-[960px] flex-col overflow-hidden rounded-xl border border-line bg-bg-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
      >
        <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-6 py-4 max-[560px]:px-4">
          <div className="mr-auto min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2">Curriculum vitae</p>
            <p className="mt-0.5 text-[16px] font-medium text-fg">Marvel Collin</p>
          </div>
          <a
            href={CV_PDF}
            download={CV_FILE}
            className={ACTION + ' border-accent bg-accent text-accent-ink hover:bg-accent-soft max-[560px]:order-3 max-[560px]:w-full max-[560px]:justify-center'}
          >
            <FaDownload size={12} aria-hidden="true" />
            Download PDF
          </a>
          <a href={CV_PDF} target="_blank" rel="noreferrer" className={ACTION + ' border-line text-fg-dim hover:border-accent hover:text-fg max-[560px]:hidden'}>
            <FaArrowUpRightFromSquare size={11} aria-hidden="true" />
            Open
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close CV preview"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-line text-fg-dim transition-colors hover:border-accent hover:text-fg max-[560px]:order-2"
          >
            <FaXmark size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[#525659]">
          {desktop ? (
            <iframe src={CV_PDF + '#view=FitH&navpanes=0'} title="Marvel Collin CV" className="h-full w-full border-0" />
          ) : (
            <img src={CV_PAGE} alt="Marvel Collin CV, page one" className="mx-auto block w-full max-w-[860px] bg-white" />
          )}
        </div>
      </div>
    </div>
  );
}

export function CvButton({ className, children }: { className: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <CvViewer onClose={() => setOpen(false)} />}
    </>
  );
}
