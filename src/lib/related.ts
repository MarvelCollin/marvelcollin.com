import type { Award, Education, HistoryItem, Paper, Project } from '../types/content';
import { employment } from './employment';
import { chronicle, isLive, span, type Lane } from './tenure';

export interface Related {
  awards: Award[];
  works: Project[];
}

function years(text: string): [number, number] | null {
  const found = text.match(/\b(19|20)\d{2}\b/g)?.map(Number);
  if (!found?.length) return null;
  return [Math.min(...found) * 12, Math.max(...found) * 12 + 11];
}

function shared(lane: Lane, k: number, [from, to]: [number, number]): number {
  const s = lane.spans[k];
  return s ? Math.max(0, Math.min(s.to, to) - Math.max(s.from, from) + 1) : 0;
}

function better(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
}

function place(lanes: Lane[], org: string, when: string, name = ''): string | null {
  const exact = span(when);
  const range: [number, number] | null = exact ? [exact.from, exact.to] : years(when);
  const text = org.toLowerCase();
  const title = name.trim().toLowerCase();
  let pick: string | null = null;
  let rank = [-1, -1, -1];
  for (const lane of lanes) {
    if (!text.includes(lane.name.toLowerCase())) continue;
    for (let k = 0; k < lane.items.length; k++) {
      const months = range ? shared(lane, k, range) : 1;
      if (!months) continue;
      const named = title && lane.items[k].role.toLowerCase().includes(title) ? 1 : 0;
      const next = [lane.name.length, named, months];
      if (better(next, rank)) {
        rank = next;
        pick = lane.items[k].id;
      }
    }
  }
  return pick;
}

export function relate(lanes: Lane[], awards: Award[], works: Project[]): Map<string, Related> {
  const out = new Map<string, Related>();
  const slot = (id: string) => {
    const r = out.get(id) ?? { awards: [], works: [] };
    out.set(id, r);
    return r;
  };
  for (const a of awards) {
    const id = place(lanes, a.where, a.yr);
    if (id) slot(id).awards.push(a);
  }
  for (const w of works) {
    const id = place(lanes, `${w.client} · ${w.tag}`, w.year, w.name);
    if (id) slot(id).works.push(w);
  }
  const order = (w: Project) => {
    const s = span(w.year);
    return [s?.from ?? 0, s?.to ?? 0, /present|now/i.test(w.year) ? 1 : 0];
  };
  for (const r of out.values()) r.works.sort((a, b) => (better(order(a), order(b)) ? 1 : better(order(b), order(a)) ? -1 : 0));
  return out;
}

export interface SchoolLinks {
  roles: HistoryItem[];
  awards: Award[];
  papers: Paper[];
}

function overlaps(a: [number, number], b: [number, number]): boolean {
  return a[0] <= b[1] && a[1] >= b[0];
}

export function schoolLinks(
  schools: Education[],
  experience: HistoryItem[],
  awards: Award[],
  papers: Paper[],
  claimed: Set<string>,
): Map<string, SchoolLinks> {
  const out = new Map<string, SchoolLinks>();
  const lanes = chronicle(experience).filter((l) => l.items.some((i) => employment(i.role).kind !== 'Part-time'));
  const held = lanes.flatMap((l) => l.items);
  for (const e of schools) {
    const s = span(e.yr);
    if (!s) continue;
    const range: [number, number] = [s.from, s.to];
    const [name, place = ''] = e.school.toLowerCase().split(' · ').map((x) => x.trim());
    const links: SchoolLinks = {
      roles: held.filter((x) => {
        const t = span(x.yr);
        const where = x.where.toLowerCase();
        const career = employment(x.role).kind === 'Full-time' && isLive(x);
        return (where.includes(name) || (place !== '' && where.includes(place))) && !career && t !== null && overlaps(range, [t.from, t.to]);
      }),
      awards: awards.filter((a) => {
        const t = years(a.yr);
        return t !== null && overlaps(range, t) && (!claimed.has(a.id) || a.where.toLowerCase().includes(name));
      }),
      papers: papers.filter((p) => {
        const t = years(p.year);
        return t !== null && overlaps(range, t);
      }),
    };
    if (links.roles.length || links.awards.length || links.papers.length) out.set(e.id, links);
  }
  return out;
}

export function roleOf(lanes: Lane[], related: Map<string, Related>, slug: string): { lane: Lane; id: string } | null {
  for (const [id, r] of related) {
    if (!r.works.some((w) => w.slug === slug)) continue;
    const lane = lanes.find((l) => l.items.some((i) => i.id === id));
    if (lane) return { lane, id };
  }
  return null;
}
