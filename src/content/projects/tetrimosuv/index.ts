import type { Project } from '../../../types';

const project: Project = {
  slug: 'tetrimosuv',
  num: '01',
  name: 'tetriMosuV',
  year: '2024',
  role: 'Solo developer',
  stack: 'React · Three.js · TypeScript',
  client: 'Personal',
  tag: 'personal',
  desc: '3D Tetris combined with osu! rhythm mechanics',
  brief: 'A browser-based 3D Tetris game with rhythm game mechanics.',
  body: [
    'tetriMosuV combines 3D Tetris gameplay with osu!-style rhythm mechanics in the browser. Built with React and Three.js, the entire game runs client-side with no backend.',
    'The 3D rendering is handled by Three.js with custom shaders for the block effects. The rhythm detection system syncs block drops to audio beats. Runs on Vite with Tailwind for the UI layer.',
    'Playable live at marvelcollin.github.io/tetriMosuV. 7 stars on GitHub.',
  ],
  result: '7 stars, playable demo',
  tone: 'warm',
  stills: ['3D gameplay', 'Block effects', 'Game UI'],
  cover: 'https://github.com/user-attachments/assets/68355758-e442-480d-acc1-f72d04bdc3ee',
  images: [
    'https://github.com/user-attachments/assets/61c5e853-f1d3-4231-a518-c9d3bf479efd',
    'https://github.com/user-attachments/assets/c83564db-7885-42bb-a521-5dce2da00689',
    'https://github.com/user-attachments/assets/ed07396b-8c20-4b7c-aacd-d031429f3de7',
  ],
  github: 'https://github.com/MarvelCollin/tetriMosuV',
  link: 'https://marvelcollin.github.io/tetriMosuV/',
};

export default project;
