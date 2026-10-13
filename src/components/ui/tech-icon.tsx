import { skillGlyph, type Tone } from '../../lib/skill-logos';

const FILTER: Record<Tone, string> = {
  invert: 'invert(1)',
  halo: 'drop-shadow(0 0 1px rgba(236, 236, 236, 0.55))',
};

export function TechIcon({
  name,
  size = 16,
  surface = 'dark',
  className = '',
}: {
  name: string;
  size?: number;
  surface?: 'dark' | 'light';
  className?: string;
}) {
  const glyph = skillGlyph(name);
  if (!('src' in glyph)) return null;
  return (
    <img
      src={glyph.src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={'shrink-0 select-none object-contain ' + className}
      style={{ width: size, height: size, filter: surface === 'dark' && glyph.tone ? FILTER[glyph.tone] : undefined }}
    />
  );
}
