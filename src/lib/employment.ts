export type Employment = 'Full-time' | 'Part-time' | 'Internship' | 'Freelance' | 'Contract';

const KINDS: [RegExp, Employment][] = [
  [/^full[\s-]?time$/i, 'Full-time'],
  [/^part[\s-]?time$/i, 'Part-time'],
  [/^intern(ship)?$/i, 'Internship'],
  [/^freelance$/i, 'Freelance'],
  [/^contract$/i, 'Contract'],
];

export function employment(role: string): { title: string; kind: Employment | null } {
  const parts = role.split(' · ');
  const last = parts[parts.length - 1].trim();
  const kind = KINDS.find(([re]) => re.test(last))?.[1] ?? null;
  return { title: kind ? parts.slice(0, -1).join(' · ') : role, kind };
}
