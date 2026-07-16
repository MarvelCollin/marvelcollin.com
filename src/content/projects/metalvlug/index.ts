import type { Project } from '../../../types';

const project: Project = {
  slug: 'metalvlug',
  num: '06',
  name: 'MetalVlug',
  year: '2024',
  role: 'Developer',
  stack: 'JavaScript · CSS · WebSocket · Python',
  client: 'Academic',
  tag: 'academic',
  desc: 'a web game inspired by Metal Slug and Minecraft Dungeons',
  brief: 'Browser-based action game with multiplayer WebSocket support.',
  body: [
    'MetalVlug is a browser-based action game combining Metal Slug run-and-gun gameplay with Minecraft Dungeons-style dungeon crawling. Supports multiplayer through WebSocket.',
    'Built with vanilla JavaScript and CSS for rendering. The Python backend handles multiplayer synchronization and game state management.',
    'Fully playable in the browser with keyboard controls.',
  ],
  result: 'Multiplayer web game',
  tone: 'rose',
  stills: ['Gameplay', 'Dungeon level', 'Multiplayer'],
  cover: 'https://github.com/user-attachments/assets/16ac24c1-363b-4e96-acd0-b4b8ed3ef4da',
  images: [
    'https://github.com/user-attachments/assets/573238ab-c1a0-41fe-872e-ea22229bb923',
    'https://github.com/user-attachments/assets/6db18bb9-f88a-4a2f-ab22-53040ba96db4',
    'https://github.com/user-attachments/assets/d0057abb-d573-4b84-8375-aae30c281995',
  ],
  github: 'https://github.com/MarvelCollin/MetalVlug',
};

export default project;
