import { useContent } from '../../../content/use-content';
import { education as api } from '../../../lib/api/education';
import type { EduForm } from '../../../types/forms';
import { trimmed, useEditor } from '../lib/use-editor';
import { Editor } from '../editor';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const EMPTY: EduForm = { yr: '', degree: '', school: '', note: '' };

export function EducationSection() {
  const { education } = useContent();
  const editor = useEditor({ noun: 'Education', empty: EMPTY, api, toInput: trimmed<EduForm> });
  const { form, set, edit } = editor;

  const rows = education.map((e) => ({
    id: e.id,
    title: (
      <>
        {e.degree} <span className="s">{e.school}</span>
      </>
    ),
    sub: e.yr,
    onEdit: () => edit(e.id, { yr: e.yr, degree: e.degree, school: e.school, note: e.note }),
  }));

  return (
    <Editor editor={editor} heading="Education" rows={rows}>
      <TextField label="Period" value={form.yr} onChange={set('yr')} />
      <TextField label="Degree" value={form.degree} onChange={set('degree')} />
      <TextField label="School" value={form.school} onChange={set('school')} />
      <AreaField label="Note" value={form.note} onChange={set('note')} />
    </Editor>
  );
}
