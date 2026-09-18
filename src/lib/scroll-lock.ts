let holders = 0;
let restore = '';

export function lockScroll(): () => void {
  if (holders === 0) {
    restore = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  holders += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) document.body.style.overflow = restore;
  };
}
