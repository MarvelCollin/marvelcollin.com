import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContent } from '../../../content/use-content';
import type { Table } from '../../../lib/api/table';
import { useToast } from './toast-context';

interface Options<F, I> {
  noun: string;
  empty: F;
  api: Table<unknown, I>;
  toInput: (form: F) => I;
}

export interface Editor<F> {
  noun: string;
  form: F;
  set: (k: keyof F) => (v: string) => void;
  editId: string | null;
  busy: boolean;
  err: string;
  save: (e: FormEvent) => Promise<void>;
  remove: (id: string) => Promise<void>;
  edit: (id: string, next: F) => void;
  reset: () => void;
}

const message = (x: unknown, fallback: string) => (x instanceof Error ? x.message : fallback);

export function trimmed<F extends object>(form: F): F {
  return Object.fromEntries(Object.entries(form).map(([k, v]) => [k, String(v).trim()])) as F;
}

export function useEditor<F extends object, I>({ noun, empty, api, toInput }: Options<F, I>): Editor<F> {
  const { refresh } = useContent();
  const toast = useToast();
  const [form, setForm] = useState<F>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof F) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(empty);
    setEditId(null);
    setErr('');
  };

  const edit = (id: string, next: F) => {
    setForm(next);
    setEditId(id);
    setErr('');
  };

  const run = async (task: () => Promise<void>, done: string, fallback: string) => {
    setBusy(true);
    setErr('');
    try {
      await task();
      await refresh();
      toast(`${noun} ${done}`);
      return true;
    } catch (x) {
      setErr(message(x, fallback));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const input = toInput(form);
    const ok = await run(
      () => (editId ? api.update(editId, input) : api.create(input)),
      editId ? 'updated' : 'created',
      'Save failed',
    );
    if (ok) reset();
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete this ${noun.toLowerCase()}?`)) return;
    const ok = await run(() => api.remove(id), 'deleted', 'Delete failed');
    if (ok && editId === id) reset();
  };

  return { noun, form, set, editId, busy, err, save, remove, edit, reset };
}
