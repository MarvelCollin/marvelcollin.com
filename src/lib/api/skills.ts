import { TABLES } from '../env';
import type { Skill } from '../../types/content';
import { table } from './table';

export type SkillInput = Omit<Skill, 'id' | 'sort'>;

export const skills = table<Skill, SkillInput>({ name: TABLES.skills, order: 'sort', sorted: true });
