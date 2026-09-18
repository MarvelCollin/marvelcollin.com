import SIZES from '../assets/image-sizes.json';

const WIDTHS = [400, 800, 1600];

type Local = { base: string; widths: number[] };

const local = (url: string) => (SIZES as Record<string, Local>)[url];

const remote = (url: string, width: number) => {
  if (/\.gif($|\?)/i.test(url)) return url;
  const base = url.replace(/^https?:\/\//i, '');
  return `https://wsrv.nl/?url=${encodeURIComponent(base)}&w=${width}&output=webp&q=80&we&maxage=1y`;
};

function variant(url: string, width: number): string {
  const found = local(url);
  if (found) {
    const w = found.widths.find((x) => x >= width) ?? found.widths[found.widths.length - 1];
    return `${found.base}-${w}.webp`;
  }
  return /^https?:\/\//i.test(url) ? remote(url, width) : url;
}

export function img(url: string | undefined, width = 800): string | undefined {
  return url && variant(url, width);
}

export function srcSet(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const found = local(url);
  if (found) return found.widths.map((w) => `${found.base}-${w}.webp ${w}w`).join(', ');
  if (!/^https?:\/\//i.test(url) || /\.gif($|\?)/i.test(url)) return undefined;
  return WIDTHS.map((w) => `${remote(url, w)} ${w}w`).join(', ');
}

export function responsive(url: string | undefined, sizes: string, width = 800) {
  return { src: img(url, width), srcSet: srcSet(url), sizes };
}
