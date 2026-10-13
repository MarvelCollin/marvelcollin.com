import type { Project } from '../types/content';

export function clientOf(p: Project): string | null {
  const client = p.client?.trim();
  return client && !/^personal$/i.test(client) ? client : null;
}
