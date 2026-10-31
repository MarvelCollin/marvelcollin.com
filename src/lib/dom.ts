let reach = -1;
let top = 0;

function measure() {
  reach = document.documentElement.scrollHeight - window.innerHeight;
}

// scrollY is read in the scroll event, where layout is still clean. Reading it
// inside a frame after other code wrote styles forces a full layout.
function track() {
  measure();
  top = window.scrollY;
  new ResizeObserver(measure).observe(document.documentElement);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', () => (top = window.scrollY), { passive: true });
}

export function scrollRatio(): number {
  if (reach < 0) track();
  return reach <= 0 ? 0 : Math.min(1, Math.max(0, top / reach));
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
