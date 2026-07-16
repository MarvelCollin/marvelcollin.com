import type { Project } from '../../../types';

const project: Project = {
  slug: 'constellation',
  num: '03',
  name: 'Constellation',
  year: '2024',
  role: 'Developer',
  stack: 'Electron · TypeScript · Python · llama.cpp',
  client: 'Personal',
  tag: 'personal',
  desc: 'a desktop app to host and train AI models with friends',
  brief: 'Collaborative AI model hosting and training via Electron.',
  body: [
    'Constellation is an Electron desktop app that lets you host or train AI models collaboratively. It wraps llama.cpp for local inference and uses zrok for tunneling so friends can connect to your hosted model.',
    'Built with electron-vite for the frontend, Python for the ML backend, and automatic hardware scanning to configure model parameters. Supports model downloading and chat interfaces.',
    'Designed for people who want to run LLMs locally without touching the command line.',
  ],
  result: 'Working desktop app',
  tone: 'navy',
  stills: ['Chat interface', 'Model config', 'Hardware scan'],
  github: 'https://github.com/MarvelCollin/Constellation',
};

export default project;
