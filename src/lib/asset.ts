import VERSIONS from 'virtual:asset-versions';
import SIZES from '../assets/image-sizes.json';

const SOURCE = new Map(Object.entries(SIZES as Record<string, { base: string }>).map(([src, s]) => [s.base, src]));

// Adds ?v=<content hash> to a public file so it can be cached forever.
export function asset(url: string): string;
export function asset(url: string | null | undefined): string | null | undefined;
export function asset(url: string | null | undefined) {
  if (!url || !url.startsWith('/') || url.includes('?')) return url;
  const variant = /^(\/img\/.+)-\d+\.webp$/.exec(url);
  const key = (variant && SOURCE.get(variant[1])) || url;
  const v = VERSIONS[key];
  return v ? `${url}?v=${v}` : url;
}
