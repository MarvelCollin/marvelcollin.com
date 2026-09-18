import { useState } from 'react';
import { useContent } from '../../content/use-content';
import { ToastHost } from './toast';
import { WorksSection } from './sections/works';
import { SkillsSection } from './sections/skills';
import { ExperienceSection } from './sections/experience';
import { EducationSection } from './sections/education';
import { RecognitionSection } from './sections/recognition';

type Tab = 'works' | 'skills' | 'experience' | 'education' | 'recognition';

export function Panel({ onLogout }: { onLogout: () => void }) {
  const { loading, error } = useContent();
  const [tab, setTab] = useState<Tab>('works');
  const tabs: { k: Tab; label: string }[] = [
    { k: 'works', label: 'Works' },
    { k: 'skills', label: 'Skills' },
    { k: 'experience', label: 'Experience' },
    { k: 'education', label: 'Education' },
    { k: 'recognition', label: 'Licenses & Awards' },
  ];

  return (
    <ToastHost>
      <div className="adm-head">
        <h1>Admin</h1>
        <button className="adm-btn" onClick={onLogout}>Log out</button>
      </div>
      <div className="adm-tabs">
        {tabs.map((t) => (
          <button key={t.k} className={tab === t.k ? 'on' : ''} onClick={() => setTab(t.k)}>{t.label}</button>
        ))}
      </div>
      {error && <p className="adm-err">{error}</p>}
      {loading && <p className="note">Loading…</p>}
      {tab === 'works' && <WorksSection />}
      {tab === 'skills' && <SkillsSection />}
      {tab === 'experience' && <ExperienceSection />}
      {tab === 'education' && <EducationSection />}
      {tab === 'recognition' && <RecognitionSection />}
    </ToastHost>
  );
}
