export function navigate(path: string): void {
  if (path === location.pathname + location.search) return;
  history.pushState({}, '', path);
  window.dispatchEvent(new Event('locationchange'));
}

export function initNavInterception(): void {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');
    if (!href || target === '_blank') return;
    if (!href.startsWith('/') || href.startsWith('//')) return;
    e.preventDefault();
    navigate(href);
  });
}
