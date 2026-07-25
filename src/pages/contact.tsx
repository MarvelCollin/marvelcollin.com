export function Contact() {
  return (
    <div data-screen-label="Contact">
      <section className="mx-auto max-w-[960px] px-10 pt-[140px] pb-20 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[560px]:pt-[92px]">
        <a
          className="mb-16 block max-w-full break-words font-sans text-[clamp(28px,5vw,60px)] font-semibold leading-none tracking-[-0.035em] text-fg transition-colors duration-300 [overflow-wrap:anywhere] hover:text-fg-dim max-[900px]:text-[clamp(24px,6.5vw,40px)]"
          href="mailto:marvelcollin7@gmail.com"
        >
          marvelcollin7@gmail.com
        </a>
        <p className="mb-10 max-w-[50ch] text-[17px] leading-relaxed text-fg-dim">
          Open to collaborations, freelance, and interesting projects. Reach me on any of these and I'll get back to you.
        </p>
        <div className="mb-9 flex gap-7 border-t border-line pt-7">
          <a className="text-[15px] text-fg-dim transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">github</a>
          <a className="text-[15px] text-fg-dim transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">linkedin</a>
          <a className="text-[15px] text-fg-dim transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">instagram</a>
        </div>
        <div className="mb-12 flex flex-wrap items-center gap-2.5 text-[13px] text-muted">
          <span>Jakarta, Indonesia · GMT+7</span>
          <span className="text-line">·</span>
          <span>@MarvelCollin</span>
          <span className="text-line">·</span>
          <span>@marvelcolin_</span>
        </div>
        <div className="flex flex-wrap gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
          <a className="btn primary max-[560px]:justify-center" href="mailto:marvelcollin7@gmail.com">Send email →</a>
          <a className="btn max-[560px]:justify-center" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub →</a>
          <a className="btn max-[560px]:justify-center" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn →</a>
        </div>
      </section>
    </div>
  );
}
