import { FaBriefcase, FaGraduationCap } from 'react-icons/fa6';
import { SmartImage } from './smart-image';

export function OrgMark({ logo, dark = false, kind = 'work' }: { logo: string | null; dark?: boolean; kind?: 'work' | 'school' }) {
  const Icon = kind === 'school' ? FaGraduationCap : FaBriefcase;
  return (
    <div className={'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line p-1.5 ' + (dark ? 'bg-bg' : 'bg-bg-2')}>
      {logo ? (
        <SmartImage src={logo} alt="" wrapClassName="h-full w-full rounded" className="h-full w-full object-contain" />
      ) : (
        <Icon size={17} className="text-muted opacity-60" aria-hidden="true" />
      )}
    </div>
  );
}
