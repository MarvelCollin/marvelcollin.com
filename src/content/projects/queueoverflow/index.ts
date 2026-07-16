import type { Project } from '../../../types';

const project: Project = {
  slug: 'queueoverflow',
  num: '04',
  name: 'QueueOverflow',
  year: '2024',
  role: 'Solo developer',
  stack: 'Tauri · Rust · React · SeaORM · Postgres',
  client: 'Personal',
  tag: 'personal',
  desc: 'a StackOverflow clone built with Tauri and Rust',
  brief: 'Q&A platform as a native desktop app via Tauri.',
  body: [
    'QueueOverflow is a StackOverflow-style Q&A platform built as a native desktop app using Tauri. The backend runs in Rust with SeaORM for database access and PostgreSQL for storage.',
    'The frontend is React with TypeScript. The Rust layer handles all API logic, auth, and database operations. Docker support for the Postgres instance.',
    '3 stars on GitHub.',
  ],
  result: '3 stars',
  tone: 'vermillion',
  stills: ['Question view', 'Answer thread'],
  cover: 'https://github.com/user-attachments/assets/53922d6e-0b97-4f7f-8917-3215e059bcdd',
  images: [
    'https://github.com/user-attachments/assets/53922d6e-0b97-4f7f-8917-3215e059bcdd',
    'https://github.com/user-attachments/assets/73b20b6e-d949-43e4-bd63-2d4424117e09',
  ],
  github: 'https://github.com/MarvelCollin/QueueOverflow',
};

export default project;
