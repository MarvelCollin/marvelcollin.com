import { useEffect, useSyncExternalStore } from 'react';
import { readRepoStats, repoSlug, requestRepoStats, subscribeRepoStats, type RepoStats } from '../lib/api/github';

export function useRepoStats(url?: string | null): RepoStats | null {
  const slug = repoSlug(url);
  const all = useSyncExternalStore(subscribeRepoStats, readRepoStats);

  useEffect(() => {
    if (slug) requestRepoStats(slug);
  }, [slug]);

  return slug ? (all[slug] ?? null) : null;
}
