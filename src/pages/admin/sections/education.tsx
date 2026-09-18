import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import { createEducation, updateEducation, deleteEducation } from '../../../lib/api/education';
import type { EducationInput } from '../../../lib/api/education';
import type { EduForm } from '../../../types/forms';
import { useToast } from '../lib/toast-context';
import { TextField } from '../fields/text-field';
import { AreaField } from '../fields/area-field';

const emptyEdu: EduForm = { yr: '', degree: '', school: '', note: '' };

export function EducationSection() {
  const { education, refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<EduForm>(emptyEdu);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof EduForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(emptyEdu); setEditId(null); setErr(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const input: EducationInput = { yr: form.yr.trim(), degree: form.degree.trim(), school: form.school.trim(), note: form.note.trim() };
      if (editId) await updateEducation(editId, input);
      else await createEducation(input);
      await refresh();
      toast(editId ? 'Education updated' : 'Education created');
      reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    setBusy(true); setErr('');
    try {
      await deleteEducation(id);
      await refresh();
      toast('Education deleted');
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
        <h3>{editId ? 'Edit education' : 'New education'}</h3>
        <TextField label="Period" value={form.yr} onChange={set('yr')} />
        <TextField label="Degree" value={form.degree} onChange={set('degree')} />
        <TextField label="School" value={form.school} onChange={set('school')} />
        <AreaField label="Note" value={form.note} onChange={set('note')} />
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="adm-btn" onClick={reset} disabled={busy}>Cancel</button>}
        </div>
      </form>
      <div className="adm-list">
        <h3>Education ({education.length})</h3>
        {education.map((e) => (
          <div className="adm-item" key={e.id}>
            <div>
              <div className="t">{e.degree} <span className="s">{e.school}</span></div>
              <div className="s">{e.yr}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={() => { setForm({ yr: e.yr, degree: e.degree, school: e.school, note: e.note }); setEditId(e.id); setErr(''); }}>Edit</button>
              <button className="danger" onClick={() => remove(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
