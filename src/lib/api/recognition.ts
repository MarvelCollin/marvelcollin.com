import { supabase, TABLES } from '../supabase';
import type { Award } from '../../types/content';
import type { RecognitionRow } from '../../types/rows';
import { guard, nextSort } from './internal';

export type RecognitionInput = Omit<Award, 'id' | 'sort'>;

function rowToRecognition(r: RecognitionRow): Award {
  return { id: r.id, yr: r.yr, name: r.name, where: r.place, image: r.image ?? undefined, sort: r.sort };
}

function recognitionToRow(a: RecognitionInput) {
  return { yr: a.yr, name: a.name, place: a.where, image: a.image ?? null };
}

export async function fetchRecognition(): Promise<Award[]> {
  const { data, error } = await supabase.from(TABLES.recognition).select('*').order('sort', { ascending: true });
  return guard(data as RecognitionRow[] | null, error).map(rowToRecognition);
}

export async function createRecognition(input: RecognitionInput): Promise<void> {
  const sort = await nextSort(TABLES.recognition);
  const { error } = await supabase.from(TABLES.recognition).insert({ ...recognitionToRow(input), sort });
  if (error) throw new Error(error.message);
}

export async function updateRecognition(id: string, input: RecognitionInput): Promise<void> {
  const { error } = await supabase.from(TABLES.recognition).update(recognitionToRow(input)).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteRecognition(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.recognition).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
