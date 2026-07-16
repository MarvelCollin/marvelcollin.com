import type { IconType } from 'react-icons';
import {
  SiTypescript, SiReact, SiGo, SiDotnet, SiPhp, SiPython,
  SiCplusplus, SiRabbitmq, SiThreedotjs, SiArduino,
} from 'react-icons/si';
import { TbCube3dSphere } from 'react-icons/tb';

const SKILLS: [string, IconType, string][] = [
  ['typescript', SiTypescript, '#3178c6'],
  ['react', SiReact, '#61dafb'],
  ['go', SiGo, '#00add8'],
  ['.net', SiDotnet, '#512bd4'],
  ['php', SiPhp, '#777bb4'],
  ['python', SiPython, '#3776ab'],
  ['c++', SiCplusplus, '#00599c'],
  ['rabbitmq', SiRabbitmq, '#ff6600'],
  ['microservices', SiRabbitmq, '#ff6600'],
  ['three.js', SiThreedotjs, '#049ef4'],
  ['arduino', SiArduino, '#00878f'],
  ['robotics', SiArduino, '#00878f'],
  ['3d printing', TbCube3dSphere, '#ff6b35'],
];

export function skillIcon(name: string): { Icon: IconType; color: string } | null {
  const lower = name.toLowerCase();
  for (const [key, Icon, color] of SKILLS) {
    if (lower.includes(key)) return { Icon, color };
  }
  return null;
}

const ORGS: Record<string, string> = {
  binus: 'https://www.google.com/s2/favicons?domain=binus.ac.id&sz=128',
  immanuel: 'https://www.google.com/s2/favicons?domain=ski.sch.id&sz=128',
};

export function orgLogo(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(ORGS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}
