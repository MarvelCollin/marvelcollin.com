import { useContent } from '../../../content/use-content';
import { skills as api } from '../../../lib/api/skills';
import type { SkillForm } from '../../../types/forms';
import { trimmed, useEditor } from '../lib/use-editor';
import { Editor } from '../editor';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const EMPTY: SkillForm = { name: '', opinion: '' };

export function SkillsSection() {
  const { skills } = useContent();
  const editor = useEditor({ noun: 'Skill', empty: EMPTY, api, toInput: trimmed<SkillForm> });
  const { form, set, edit } = editor;

  const rows = skills.map((s) => ({
    id: s.id,
    title: s.name,
    sub: s.opinion,
    onEdit: () => edit(s.id, { name: s.name, opinion: s.opinion }),
  }));

  return (
    <Editor editor={editor} heading="Skills" rows={rows}>
      <TextField label="Name" value={form.name} onChange={set('name')} />
      <AreaField label="Opinion" value={form.opinion} onChange={set('opinion')} />
    </Editor>
  );
}
