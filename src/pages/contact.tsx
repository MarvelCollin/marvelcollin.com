import { Reveal } from '../components/reveal';

export function Contact() {
  return (
    <div data-screen-label="Contact">
      <section className="flex min-h-[85vh] flex-col justify-center px-10 max-[900px]:px-[22px]">
        <Reveal className="mx-auto w-full max-w-[700px]">
          <p className="mb-6 text-[13px] uppercase tracking-[0.1em] text-muted">Get in touch</p>
          <a
            className="block font-sans text-[clamp(28px,5.5vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em] text-fg transition-colors duration-300 hover:text-accent-soft"
            href="mailto:marvelcollin7@gmail.com"
          >
            marvelcollin7@gmail.com
          </a>
          <p className="mt-8 max-w-[44ch] text-[17px] leading-[1.7] text-fg-dim">
            Open to collaborations, freelance, and interesting projects. Reach me on any of these and I'll get back to you.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub</a>
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p className="mt-10 text-[13px] text-muted">Jakarta, Indonesia · GMT+7</p>
        </Reveal>
      </section>
    </div>
  );
}
