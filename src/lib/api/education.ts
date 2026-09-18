import { TABLES } from '../env';
import type { Education } from '../../types/content';
import { table } from './table';

export type EducationInput = Omit<Education, 'id' | 'sort'>;

export const education = table<Education, EducationInput>({ name: TABLES.education, order: 'sort', sorted: true });
