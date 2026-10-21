import type { Project } from '../../types/content';
import type { WorkRow } from '../../types/rows';

export function rowToWork(r: WorkRow): Project {
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
    live: r.live ?? undefined,
  };
}
