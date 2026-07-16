import { useContent } from '../content/use-content';
import { img } from '../lib/img';
import { MetaList } from '../components/meta-list';

export function About() {
  const { skills: SKILLS, experience: HISTORY, recognition: AWARDS, education: EDUCATION } = useContent();
  return (
    <div data-screen-label="About">
      <section className="mx-auto max-w-[1320px] px-10 pt-[140px] pb-20 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[560px]:pt-[92px]">
        <div className="pb-16">
          <span className="mb-6 inline-block -rotate-2 font-hand text-[clamp(32px,4vw,54px)] leading-none text-accent-soft">about</span>
          <p className="max-w-[30ch] font-sans text-[clamp(24px,2.6vw,36px)] font-medium leading-[1.3] tracking-[-0.015em]">
            Computer Science student at BINUS University and a full-stack engineer. I build web applications and care about the details that make them feel right.
          </p>
          <p className="mt-[22px] max-w-[56ch] text-[17px] leading-[1.6] text-fg-dim">
            I work across the stack: TypeScript and React on the front, Go, .NET Core, and PHP on the back, with microservices and RabbitMQ in production on the BINUS laboratory platform. On the side I build games with Three.js, ML experiments in Python, and award-winning robotics.
          </p>
          <p className="mt-[22px] max-w-[56ch] text-[17px] leading-[1.6] text-fg-dim">
            Based in Jakarta. Open to collaborations and interesting projects.
          </p>
        </div>

        <MetaList
          items={[
            { label: 'Now', value: 'Full-stack engineer, BINUS R&D.' },
            { label: 'Based', value: 'Jakarta, Indonesia · GMT+7' },
            { label: 'Studying', value: 'Computer Science, BINUS University' },
            {
              label: 'Elsewhere',
              value: (
                <span className="flex flex-wrap gap-3.5">
                  <a className="text-fg-dim transition-colors hover:text-accent" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">github</a>
                  <a className="text-fg-dim transition-colors hover:text-accent" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">linkedin</a>
                  <a className="text-fg-dim transition-colors hover:text-accent" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">instagram</a>
                </span>
              ),
            },
          ]}
        />

        <div className="pt-20">
          <div className="mb-2 flex items-baseline justify-between border-b border-line pb-[14px]">
            <span className="font-hand text-[clamp(26px,2.8vw,36px)] leading-none text-accent-soft">Skills</span>
            <span className="text-[13px] font-light text-fg-dim">2018 to now</span>
          </div>
          <div className="grid grid-cols-2 gap-x-[60px] border-t border-line max-[900px]:grid-cols-1 max-[900px]:gap-0">
            {SKILLS.map((s, i) => (
              <div className="grid grid-cols-[120px_1fr] items-baseline gap-5 border-b border-line py-[18px] max-[900px]:grid-cols-[100px_1fr] max-[560px]:grid-cols-1 max-[560px]:gap-0.5" key={i}>
                <div className="text-[16px] font-medium">{s.name}</div>
                <div className="text-[14px] leading-[1.45] text-fg-dim">{s.opinion}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-18">
          <div className="mb-2 flex items-baseline justify-between border-b border-line pb-[14px]">
            <span className="font-hand text-[clamp(26px,2.8vw,36px)] leading-none text-accent-soft">Experience</span>
            <span className="text-[13px] font-light text-fg-dim">2019 to present</span>
          </div>
          <div className="mt-2">
            {HISTORY.map((j, i) => (
              <div className="grid grid-cols-[160px_1fr] items-baseline gap-[60px] border-b border-line py-7 max-[900px]:grid-cols-1 max-[900px]:gap-2" key={i}>
                <div className="text-[13px] font-sans leading-[1.4] text-muted">{j.yr}</div>
                <div>
                  <div className="text-[20px] font-medium leading-[1.3]">{j.role} <span className="font-light text-fg-dim">at {j.where}</span></div>
                  <div className="mt-1.5 max-w-[54ch] text-[14px] leading-[1.5] text-fg-dim">{j.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-24">
          <div className="mb-2 flex items-baseline justify-between border-b border-line pb-[14px]">
            <span className="font-hand text-[clamp(26px,2.8vw,36px)] leading-none text-accent-soft">Education</span>
            <span className="text-[13px] font-light text-fg-dim">2020 to present</span>
          </div>
          <div className="mt-2">
            {EDUCATION.map((e) => (
              <div className="grid grid-cols-[160px_1fr] items-baseline gap-[60px] border-b border-line py-7 max-[900px]:grid-cols-1 max-[900px]:gap-2" key={e.id}>
                <div className="text-[13px] font-sans leading-[1.4] text-muted">{e.yr}</div>
                <div>
                  <div className="text-[20px] font-medium leading-[1.3]">{e.degree} <span className="font-light text-fg-dim">{e.school}</span></div>
                  <div className="mt-1.5 max-w-[54ch] text-[14px] leading-[1.5] text-fg-dim">{e.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-16">
          <div className="mb-2 flex items-baseline justify-between border-b border-line pb-[14px]">
            <span className="font-hand text-[clamp(26px,2.8vw,36px)] leading-none text-accent-soft">Licenses & Awards</span>
            <span className="text-[13px] font-light text-fg-dim">2022 to 2025</span>
          </div>
          <div className="mt-2">
            {AWARDS.map((a) => (
              <div className="grid grid-cols-[80px_1fr_1fr] items-baseline gap-6 border-b border-line py-[18px] text-[15px]" key={a.id}>
                <div className="text-[13px] font-sans text-muted">{a.yr}</div>
                <div className="font-medium">{a.name}</div>
                <div className="font-light text-fg-dim">{a.where}</div>
                {a.image && (
                  <img
                    className="col-span-full mt-4 max-h-[300px] w-full max-w-[560px] rounded-lg border border-line bg-bg-2 object-contain object-left"
                    src={img(a.image, 1000)}
                    alt={a.name}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
