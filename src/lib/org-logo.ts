const ORGS: Record<string, string> = {
  binus: 'https://www.google.com/s2/favicons?domain=binus.ac.id&sz=128',
  immanuel: 'https://www.google.com/s2/favicons?domain=ski.sch.id&sz=128',
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
