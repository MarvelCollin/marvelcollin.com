import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import { experience as api } from '../../../lib/api/experience';
import type { ExperienceInput } from '../../../lib/api/experience';
import type { ExpForm } from '../../../types/forms';
import { useToast } from '../lib/toast-context';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const emptyExp: ExpForm = { yr: '', role: '', where: '', note: '' };

export function ExperienceSection() {
  const { experience, refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<ExpForm>(emptyExp);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof ExpForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(emptyExp); setEditId(null); setErr(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const input: ExperienceInput = { yr: form.yr.trim(), role: form.role.trim(), where: form.where.trim(), note: form.note.trim() };
      if (editId) await api.update(editId, input);
      else await api.create(input);
      await refresh();
      toast(editId ? 'Experience updated' : 'Experience created');
      reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    setBusy(true); setErr('');
    try {
      await api.remove(id);
      await refresh();
      toast('Experience deleted');
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
        <h3>{editId ? 'Edit experience' : 'New experience'}</h3>
        <TextField label="Year" value={form.yr} onChange={set('yr')} />
        <TextField label="Role" value={form.role} onChange={set('role')} />
        <TextField label="Where" value={form.where} onChange={set('where')} />
        <AreaField label="Note" value={form.note} onChange={set('note')} />
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="adm-btn" onClick={reset} disabled={busy}>Cancel</button>}
        </div>
      </form>
      <div className="adm-list">
        <h3>Experience ({experience.length})</h3>
        {experience.map((j) => (
          <div className="adm-item" key={j.id}>
            <div>
              <div className="t">{j.role} <span className="s">at {j.where}</span></div>
              <div className="s">{j.yr}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={() => { setForm({ yr: j.yr, role: j.role, where: j.where, note: j.note }); setEditId(j.id); setErr(''); }}>Edit</button>
              <button className="danger" onClick={() => remove(j.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
