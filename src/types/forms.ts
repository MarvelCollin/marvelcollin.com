export interface WorkForm {
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
  body: string;
  result: string;
  tone: string;
  stills: string;
  cover: string;
  images: string;
  repo: string;
}

export interface SkillForm {
  name: string;
  opinion: string;
}

export interface ExpForm {
  yr: string;
  role: string;
  where: string;
  note: string;
}

export interface AwardForm {
  yr: string;
  name: string;
  where: string;
  image: string;
}

export interface EduForm {
  yr: string;
  degree: string;
  school: string;
  note: string;
}
