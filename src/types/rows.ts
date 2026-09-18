export interface WorkRow {
  id: string;
  slug: string;
  num: string;
  name: string;
  year: string;
  role: string;
  stack: string;
  client: string;
  tag: string;
  description: string;
  brief: string;
  body: string[];
  result: string;
  tone: string;
  stills: string[];
  cover: string | null;
  images: string[] | null;
  repo: string | null;
}

export interface ExperienceRow {
  id: string;
  yr: string;
  role: string;
  place: string;
  note: string;
  sort: number;
}

export interface RecognitionRow {
  id: string;
  yr: string;
  name: string;
  place: string;
  image: string | null;
  sort: number;
}
