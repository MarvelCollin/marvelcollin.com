import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import { createSkill, updateSkill, deleteSkill } from '../../../lib/api/skills';
import type { SkillInput } from '../../../lib/api/skills';
import type { SkillForm } from '../../../types/forms';
import { useToast } from '../lib/toast-context';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const emptySkill: SkillForm = { name: '', opinion: '' };

export function SkillsSection() {
  const { skills, refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<SkillForm>(emptySkill);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof SkillForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(emptySkill); setEditId(null); setErr(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const input: SkillInput = { name: form.name.trim(), opinion: form.opinion.trim() };
      if (editId) await updateSkill(editId, input);
      else await createSkill(input);
      await refresh();
      toast(editId ? 'Skill updated' : 'Skill created');
      reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    setBusy(true); setErr('');
    try {
      await deleteSkill(id);
      await refresh();
      toast('Skill deleted');
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
        <h3>{editId ? 'Edit skill' : 'New skill'}</h3>
        <TextField label="Name" value={form.name} onChange={set('name')} />
        <AreaField label="Opinion" value={form.opinion} onChange={set('opinion')} />
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="adm-btn" onClick={reset} disabled={busy}>Cancel</button>}
        </div>
      </form>
      <div className="adm-list">
        <h3>Skills ({skills.length})</h3>
        {skills.map((s) => (
          <div className="adm-item" key={s.id}>
            <div>
              <div className="t">{s.name}</div>
              <div className="s">{s.opinion}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={() => { setForm({ name: s.name, opinion: s.opinion }); setEditId(s.id); setErr(''); }}>Edit</button>
              <button className="danger" onClick={() => remove(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
