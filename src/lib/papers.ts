import { PAPERS } from '../content/papers';
import type { Paper, PaperPhoto, Project } from '../types/content';
import { repoSlug } from './api/github';

export function paperAnchor(paper: Paper): string {
  return 'paper-' + paper.slug;
}

export function paperFor(work: Project): Paper | undefined {
  const repo = repoSlug(work.repo);
  return repo ? PAPERS.find((p) => repoSlug(p.repo) === repo) : undefined;
}

export function workFor(paper: Paper, works: Project[]): Project | undefined {
  const repo = repoSlug(paper.repo);
  return repo ? works.find((w) => repoSlug(w.repo) === repo) : undefined;
}

export function paperImages(paper: Paper, work?: Project): PaperPhoto[] {
  if (paper.photos?.length) return paper.photos;
  return work?.cover ? [{ src: work.cover, alt: `${work.name} project case` }] : [];
}

export function jumpTo(id: string) {
  history.replaceState(null, '', '#' + id);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}
