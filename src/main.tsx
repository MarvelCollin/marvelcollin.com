import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { ContentProvider } from './content/provider';
import { initNavInterception } from './lib/nav';
import { legacyAnchor } from './lib/work-link';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const anchor = legacyAnchor(location.pathname);
if (anchor) history.replaceState(null, '', '/' + anchor);
else if (location.pathname !== '/' && location.pathname !== '/admin') history.replaceState(null, '', '/' + location.hash);

initNavInterception();

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>,
);
