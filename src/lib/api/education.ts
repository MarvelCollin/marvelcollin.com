import { supabase, TABLES } from '../supabase';
import type { Education } from '../../types/content';
import { guard, nextSort } from './internal';

export type EducationInput = Omit<Education, 'id' | 'sort'>;

export async function fetchEducation(): Promise<Education[]> {
  const { data, error } = await supabase.from(TABLES.education).select('*').order('sort', { ascending: true });
  return guard(data as Education[] | null, error);
}

export async function createEducation(input: EducationInput): Promise<void> {
  const sort = await nextSort(TABLES.education);
  const { error } = await supabase.from(TABLES.education).insert({ ...input, sort });
  if (error) throw new Error(error.message);
}

export async function updateEducation(id: string, input: EducationInput): Promise<void> {
  const { error } = await supabase.from(TABLES.education).update(input).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.education).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
