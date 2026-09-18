import { memo } from 'react';

export const ClipDefs = memo(function ClipDefs() {
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
      <defs>
        <linearGradient id="clipWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bf9759" />
          <stop offset="0.4" stopColor="#edd49d" />
          <stop offset="0.62" stopColor="#dfbf83" />
          <stop offset="1" stopColor="#ad8447" />
        </linearGradient>
        <linearGradient id="clipSpring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d2d6db" />
          <stop offset="1" stopColor="#7a8088" />
        </linearGradient>
      </defs>
    </svg>
  );
});
