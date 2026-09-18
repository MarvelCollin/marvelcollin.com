import { useContext } from 'react';
import type { Project, ContentState } from '../types/content';
import { ContentContext } from './context';

export function useContent(): ContentState {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function findWork(works: Project[], slug: string): Project | undefined {
  return works.find((p) => p.slug === slug);
}

export function workIndex(works: Project[], slug: string): number {
  return works.findIndex((p) => p.slug === slug);
}
