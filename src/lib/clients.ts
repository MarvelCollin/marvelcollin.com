import type { Project } from '../types/content';
import { orgLogo } from './org-logo';

export interface Client {
  key: string;
  name: string;
  place: string;
  logo: string | null;
  works: Project[];
  services?: string[];
}

export const SITE_CLIENTS: Client[] = [
  {
    key: 'joinenjoy',
    name: 'JOINENJOY',
    place: 'Berlin, Germany',
    logo: orgLogo('joinenjoy'),
    works: [],
    services: ['Security audit and hardening', 'SEO', 'Website recovery', 'Deployments', 'WordPress'],
  },
];

export function freelanceClients(works: Project[]): Client[] {
  const clients = new Map<string, Client>();
  for (const work of works) {
    if (work.tag !== 'freelance' || !work.client) continue;
    const [name, ...rest] = work.client.split(',').map((part) => part.trim());
    const key = name.toLowerCase();
    const client = clients.get(key) ?? { key, name, place: rest.join(', '), logo: orgLogo(name), works: [] };
    client.works.push(work);
    clients.set(key, client);
  }
  return [...clients.values()];
}
