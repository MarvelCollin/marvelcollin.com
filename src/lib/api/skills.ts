import { supabase, TABLES } from '../supabase';
import type { Skill } from '../../types/content';
import { guard, nextSort } from './internal';

export type SkillInput = Omit<Skill, 'id' | 'sort'>;

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase.from(TABLES.skills).select('*').order('sort', { ascending: true });
  return guard(data as Skill[] | null, error);
}

export async function createSkill(input: SkillInput): Promise<void> {
  const sort = await nextSort(TABLES.skills);
  const { error } = await supabase.from(TABLES.skills).insert({ ...input, sort });
  if (error) throw new Error(error.message);
}

export async function updateSkill(id: string, input: SkillInput): Promise<void> {
  const { error } = await supabase.from(TABLES.skills).update(input).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.skills).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
