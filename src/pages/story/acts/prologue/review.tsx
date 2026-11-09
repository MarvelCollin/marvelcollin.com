import { FaStar } from 'react-icons/fa6';
import { TechIcon } from '../../../../components/ui/tech-icon';
import { delay } from '../../../../lib/motion';

const REVIEW = {
  quote:
    'Marvel is a very professional freelancer, always thinking ahead what is best for the customer. He finished all tasks in time and even eliminated security risks that were not on my task list. He is the first freelancer here I trust fully and I recommend him for any work. He is a very reliable person.',
  name: 'Thomas Kasal',
  where: 'Berlin, Germany',
  stack: ['Laravel', 'Strato', 'WordPress'],
  when: 'Nov 2026',
};

export function Review({ at }: { at: number }) {
  return (
    <figure data-part="review" style={delay(at)} className="ml-auto w-[460px] shrink-0 border-t border-line pt-4 max-[900px]:ml-0 max-[900px]:w-full">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">Client review</span>
        <span className="flex items-center gap-0.5 text-accent" aria-label="Rated 5 out of 5">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} size={11} aria-hidden="true" />
          ))}
        </span>
        <span className="font-mono text-[11px] text-fg-dim">5.0</span>
      </div>
      <blockquote className="mt-3 text-[15px] leading-[1.6] text-fg">“{REVIEW.quote}”</blockquote>
      <figcaption className="mt-3">
        <p className="text-[14px] text-fg">
          {REVIEW.name}
          <span className="text-fg-dim"> · {REVIEW.where}</span>
        </p>
        <div className="mt-2 flex items-center gap-3">
          <ul className="flex items-center gap-2.5" aria-label="Stack">
            {REVIEW.stack.map((name) => (
              <li key={name} title={name}>
                <TechIcon name={name} size={18} />
                <span className="sr-only">{name}</span>
              </li>
            ))}
          </ul>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{REVIEW.when}</span>
        </div>
      </figcaption>
    </figure>
  );
}
