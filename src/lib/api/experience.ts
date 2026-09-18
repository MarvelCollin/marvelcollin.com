import { TABLES } from '../supabase';
import type { HistoryItem } from '../../types/content';
import type { ExperienceRow } from '../../types/rows';
import { table } from './table';

export type ExperienceInput = Omit<HistoryItem, 'id' | 'sort'>;

export const experience = table<HistoryItem, ExperienceInput, ExperienceRow>({
  name: TABLES.experience,
  order: 'sort',
  sorted: true,
  fromRow: (r) => ({ id: r.id, yr: r.yr, role: r.role, where: r.place, note: r.note, sort: r.sort }),
  toRow: (e) => ({ yr: e.yr, role: e.role, place: e.where, note: e.note }),
});
