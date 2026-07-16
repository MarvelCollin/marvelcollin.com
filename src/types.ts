export interface Project {
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
  github?: string;
  link?: string;
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
