export function yearOf(period: string): string {
  const years = period.match(/\b(19|20)\d{2}\b/g);
  return years ? years[years.length - 1] : period;
}

export function isRange(period: string): boolean {
  return /\s+to\s+/i.test(period);
}

export function shortPeriod(period: string): string {
  const [start, end] = period.split(/\s+to\s+/i).map((s) => s.trim());
  if (!end) return period;
  const [sm, sy] = start.split(/\s+/);
  if (!sy) return period;
  if (/^present$/i.test(end)) return `${start} to now`;
  const [em, ey] = end.split(/\s+/);
  if (!ey) return period;
  if (sy !== ey) return `${start} to ${end}`;
  return sm === em ? end : `${sm} to ${em} ${ey}`;
}
