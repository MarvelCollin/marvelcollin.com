import { useContent } from '../../../content/use-content';
import { recognition as api } from '../../../lib/api/recognition';
import type { AwardForm } from '../../../types/forms';
import { trimmed, useEditor } from '../lib/use-editor';
import { Editor } from '../editor';
import { TextField } from '../fields/text-field';
import { ImageDrop } from '../uploads/image-drop';

const EMPTY: AwardForm = { yr: '', name: '', where: '', image: '' };

function toInput(form: AwardForm) {
  const f = trimmed(form);
  return { ...f, image: f.image || undefined };
}

export function RecognitionSection() {
  const { recognition } = useContent();
  const editor = useEditor({ noun: 'Recognition', empty: EMPTY, api, toInput });
  const { form, set, edit } = editor;

  const rows = recognition.map((a) => ({
    id: a.id,
    title: a.name,
    sub: `${a.yr} · ${a.where}`,
    onEdit: () => edit(a.id, { yr: a.yr, name: a.name, where: a.where, image: a.image ?? '' }),
  }));

  return (
    <Editor editor={editor} heading="Recognition" rows={rows}>
      <TextField label="Year" value={form.yr} onChange={set('yr')} />
      <TextField label="Name" value={form.name} onChange={set('name')} />
      <TextField label="Where" value={form.where} onChange={set('where')} />
      <ImageDrop label="Photo" value={form.image} onChange={set('image')} />
    </Editor>
  );
}
