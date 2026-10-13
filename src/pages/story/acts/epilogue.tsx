import { FaDownload, FaFileLines } from 'react-icons/fa6';
import { CV_FILE, CV_PDF, CvButton } from '../../../components/ui/cv-viewer';

const CV = 'flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-5 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors';

export function Epilogue() {
  return (
    <div className="max-w-[1280px]">
      <a
        className="block font-display text-[clamp(28px,5.5vw,64px)] font-semibold leading-[1.05] tracking-[-0.012em] text-fg transition-colors duration-300 hover:text-accent-soft"
        href="mailto:marvelcollin7@outlook.com"
      >
        marvelcollin7@outlook.com
      </a>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href={CV_PDF} download={CV_FILE} className={CV + ' border-accent bg-accent text-accent-ink hover:bg-accent-soft'}>
          <FaDownload size={12} aria-hidden="true" />
          Download CV
        </a>
        <CvButton className={CV + ' border-line text-fg-dim hover:border-accent hover:text-fg'}>
          <FaFileLines size={13} aria-hidden="true" />
          Preview CV
        </CvButton>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub</a>
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">Instagram</a>
      </div>
      <p className="mt-10 text-[13px] text-muted">Jakarta, Indonesia · GMT+7</p>
    </div>
  );
}
