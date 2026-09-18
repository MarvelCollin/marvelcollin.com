import { TABLES } from '../env';
import type { Award } from '../../types/content';
import type { RecognitionRow } from '../../types/rows';
import { table } from './table';

export type RecognitionInput = Omit<Award, 'id' | 'sort'>;

export const recognition = table<Award, RecognitionInput, RecognitionRow>({
  name: TABLES.recognition,
  order: 'sort',
  sorted: true,
  fromRow: (r) => ({ id: r.id, yr: r.yr, name: r.name, where: r.place, image: r.image ?? undefined, sort: r.sort }),
  toRow: (a) => ({ yr: a.yr, name: a.name, place: a.where, image: a.image ?? null }),
});
