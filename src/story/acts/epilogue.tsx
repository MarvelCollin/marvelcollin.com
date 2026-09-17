export function Epilogue() {
  return (
    <div className="max-w-[1280px]">
      <a
        className="block font-sans text-[clamp(28px,5.5vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em] text-fg transition-colors duration-300 hover:text-accent-soft"
        href="mailto:marvelcollin7@gmail.com"
      >
        marvelcollin7@gmail.com
      </a>
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub</a>
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">Instagram</a>
      </div>
      <p className="mt-10 text-[13px] text-muted">Jakarta, Indonesia · GMT+7</p>
    </div>
  );
}
