import { TABLES } from '../supabase';
import type { Project } from '../../types/content';
import type { WorkRow } from '../../types/rows';
import { table } from './table';

export type WorkInput = Omit<Project, 'id'>;

function rowToWork(r: WorkRow): Project {
  return {
    id: r.id,
    slug: r.slug,
    num: r.num,
    name: r.name,
    year: r.year,
    role: r.role,
    stack: r.stack,
    client: r.client,
    tag: r.tag,
    desc: r.description,
    brief: r.brief,
    body: r.body ?? [],
    result: r.result,
    tone: r.tone,
    stills: r.stills ?? [],
    cover: r.cover ?? undefined,
    images: r.images ?? undefined,
    repo: r.repo ?? undefined,
  };
}

function workToRow(w: WorkInput) {
  return {
    slug: w.slug,
    num: w.num,
    name: w.name,
    year: w.year,
    role: w.role,
    stack: w.stack,
    client: w.client,
    tag: w.tag,
    description: w.desc,
    brief: w.brief,
    body: w.body,
    result: w.result,
    tone: w.tone,
    stills: w.stills,
    cover: w.cover ?? null,
    images: w.images ?? null,
    repo: w.repo ?? null,
  };
}

export const works = table<Project, WorkInput, WorkRow>({
  name: TABLES.works,
  order: 'num',
  fromRow: rowToWork,
  toRow: workToRow,
});
