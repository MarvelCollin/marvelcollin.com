import { memo } from 'react';

export const Clip = memo(function Clip({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 56" fill="none" aria-hidden="true">
      <path
        d="M6 3 C6 1 18 1 18 3 L18 22 C20 25 20 28 18 31 L18 52 C18 55 6 55 6 52 L6 31 C4 28 4 25 6 22 Z"
        fill="url(#clipWood)"
        stroke="#9c7838"
        strokeWidth="0.6"
      />
      <path d="M12 4 L12 52" stroke="#9c7838" strokeWidth="0.7" opacity="0.4" />
      <circle cx="12" cy="26" r="4.2" stroke="url(#clipSpring)" strokeWidth="1.7" fill="none" />
    </svg>
  );
});
