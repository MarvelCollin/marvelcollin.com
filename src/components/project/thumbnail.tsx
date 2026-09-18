import { memo } from 'react';
import type { Project } from '../../types/content';
import { TONES } from '../../content/tones';
import { responsive } from '../../lib/img';
import { SmartImage } from '../ui/smart-image';

const CARD = '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px';

export const Thumbnail = memo(function Thumbnail({ p, sizes = CARD }: { p: Project; sizes?: string }) {
  if (p.cover) {
    return <SmartImage fill {...responsive(p.cover, sizes)} alt={p.name} className="object-cover object-center" />;
  }
  const tone = TONES[p.tone] || TONES['warm'];
  return (
    <span className="ph-wrap" style={{ position: 'absolute', inset: 0, display: 'block' }}>
      <span style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 85% at ${tone.pos}, ${tone.glow}, transparent 70%), radial-gradient(85% 65% at ${tone.pos}, ${tone.glow}, transparent 52%), linear-gradient(155deg, ${tone.tint}, transparent 60%)` }}></span>
      <span className="ph-tex"></span>
    </span>
  );
});
