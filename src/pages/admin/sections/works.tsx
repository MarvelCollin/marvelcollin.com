import { useContent } from '../../../content/use-content';
import { TONE_NAMES } from '../../../content/tones';
import { TAG_KEYS } from '../../../content/tags';
import { works as api } from '../../../lib/api/works';
import type { WorkInput } from '../../../lib/api/works';
import type { Project } from '../../../types/content';
import type { WorkForm } from '../../../types/forms';
import { lines, unlines } from '../lib/utils';
import { trimmed, useEditor } from '../lib/use-editor';
import { Editor } from '../editor';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';
import { SelectField } from '../fields/select-field';
import { ImageDrop } from '../uploads/image-drop';
import { MultiImageDrop } from '../uploads/multi-image-drop';

const EMPTY: WorkForm = {
  slug: '', num: '', name: '', year: '', role: '', stack: '', client: '', tag: TAG_KEYS[0],
  desc: '', brief: '', body: '', result: '', tone: 'warm', stills: '', cover: '', images: '', repo: '',
};

function toForm(p: Project): WorkForm {
  return {
    ...p,
    body: unlines(p.body),
    stills: unlines(p.stills),
    cover: p.cover ?? '',
    images: unlines(p.images ?? []),
    repo: p.repo ?? '',
  };
}

function toInput(form: WorkForm): WorkInput {
  const f = trimmed(form);
  return {
    ...f,
    body: lines(f.body),
    stills: lines(f.stills),
    images: lines(f.images),
    cover: f.cover || undefined,
    repo: f.repo || undefined,
  };
}

export function WorksSection() {
  const { works } = useContent();
  const editor = useEditor({ noun: 'Project', empty: EMPTY, api, toInput });
  const { form, set, edit } = editor;

  const rows = works.map((p) => ({
    id: p.id,
    title: `${p.num} · ${p.name}`,
    sub: `${p.tag} · ${p.year}`,
    onEdit: () => edit(p.id, toForm(p)),
  }));

  return (
    <Editor editor={editor} heading="Works" rows={rows}>
      <div className="row2">
        <TextField label="Slug" value={form.slug} onChange={set('slug')} />
        <TextField label="Num" value={form.num} onChange={set('num')} />
      </div>
      <div className="row2">
        <TextField label="Name" value={form.name} onChange={set('name')} />
        <TextField label="Year" value={form.year} onChange={set('year')} />
      </div>
      <div className="row2">
        <TextField label="Role" value={form.role} onChange={set('role')} />
        <TextField label="Stack" value={form.stack} onChange={set('stack')} />
      </div>
      <div className="row2">
        <TextField label="Client" value={form.client} onChange={set('client')} />
        <SelectField label="Tag" value={form.tag} onChange={set('tag')} options={TAG_KEYS} />
      </div>
      <TextField label="Desc" value={form.desc} onChange={set('desc')} />
      <TextField label="Brief" value={form.brief} onChange={set('brief')} />
      <AreaField label="Body" hint="(one paragraph per line)" value={form.body} onChange={set('body')} rows={5} />
      <TextField label="Result" value={form.result} onChange={set('result')} />
      <SelectField label="Tone" value={form.tone} onChange={set('tone')} options={TONE_NAMES} />
      <TextField label="Repo link" value={form.repo} onChange={set('repo')} />
      <ImageDrop label="Cover" value={form.cover} onChange={set('cover')} />
      <AreaField label="Stills" hint="(one per line)" value={form.stills} onChange={set('stills')} />
      <MultiImageDrop label="Images" value={lines(form.images)} onChange={(arr) => set('images')(arr.join('\n'))} />
    </Editor>
  );
}
