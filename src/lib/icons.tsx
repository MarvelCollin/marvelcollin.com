import type { IconType } from 'react-icons';
import {
  SiTypescript, SiReact, SiGo, SiDotnet, SiPhp, SiPython,
  SiCplusplus, SiRabbitmq, SiThreedotjs, SiArduino,
  SiC, SiJavascript, SiKotlin, SiRuby, SiRust, SiR,
  SiAngular, SiSvelte, SiVuedotjs, SiTailwindcss,
  SiSqlite, SiMongodb, SiRedis, SiFirebase, SiDocker,
  SiFigma, SiVercel, SiPostman,
  SiNodedotjs, SiNextdotjs, SiNuxtdotjs, SiExpress,
  SiLaravel, SiNestjs, SiSupabase, SiPrisma,
  SiGit, SiTensorflow, SiSwift, SiDart, SiFlutter,
  SiNginx, SiKubernetes, SiUnity,
} from 'react-icons/si';
import { TbCube3dSphere, TbBrandCSharp } from 'react-icons/tb';
import { FaJava } from 'react-icons/fa6';

const SKILLS: [string, IconType, string][] = [
  ['typescript', SiTypescript, '#3178c6'],
  ['javascript', SiJavascript, '#f7df1e'],
  ['react', SiReact, '#61dafb'],
  ['next.js', SiNextdotjs, '#a0a0a0'],
  ['nuxt', SiNuxtdotjs, '#00dc82'],
  ['vue', SiVuedotjs, '#4fc08d'],
  ['angular', SiAngular, '#dd0031'],
  ['svelte', SiSvelte, '#ff3e00'],
  ['node', SiNodedotjs, '#5fa04e'],
  ['express', SiExpress, '#a0a0a0'],
  ['nestjs', SiNestjs, '#e0234e'],
  ['tailwind', SiTailwindcss, '#06b6d4'],
  ['go', SiGo, '#00add8'],
  ['.net', SiDotnet, '#512bd4'],
  ['c#', TbBrandCSharp, '#68217a'],
  ['php', SiPhp, '#777bb4'],
  ['laravel', SiLaravel, '#ff2d20'],
  ['python', SiPython, '#3776ab'],
  ['java', FaJava, '#ed8b00'],
  ['kotlin', SiKotlin, '#7f52ff'],
  ['swift', SiSwift, '#f05138'],
  ['dart', SiDart, '#0175c2'],
  ['flutter', SiFlutter, '#02569b'],
  ['c++', SiCplusplus, '#00599c'],
  ['c language', SiC, '#a8b9cc'],
  ['ruby', SiRuby, '#cc342d'],
  ['rust', SiRust, '#dea584'],
  ['r language', SiR, '#276dc3'],
  ['rabbitmq', SiRabbitmq, '#ff6600'],
  ['microservices', SiRabbitmq, '#ff6600'],
  ['three.js', SiThreedotjs, '#049ef4'],
  ['unity', SiUnity, '#a0a0a0'],
  ['arduino', SiArduino, '#00878f'],
  ['robotics', SiArduino, '#00878f'],
  ['3d printing', TbCube3dSphere, '#ff6b35'],
  ['tensorflow', SiTensorflow, '#ff6f00'],
  ['mongodb', SiMongodb, '#47a248'],
  ['sqlite', SiSqlite, '#003b57'],
  ['redis', SiRedis, '#dc382d'],
  ['firebase', SiFirebase, '#ffca28'],
  ['supabase', SiSupabase, '#3fcf8e'],
  ['prisma', SiPrisma, '#2d3748'],
  ['docker', SiDocker, '#2496ed'],
  ['kubernetes', SiKubernetes, '#326ce5'],
  ['nginx', SiNginx, '#009639'],
  ['git', SiGit, '#f05032'],
  ['figma', SiFigma, '#f24e1e'],
  ['vercel', SiVercel, '#a0a0a0'],
  ['postman', SiPostman, '#ff6c37'],
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
