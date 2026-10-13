import type { Award, Education, Project } from '../types/content';
import { span, type Lane } from './tenure';

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

function place(lanes: Lane[], org: string, when: string): string | null {
  const range = years(when);
  const text = org.toLowerCase();
  let pick: string | null = null;
  let rank: [number, number] = [-1, -1];
  for (const lane of lanes) {
    if (!text.includes(lane.name.toLowerCase())) continue;
    for (let k = 0; k < lane.items.length; k++) {
      const months = range ? shared(lane, k, range) : 1;
      if (!months) continue;
      if (lane.name.length > rank[0] || (lane.name.length === rank[0] && months > rank[1])) {
        rank = [lane.name.length, months];
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
    const id = place(lanes, w.client, w.year);
    if (id) slot(id).works.push(w);
  }
  return out;
}

export function schoolAwards(schools: Education[], awards: Award[], claimed: Set<string>): Map<string, Award[]> {
  const out = new Map<string, Award[]>();
  for (const a of awards) {
    const range = years(a.yr);
    if (claimed.has(a.id) || !range) continue;
    const school = schools.find((e) => {
      const s = span(e.yr);
      return s !== null && s.from <= range[1] && s.to >= range[0];
    });
    if (school) out.set(school.id, [...(out.get(school.id) ?? []), a]);
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
