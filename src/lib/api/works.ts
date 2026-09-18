import { supabase, TABLES } from '../supabase';
import type { Project } from '../../types/content';
import type { WorkRow } from '../../types/rows';
import { guard } from './internal';

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

export async function fetchWorks(): Promise<Project[]> {
  const { data, error } = await supabase.from(TABLES.works).select('*').order('num', { ascending: true });
  return guard(data as WorkRow[] | null, error).map(rowToWork);
}

export async function createWork(input: WorkInput): Promise<void> {
  const { error } = await supabase.from(TABLES.works).insert(workToRow(input));
  if (error) throw new Error(error.message);
}

export async function updateWork(id: string, input: WorkInput): Promise<void> {
  const { error } = await supabase.from(TABLES.works).update(workToRow(input)).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteWork(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.works).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
