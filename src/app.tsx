import { useState, useEffect, lazy, Suspense } from 'react';
import { useRoute } from './hooks/use-route';
import { parseRoute } from './utils/parse-route';
import { runTransition } from './utils/page-transition';
import { Home } from './pages/home';
import { Work } from './pages/work';
import { ProjectDetail } from './pages/project-detail';
import { About } from './pages/about';
import { Contact } from './pages/contact';
import { Research } from './pages/research';

const Admin = lazy(() => import('./pages/admin').then((m) => ({ default: m.Admin })));

function App() {
  const route = useRoute();
  const [renderRoute, setRenderRoute] = useState(route);

  useEffect(() => {
    const parsed = parseRoute(route);
    document.querySelectorAll('[data-route]').forEach(a => {
      const r = a.getAttribute('data-route');
      const isActive =
        (r === '/work' && (parsed.kind === 'work' || parsed.kind === 'project')) ||
        (r === '/about' && parsed.kind === 'about') ||
        (r === '/contact' && parsed.kind === 'contact') ||
        (r === '/research' && parsed.kind === 'research') ||
        (r === '/' && parsed.kind === 'home');
      a.classList.toggle('active', isActive);
    });
  }, [route]);

  useEffect(() => {
    if (route === renderRoute) return;
    runTransition().then(() => {
      setRenderRoute(route);
      window.scrollTo(0, 0);
    });
  }, [route, renderRoute]);

  const parsed = parseRoute(renderRoute);
  if (parsed.kind === 'project') return <ProjectDetail slug={parsed.slug} />;
  if (parsed.kind === 'work') return <Work />;
  if (parsed.kind === 'about') return <About />;
  if (parsed.kind === 'contact') return <Contact />;
  if (parsed.kind === 'research') return <Research />;
  if (parsed.kind === 'admin') return <Suspense fallback={<section className="page admin"><p className="note">…</p></section>}><Admin /></Suspense>;
  return <Home />;
}

export default App;
