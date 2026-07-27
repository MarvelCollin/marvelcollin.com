import { useState, useEffect, lazy, Suspense } from 'react';
import { useRoute } from './hooks/use-route';
import { parseRoute } from './utils/parse-route';
import { runTransition } from './utils/page-transition';
import { ContentError } from './components/content-error';
import { Skel } from './components/skeleton';
import { Home } from './pages/home';

const Work = lazy(() => import('./pages/work').then((m) => ({ default: m.Work })));
const ProjectDetail = lazy(() => import('./pages/project-detail').then((m) => ({ default: m.ProjectDetail })));
const About = lazy(() => import('./pages/about').then((m) => ({ default: m.About })));
const Research = lazy(() => import('./pages/research').then((m) => ({ default: m.Research })));
const Admin = lazy(() => import('./pages/admin').then((m) => ({ default: m.Admin })));

function RouteFallback() {
  return (
    <section className="mx-auto max-w-[1320px] px-10 pt-[160px] max-[900px]:px-[22px] max-[900px]:pt-[100px]">
      <Skel className="h-[60px] w-[min(420px,80%)] rounded-lg" />
      <Skel className="mt-6 h-[16px] w-[min(560px,90%)] rounded" />
    </section>
  );
}

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

  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        {parsed.kind === 'project' && <ProjectDetail slug={parsed.slug} />}
        {parsed.kind === 'work' && <Work />}
        {parsed.kind === 'about' && <About />}
        {parsed.kind === 'research' && <Research />}
        {parsed.kind === 'admin' && <Admin />}
        {parsed.kind === 'home' && <Home />}
      </Suspense>
      <ContentError />
    </>
  );
}

export default App;
