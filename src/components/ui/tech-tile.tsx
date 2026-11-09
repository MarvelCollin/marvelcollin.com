import { TechIcon } from './tech-icon';
import { Tip } from './tip';

const SIZE = {
  md: { box: 'h-10 w-10 rounded-lg', icon: 20 },
  lg: { box: 'h-16 w-16 rounded-xl', icon: 34 },
};

export function TechTile({ name, size = 'lg' }: { name: string; size?: keyof typeof SIZE }) {
  const s = SIZE[size];
  return (
    <Tip label={name}>
      <span
        className={
          'flex items-center justify-center border border-line bg-bg/70 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 ' +
          s.box
        }
      >
        <TechIcon name={name} size={s.icon} />
      </span>
      <span className="sr-only">{name}</span>
    </Tip>
  );
}
