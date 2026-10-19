import { useMemo } from 'react';
import { useContent } from '../content/use-content';
import { chronicle } from '../lib/tenure';
import { relate, roleOf } from '../lib/related';

export function useRoleOf(slug: string) {
  const { experience, recognition, works } = useContent();

  return useMemo(() => {
    const lanes = chronicle(experience);
    const hit = roleOf(lanes, relate(lanes, recognition, works), slug);
    const item = hit?.lane.items.find((i) => i.id === hit.id);
    return hit && item ? { id: hit.id, role: item.role, where: item.where, org: hit.lane.name, place: hit.lane.place } : null;
  }, [experience, recognition, works, slug]);
}
