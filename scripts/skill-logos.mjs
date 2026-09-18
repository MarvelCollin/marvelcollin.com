import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { icons as logos } from '@iconify-json/logos';
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils';
import * as simple from 'simple-icons';

const require = createRequire(import.meta.url);
const OUT = 'src/assets/skills';

const SOURCES = {
  typescript: ['logos', 'typescript-icon'],
  javascript: ['logos', 'javascript'],
  react: ['logos', 'react'],
  angular: ['logos', 'angular-icon'],
  svelte: ['logos', 'svelte-icon'],
  vue: ['logos', 'vue'],
  node: ['logos', 'nodejs-icon'],
  tailwind: ['logos', 'tailwindcss-icon'],
  dotnet: ['logos', 'dotnet'],
  csharp: ['logos', 'c-sharp'],
  php: ['logos', 'php'],
  laravel: ['logos', 'laravel'],
  python: ['logos', 'python'],
  java: ['logos', 'java'],
  kotlin: ['logos', 'kotlin-icon'],
  swift: ['logos', 'swift'],
  flutter: ['logos', 'flutter'],
  cplusplus: ['logos', 'c-plusplus'],
  c: ['logos', 'c'],
  go: ['logos', 'go'],
  r: ['logos', 'r-lang'],
  ruby: ['logos', 'ruby'],
  rust: ['logos', 'rust'],
  rabbitmq: ['logos', 'rabbitmq-icon'],
  threejs: ['logos', 'threejs'],
  unity: ['logos', 'unity'],
  arduino: ['logos', 'arduino'],
  tensorflow: ['logos', 'tensorflow'],
  mongodb: ['logos', 'mongodb-icon'],
  sqlite: ['logos', 'sqlite'],
  redis: ['logos', 'redis'],
  firebase: ['logos', 'firebase'],
  supabase: ['logos', 'supabase-icon'],
  docker: ['logos', 'docker-icon'],
  kubernetes: ['logos', 'kubernetes'],
  nginx: ['logos', 'nginx'],
  git: ['logos', 'git-icon'],
  github: ['logos', 'github-icon'],
  githubactions: ['logos', 'github-actions'],
  figma: ['logos', 'figma'],
  vercel: ['logos', 'vercel-icon'],
  postman: ['logos', 'postman-icon'],
  linux: ['logos', 'linux-tux'],
  postgresql: ['logos', 'postgresql'],
  mysql: ['logos', 'mysql-icon'],
  bash: ['logos', 'bash-icon'],
  cloudflare: ['logos', 'cloudflare-icon'],
  pytorch: ['logos', 'pytorch-icon'],
  huggingface: ['logos', 'hugging-face-icon'],
  pandas: ['logos', 'pandas-icon'],
  jupyter: ['logos', 'jupyter'],
  mcp: ['logos', 'model-context-protocol-icon'],
  tauri: ['logos', 'tauri'],
  electron: ['logos', 'electron'],
  vite: ['logos', 'vitejs'],
  socketio: ['logos', 'socket-io'],
  cypress: ['logos', 'cypress-icon'],
  android: ['logos', 'android-icon'],
  bootstrap: ['logos', 'bootstrap'],
  powershell: ['devicon', 'powershell/powershell-original.svg'],
  scikitlearn: ['devicon', 'scikitlearn/scikitlearn-original.svg'],
  labview: ['devicon', 'labview/labview-original.svg'],
  cisco: ['simple', 'siCisco'],
  shadcn: ['simple', 'siShadcnui'],
};

function fromLogos(name) {
  const data = getIconData(logos, name);
  if (!data) throw new Error(`logos:${name} missing`);
  const { attributes, body } = iconToSVG(data);
  return iconToHTML(body, { viewBox: attributes.viewBox });
}

function fromDevicon(path) {
  return readFileSync(require.resolve(`devicon/icons/${path}`), 'utf8');
}

function fromSimple(key) {
  const icon = simple[key];
  if (!icon) throw new Error(`simple-icons ${key} missing`);
  return icon.svg.replace('<svg ', `<svg fill="#${icon.hex}" `).replace(/<title>.*?<\/title>/, '');
}

const READ = { logos: fromLogos, devicon: fromDevicon, simple: fromSimple };

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const [file, [source, id]] of Object.entries(SOURCES)) {
  writeFileSync(`${OUT}/${file}.svg`, READ[source](id));
}
console.log(`wrote ${Object.keys(SOURCES).length} logos to ${OUT}`);
