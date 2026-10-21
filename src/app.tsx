import { Analytics } from '@vercel/analytics/react';
import { ContentError } from './components/ui/content-error';
import { Story } from './pages/story';

function App() {
  return (
    <>
      <Story />
      <ContentError />
      <Analytics />
    </>
  );
}

export default App;
