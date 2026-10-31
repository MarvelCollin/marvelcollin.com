import { asset } from './asset';
import { img } from './img';

const ORGS: Record<string, string> = {
  binus: '/logos/binus.svg',
  immanuel: '/logos/ski.svg',
  satu: '/logos/satu.png',
  'e-ducate': '/logos/educate.jpg',
  'sahabat sentarum': '/logos/sahabat-sentarum.png',
  itel: '/logos/itel.png',
  'owl eyewear': '/logos/owl.png',
};

const resolve = (url: string) => (url.endsWith('.svg') ? asset(url) : img(url, 128)!);

const LOGOS = Object.entries(ORGS).map(([key, url]) => [key, resolve(url)] as const);

export function orgLogo(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, url] of LOGOS) {
    if (lower.includes(key)) return url;
  }
  return null;
}

export function preloadOrgLogos() {
  if (typeof Image === 'undefined') return;
  for (const [, url] of LOGOS) {
    const pic = new Image();
    pic.decoding = 'async';
    pic.src = url;
  }
}
