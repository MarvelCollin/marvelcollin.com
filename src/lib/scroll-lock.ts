let holders = 0;

// Blocks wheel and touch scrolling outside the open dialog. Hiding overflow on
// the page would drop the scrollbar and re-lay out everything on open and close.
function canScroll(target: EventTarget | null, dialog: Element): boolean {
  for (let el = target instanceof Element ? target : null; el && dialog.contains(el); el = el.parentElement) {
    if (el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) return true;
  }
  return false;
}

function guard(e: Event) {
  const dialogs = document.querySelectorAll('[aria-modal="true"]');
  const top = dialogs[dialogs.length - 1];
  if (top && canScroll(e.target, top)) return;
  if (e.cancelable) e.preventDefault();
}

const OPTIONS = { capture: true, passive: false };

export function isScrollLocked(): boolean {
  return holders > 0;
}

export function lockScroll(): () => void {
  if (holders === 0) {
    window.addEventListener('wheel', guard, OPTIONS);
    window.addEventListener('touchmove', guard, OPTIONS);
  }
  holders += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) {
      window.removeEventListener('wheel', guard, OPTIONS);
      window.removeEventListener('touchmove', guard, OPTIONS);
    }
  };
}
