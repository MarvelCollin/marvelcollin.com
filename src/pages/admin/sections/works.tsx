import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import { TONE_NAMES } from '../../../content/tones';
import { createWork, updateWork, deleteWork } from '../../../lib/api/works';
import type { WorkInput } from '../../../lib/api/works';
import type { Project } from '../../../types/content';
import type { WorkForm } from '../../../types/forms';
import { lines, unlines } from '../lib/utils';
import { useToast } from '../lib/toast-context';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';
import { SelectField } from '../fields/select-field';
import { ImageDrop } from '../uploads/image-drop';
import { MultiImageDrop } from '../uploads/multi-image-drop';

const emptyWork: WorkForm = {
  slug: '', num: '', name: '', year: '', role: '', stack: '', client: '', tag: 'freelance',
  desc: '', brief: '', body: '', result: '', tone: 'warm', stills: '', cover: '', images: '',
  repo: '',
};

function workToForm(p: Project): WorkForm {
  return {
    slug: p.slug, num: p.num, name: p.name, year: p.year, role: p.role, stack: p.stack,
    client: p.client, tag: p.tag, desc: p.desc, brief: p.brief, body: unlines(p.body),
    result: p.result, tone: p.tone, stills: unlines(p.stills), cover: p.cover ?? '',
    images: unlines(p.images ?? []), repo: p.repo ?? '',
  };
}

function formToWork(f: WorkForm): WorkInput {
  return {
    slug: f.slug.trim(), num: f.num.trim(), name: f.name.trim(), year: f.year.trim(),
    role: f.role.trim(), stack: f.stack.trim(), client: f.client.trim(), tag: f.tag,
    desc: f.desc.trim(), brief: f.brief.trim(), body: lines(f.body), result: f.result.trim(),
    tone: f.tone, stills: lines(f.stills), cover: f.cover.trim() || undefined,
    images: lines(f.images), repo: f.repo.trim() || undefined,
  };
}

export function WorksSection() {
  const { works, refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<WorkForm>(emptyWork);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof WorkForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => { setForm(emptyWork); setEditId(null); setErr(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const input = formToWork(form);
      if (editId) await updateWork(editId, input);
      else await createWork(input);
      await refresh();
      toast(editId ? 'Project updated' : 'Project created');
      reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setBusy(true); setErr('');
    try {
      await deleteWork(id);
      await refresh();
      toast('Project deleted');
      if (editId === id) reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-grid">
      <form className="adm-form" onSubmit={save}>
        <h3>{editId ? 'Edit work' : 'New work'}</h3>
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
          <SelectField label="Tag" value={form.tag} onChange={set('tag')} options={['freelance', 'product', 'personal']} />
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
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="adm-btn" onClick={reset} disabled={busy}>Cancel</button>}
        </div>
      </form>
      <div className="adm-list">
        <h3>Works ({works.length})</h3>
        {works.map((p) => (
          <div className="adm-item" key={p.id}>
            <div>
              <div className="t">{p.num} · {p.name}</div>
              <div className="s">{p.tag} · {p.year}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={() => { setForm(workToForm(p)); setEditId(p.id); setErr(''); }}>Edit</button>
              <button className="danger" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
