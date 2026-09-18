import { useContent } from '../../../content/use-content';
import { experience as api } from '../../../lib/api/experience';
import type { ExpForm } from '../../../types/forms';
import { trimmed, useEditor } from '../lib/use-editor';
import { Editor } from '../editor';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const EMPTY: ExpForm = { yr: '', role: '', where: '', note: '' };

export function ExperienceSection() {
  const { experience } = useContent();
  const editor = useEditor({ noun: 'Experience', empty: EMPTY, api, toInput: trimmed<ExpForm> });
  const { form, set, edit } = editor;

  const rows = experience.map((j) => ({
    id: j.id,
    title: (
      <>
        {j.role} <span className="s">at {j.where}</span>
      </>
    ),
    sub: j.yr,
    onEdit: () => edit(j.id, { yr: j.yr, role: j.role, where: j.where, note: j.note }),
  }));

  return (
    <Editor editor={editor} heading="Experience" rows={rows}>
      <TextField label="Year" value={form.yr} onChange={set('yr')} />
      <TextField label="Role" value={form.role} onChange={set('role')} />
      <TextField label="Where" value={form.where} onChange={set('where')} />
      <AreaField label="Note" value={form.note} onChange={set('note')} />
    </Editor>
  );
}
