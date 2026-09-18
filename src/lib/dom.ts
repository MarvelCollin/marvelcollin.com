export function scrollRatio(): number {
  const reach = document.documentElement.scrollHeight - window.innerHeight;
  return reach <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / reach));
}

export function onFrame(task: () => void) {
  let frame = 0;
  const run = () => {
    frame = 0;
    task();
  };
  return {
    schedule: () => {
      if (!frame) frame = requestAnimationFrame(run);
    },
    cancel: () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export function listen(target: EventTarget, type: string, fn: EventListener, options?: AddEventListenerOptions) {
  target.addEventListener(type, fn, options);
  return () => target.removeEventListener(type, fn);
}
