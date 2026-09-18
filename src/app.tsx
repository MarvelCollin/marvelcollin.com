import { lazy, Suspense } from 'react';
import { useRoute } from './hooks/use-route';
import { ContentError } from './components/ui/content-error';
import { Skel } from './components/ui/skeleton';
import { Story } from './pages/story';

const Admin = lazy(() => import('./pages/admin').then((m) => ({ default: m.Admin })));

function AdminFallback() {
  return (
    <section className="mx-auto max-w-[1320px] px-10 pt-[160px] max-[900px]:px-[22px] max-[900px]:pt-[100px]">
      <Skel className="h-[60px] w-[min(420px,80%)] rounded-lg" />
      <Skel className="mt-6 h-[16px] w-[min(560px,90%)] rounded" />
    </section>
  );
}

function App() {
  const route = useRoute();

  return (
    <>
      {route === '/admin' ? (
        <Suspense fallback={<AdminFallback />}>
          <Admin />
        </Suspense>
      ) : (
        <Story />
      )}
      <ContentError />
    </>
  );
}

export default App;
