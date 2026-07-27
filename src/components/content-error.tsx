import { useState } from 'react';
import { useContent } from '../content/use-content';

export function ContentError() {
  const { error, refresh } = useContent();
  const [retrying, setRetrying] = useState(false);

  if (!error && !retrying) return null;

  const retry = async () => {
    setRetrying(true);
    await refresh();
    setRetrying(false);
  };

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-[120] flex w-[min(560px,92vw)] -translate-x-1/2 items-center gap-4 rounded-xl border border-line bg-bg-2 px-5 py-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)] max-[560px]:flex-col max-[560px]:items-stretch"
    >
      <div className="flex-1 text-[13px] leading-[1.5] text-fg-dim">
        <span className="block text-[14px] text-fg">{retrying ? 'Reloading content…' : 'Content failed to load.'}</span>
        {error}
      </div>
      <button
        type="button"
        onClick={retry}
        disabled={retrying}
        className="shrink-0 cursor-pointer rounded-lg border border-fg px-4 py-2 text-[13px] text-fg transition-colors hover:bg-fg hover:text-bg disabled:cursor-default disabled:opacity-50"
      >
        {retrying ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  );
}
