export interface Project {
  id: string;
  slug: string;
  num: string;
  name: string;
  year: string;
  role: string;
  stack: string;
  client: string;
  tag: string;
  desc: string;
  brief: string;
  body: string[];
  result: string;
  tone: string;
  stills: string[];
  cover?: string;
  images?: string[];
  repo?: string;
}

export interface Skill {
  id: string;
  name: string;
  opinion: string;
  sort: number;
}

export interface HistoryItem {
  id: string;
  yr: string;
  role: string;
  where: string;
  note: string;
  sort: number;
}

export interface Award {
  id: string;
  yr: string;
  name: string;
  where: string;
  image?: string;
  sort: number;
}

export interface Education {
  id: string;
  yr: string;
  degree: string;
  school: string;
  note: string;
  sort: number;
}

export interface Paper {
  slug: string;
  title: string;
  year: string;
  authors: string[];
  summary: string;
  repo: string;
  tags: string[];
}

export interface Chapter {
  id: string;
  numeral: string;
  label: string;
  dek: string;
  marginal: string;
  band: boolean;
}

export interface Tone {
  glow: string;
  tint: string;
  pos: string;
}

export interface ContentState {
  works: Project[];
  skills: Skill[];
  experience: HistoryItem[];
  recognition: Award[];
  education: Education[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
