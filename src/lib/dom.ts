let reach = -1;

function measure() {
  reach = document.documentElement.scrollHeight - window.innerHeight;
}

function track() {
  measure();
  new ResizeObserver(measure).observe(document.documentElement);
  window.addEventListener('resize', measure);
}

export function scrollRatio(): number {
  if (reach < 0) track();
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
