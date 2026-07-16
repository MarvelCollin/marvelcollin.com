import type { Project } from '../../../types';

const project: Project = {
  slug: 'misvord',
  num: '02',
  name: 'MisVord',
  year: '2024',
  role: 'Full-stack',
  stack: 'PHP · JavaScript · Socket.IO · Docker',
  client: 'Academic',
  tag: 'academic',
  desc: 'a Discord clone with a custom PHP framework',
  brief: 'Discord clone built on a self-made Laravel-like PHP framework.',
  body: [
    'MisVord is a Discord clone built entirely on a custom PHP framework with its own migration system, ORM, error handling, logging, and routing. No Laravel, no Symfony -- everything from scratch.',
    'Features include real-time chat via Socket.IO, video calls through VideoSDK, a bot system, and full server/channel management. Architecture follows REST API with MVC and repository pattern.',
    'End-to-end tested with Playwright. Containerized with Docker. 3 stars on GitHub.',
  ],
  result: '3 stars, full feature parity',
  tone: 'slate',
  stills: ['Server view', 'Chat interface', 'Video call'],
  cover: 'https://github.com/user-attachments/assets/85e56410-3534-4792-9be0-1b0d37e76a22',
  images: [
    'https://github.com/user-attachments/assets/e3e708e3-9989-4c22-b649-8f9ffe9d1ede',
    'https://github.com/user-attachments/assets/05409f1a-24bf-4221-bb90-41f9540764e0',
    'https://github.com/user-attachments/assets/ae90d84e-4b1f-4fba-b90d-6a877382ca4d',
  ],
  github: 'https://github.com/MarvelCollin/MisVord',
};

export default project;
