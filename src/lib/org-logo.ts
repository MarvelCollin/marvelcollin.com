const ORGS: Record<string, string> = {
  binus: '/logos/binus.svg',
  immanuel: '/logos/ski.svg',
  satu: '/logos/satu.png',
  'e-ducate': '/logos/educate.jpg',
};

export function orgLogo(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(ORGS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}
