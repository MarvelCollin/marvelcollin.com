import type { HistoryItem } from '../../types/content';
import type { ExperienceRow } from '../../types/rows';

export const rowToExperience = (r: ExperienceRow): HistoryItem => ({
  id: r.id,
  yr: r.yr,
  role: r.role,
  where: r.place,
  note: r.note,
  sort: r.sort,
});
