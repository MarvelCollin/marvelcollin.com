import type { HistoryItem } from '../types/content';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MIN_SHARED_MONTHS = 3;
const TODAY = new Date();

export const NOW = TODAY.getFullYear() * 12 + TODAY.getMonth();

export interface Span {
  from: number;
  to: number;
  start: string;
  end: string;
}

export interface Lane {
  key: string;
  name: string;
  place: string;
  items: HistoryItem[];
  spans: (Span | null)[];
  tenure: string;
}

export type Block = { kind: 'solo'; lane: Lane } | { kind: 'parallel'; lanes: Lane[]; window: Span };

function month(text: string, edge: number): number | null {
  const t = text.toLowerCase();
  if (t === 'present') return NOW;
  const m = t.match(/^(?:([a-z]{3})[a-z]*\.?\s+)?(\d{4})$/);
  if (!m) return null;
  const i = m[1] ? MONTHS.indexOf(m[1]) : edge;
  return i < 0 ? null : Number(m[2]) * 12 + i;
}

export function span(yr: string): Span | null {
  const [start, end = start] = yr.split(/\s+to\s+/i).map((s) => s.trim());
  const from = month(start, 0);
  const to = month(end, 11);
  if (from === null || to === null || to < from) return null;
  return { from, to, start, end };
}

export function label(s: Span): string {
  return s.start === s.end ? s.start : `${s.start} to ${s.end}`;
}

function merge(spans: Span[]): Span {
  const first = spans.reduce((a, b) => (b.from < a.from ? b : a));
  const last = spans.reduce((a, b) => (b.to > a.to ? b : a));
  return { from: first.from, to: last.to, start: first.start, end: last.end };
}

function together(x: Span, y: Span): Span | null {
  const late = y.from > x.from ? y : x;
  const early = y.to < x.to ? y : x;
  if (early.to - late.from + 1 < MIN_SHARED_MONTHS) return null;
  return { from: late.from, to: early.to, start: late.start, end: early.end };
}

function shared(a: Lane, b: Lane): Span[] {
  const out: Span[] = [];
  for (const x of a.spans) {
    for (const y of b.spans) {
      const t = x && y ? together(x, y) : null;
      if (t) out.push(t);
    }
  }
  return out;
}

function parts(where: string): [string, string] {
  for (const sep of [' · ', ', ']) {
    const i = where.indexOf(sep);
    if (i > 0) return [where.slice(0, i), where.slice(i + sep.length)];
  }
  return [where, ''];
}

function lane(items: HistoryItem[]): Lane {
  const spans = items.map((i) => span(i.yr));
  const known = spans.filter((s): s is Span => s !== null);
  const [name, place] = parts(items[0].where);
  const tenure =
    known.length === spans.length
      ? label(merge(known))
      : `${items[items.length - 1].yr.split(' to ')[0]} to ${items[0].yr.split(' to ')[1] ?? items[0].yr}`;
  return { key: items[0].id, name, place, items, spans, tenure };
}

export function isLive(item: HistoryItem): boolean {
  return /\bpresent\s*$/i.test(item.yr);
}

export function chronicle(items: HistoryItem[]): Block[] {
  const groups: HistoryItem[][] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last[0].where === item.where) last.push(item);
    else groups.push([item]);
  }

  const blocks: Block[] = [];
  let run: Lane[] = [];
  let overlap: Span[] = [];
  const flush = () => {
    if (run.length === 1) blocks.push({ kind: 'solo', lane: run[0] });
    else if (run.length > 1) blocks.push({ kind: 'parallel', lanes: run, window: merge(overlap) });
    run = [];
    overlap = [];
  };

  for (const next of groups.map(lane)) {
    const found = run.flatMap((r) => shared(r, next));
    if (run.length && !found.length) flush();
    overlap.push(...found);
    run.push(next);
  }
  flush();
  return blocks;
}
