import { createContext } from 'react';
import type { ContentState } from '../types/content';

export const ContentContext = createContext<ContentState | null>(null);
