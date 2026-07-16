import type { IconType } from 'react-icons';
import {
  SiTypescript, SiReact, SiGo, SiDotnet, SiPhp, SiPython,
  SiCplusplus, SiRabbitmq, SiThreedotjs, SiArduino,
} from 'react-icons/si';
import { TbCube3dSphere } from 'react-icons/tb';

const SKILLS: [string, IconType][] = [
  ['typescript', SiTypescript],
  ['react', SiReact],
  ['go', SiGo],
  ['.net', SiDotnet],
  ['php', SiPhp],
  ['python', SiPython],
  ['c++', SiCplusplus],
  ['rabbitmq', SiRabbitmq],
  ['microservices', SiRabbitmq],
  ['three.js', SiThreedotjs],
  ['arduino', SiArduino],
  ['robotics', SiArduino],
  ['3d printing', TbCube3dSphere],
];

export function skillIcon(name: string): IconType | null {
  const lower = name.toLowerCase();
  for (const [key, icon] of SKILLS) {
    if (lower.includes(key)) return icon;
  }
  return null;
}

const ORGS: Record<string, string> = {
  binus: 'https://www.google.com/s2/favicons?domain=binus.ac.id&sz=128',
};

export function orgLogo(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(ORGS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}
