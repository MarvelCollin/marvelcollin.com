import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import { recognition as api } from '../../../lib/api/recognition';
import type { RecognitionInput } from '../../../lib/api/recognition';
import type { AwardForm } from '../../../types/forms';
import { useToast } from '../lib/toast-context';
import { TextField } from '../fields/text-field';
import { ImageDrop } from '../uploads/image-drop';

const emptyAward: AwardForm = { yr: '', name: '', where: '', image: '' };

export function RecognitionSection() {
  const { recognition, refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<AwardForm>(emptyAward);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof AwardForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm(emptyAward); setEditId(null); setErr(''); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const input: RecognitionInput = { yr: form.yr.trim(), name: form.name.trim(), where: form.where.trim(), image: form.image.trim() || undefined };
      if (editId) await api.update(editId, input);
      else await api.create(input);
      await refresh();
      toast(editId ? 'Recognition updated' : 'Recognition created');
      reset();
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this recognition?')) return;
    setBusy(true); setErr('');
    try {
      await api.remove(id);
      await refresh();
      toast('Recognition deleted');
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
        <h3>{editId ? 'Edit recognition' : 'New recognition'}</h3>
        <TextField label="Year" value={form.yr} onChange={set('yr')} />
        <TextField label="Name" value={form.name} onChange={set('name')} />
        <TextField label="Where" value={form.where} onChange={set('where')} />
        <ImageDrop label="Photo" value={form.image} onChange={set('image')} />
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="adm-btn" onClick={reset} disabled={busy}>Cancel</button>}
        </div>
      </form>
      <div className="adm-list">
        <h3>Recognition ({recognition.length})</h3>
        {recognition.map((a) => (
          <div className="adm-item" key={a.id}>
            <div>
              <div className="t">{a.name}</div>
              <div className="s">{a.yr} · {a.where}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={() => { setForm({ yr: a.yr, name: a.name, where: a.where, image: a.image ?? '' }); setEditId(a.id); setErr(''); }}>Edit</button>
              <button className="danger" onClick={() => remove(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
