import type { Chapter } from '../Interface/IChapter';

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
    label: 'Origin',
    dek: 'Computer and network engineering at SMKS Kristen Immanuel 1, then Computer Science at BINUS University.',
    marginal: '2020',
    band: true,
  },
  {
    id: 'practice',
    numeral: 'II',
    label: 'Practice',
    dek: 'Fullstack engineer and R&D staff at BINUS University since 2024. Internal platforms, production Linux servers, laboratory teaching.',
    marginal: '2022',
    band: false,
  },
  {
    id: 'craft',
    numeral: 'III',
    label: 'Craft',
    dek: 'Picked up one problem at a time. Drag them around, they are only tools.',
    marginal: 'Stack',
    band: true,
  },
  {
    id: 'work',
    numeral: 'IV',
    label: 'Work',
    dek: 'Pinned to the board by year. Take one down to read it.',
    marginal: 'Projects',
    band: false,
  },
  {
    id: 'research',
    numeral: 'V',
    label: 'Research',
    dek: 'Quantization, explainability, and Indonesian sentiment analysis. Accepted at ICCSCI 2026.',
    marginal: 'Papers',
    band: true,
  },
  {
    id: 'recognition',
    numeral: 'VI',
    label: 'Recognition',
    dek: 'Best Assistant at BINUS Software Laboratory Center, Medallion of Excellence at LKS National 2022, Bronze at the ASEAN Skills Competition 2022 in mobile robotics.',
    marginal: 'Awards',
    band: false,
  },
  {
    id: 'epilogue',
    numeral: 'VII',
    label: 'Epilogue',
    dek: 'Freelance or full time. I answer from Jakarta, GMT+7.',
    marginal: 'Contact',
    band: true,
  },
];

export const NAV_CHAPTERS = ['origin', 'craft', 'work', 'research', 'epilogue'];
