import type { Chapter } from '../../types/content';

export const CHAPTERS: Chapter[] = [
  {
    id: 'prologue',
    numeral: '00',
    label: 'Prologue',
    dek: 'Fullstack engineer in Jakarta.',
    marginal: 'Jakarta',
    band: false,
  },
  {
    id: 'origin',
    numeral: 'I',
    label: 'Education',
    dek: 'Network engineering school, then Computer Science at BINUS.',
    marginal: '2020',
    band: true,
  },
  {
    id: 'practice',
    numeral: 'II',
    label: 'Experience',
    dek: 'Fullstack engineer at BINUS since 2024.',
    marginal: '2022',
    band: false,
  },
  {
    id: 'craft',
    numeral: 'III',
    label: 'Skills',
    dek: 'What I build with.',
    marginal: 'Stack',
    band: true,
  },
  {
    id: 'work',
    numeral: 'IV',
    label: 'Projects',
    dek: 'Things I have built.',
    marginal: 'Portfolio',
    band: false,
  },
  {
    id: 'research',
    numeral: 'V',
    label: 'Research',
    dek: 'Two papers on compressing language models.',
    marginal: 'Papers',
    band: true,
  },
  {
    id: 'recognition',
    numeral: 'VI',
    label: 'Recognition',
    dek: 'Awards in teaching and robotics.',
    marginal: 'Awards',
    band: false,
  },
  {
    id: 'epilogue',
    numeral: 'VII',
    label: 'Epilogue',
    dek: 'Open to freelance and full time.',
    marginal: 'Contact',
    band: true,
  },
];

export const NAV_CHAPTERS = ['origin', 'craft', 'work', 'research', 'epilogue'];
