import type { ReactNode } from 'react';
import type { Editor as EditorState } from './lib/use-editor';

export interface EditorRow {
  id: string;
  title: ReactNode;
  sub: ReactNode;
  onEdit: () => void;
}

export function Editor<F>({
  editor,
  heading,
  rows,
  children,
}: {
  editor: EditorState<F>;
  heading: string;
  rows: EditorRow[];
  children: ReactNode;
}) {
  const { noun, editId, busy, err, save, remove, reset } = editor;
  const label = noun.toLowerCase();

  return (
    <div className="adm-grid">
      <form className="adm-form" onSubmit={save}>
        <h3>{editId ? `Edit ${label}` : `New ${label}`}</h3>
        {children}
        {err && <p className="adm-err">{err}</p>}
        <div className="adm-actions">
          <button type="submit" className="adm-btn primary" disabled={busy}>
            {busy ? 'Saving…' : editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button type="button" className="adm-btn" onClick={reset} disabled={busy}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="adm-list">
        <h3>
          {heading} ({rows.length})
        </h3>
        {rows.map((r) => (
          <div className="adm-item" key={r.id}>
            <div>
              <div className="t">{r.title}</div>
              <div className="s">{r.sub}</div>
            </div>
            <div className="adm-item-actions">
              <button onClick={r.onEdit}>Edit</button>
              <button className="danger" onClick={() => remove(r.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
