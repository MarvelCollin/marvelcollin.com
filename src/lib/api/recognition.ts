import type { Award } from '../../types/content';
import type { RecognitionRow } from '../../types/rows';

export const rowToAward = (r: RecognitionRow): Award => ({
  id: r.id,
  yr: r.yr,
  name: r.name,
  where: r.place,
  image: r.image ?? undefined,
  sort: r.sort,
});
