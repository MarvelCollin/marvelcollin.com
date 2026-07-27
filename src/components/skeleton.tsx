import type { CSSProperties } from 'react';

export function Skel({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <span className={'skel-block ' + className} style={style} aria-hidden="true" />;
}

export function EntrySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-12" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="flex items-center gap-4">
            <Skel className="h-11 w-11 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skel className="h-[18px] w-[min(320px,60%)] rounded" />
              <Skel className="h-[13px] w-[min(220px,40%)] rounded" />
            </div>
          </div>
          <div className="mt-3 space-y-2 pl-[60px] max-[900px]:pl-0">
            <Skel className="h-[13px] w-full max-w-[52ch] rounded" />
            <Skel className="h-[13px] w-[70%] max-w-[38ch] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ aspect }: { aspect: string }) {
  return (
    <div className="bg-[#e9e3d6] p-[14px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)]" aria-hidden="true">
      <div className={'relative overflow-hidden bg-bg-2 ' + aspect}>
        <Skel className="absolute inset-0 rounded-none" />
      </div>
      <div className="flex flex-col items-center gap-2 px-1 pt-3">
        <Skel className="h-[14px] w-[70%] rounded" />
        <Skel className="h-[10px] w-[50%] rounded" />
      </div>
    </div>
  );
}
