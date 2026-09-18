import { useState } from 'react';
import type { ChangeEvent, ClipboardEvent, DragEvent } from 'react';
import { uploadImage } from '../../../lib/storage';
import { useModal } from '../../../hooks/use-modal';
import { useDismiss } from '../../../hooks/use-dismiss';

function filesFromClipboard(e: ClipboardEvent<HTMLDivElement>): File[] {
  return Array.from(e.clipboardData.items)
    .filter((i) => i.type.startsWith('image/'))
    .map((i) => i.getAsFile())
    .filter((f): f is File => f !== null);
}

export function UploadModal({ title, multiple, onClose, onAdd }: { title: string; multiple: boolean; onClose: () => void; onAdd: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const leave = () => { if (!busy) onClose(); };
  const boxRef = useModal<HTMLDivElement>(leave);
  const dismiss = useDismiss<HTMLDivElement>(leave, '.modal');

  const upload = async (files: File[]) => {
    setBusy(true); setErr('');
    try {
      for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        const url = await uploadImage(f);
        onAdd(url);
        if (!multiple) { onClose(); return; }
      }
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const files = filesFromClipboard(e);
    if (files.length) { e.preventDefault(); upload(files); }
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) upload(Array.from(e.dataTransfer.files));
  };
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) upload(Array.from(e.target.files));
  };

  return (
    <div className="modal-overlay" {...dismiss}>
      <div
        className="modal"
        ref={boxRef}
        tabIndex={-1}
        onPaste={onPaste}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="modal-head">
          <h3>{title}{busy && <em> uploading…</em>}</h3>
          <button type="button" className="modal-x" onClick={leave} disabled={busy} aria-label="Close">×</button>
        </div>
        <label className="modal-drop">
          <span>{busy ? 'Uploading…' : 'Paste a screenshot with Ctrl+V, drop a file here, or click to browse'}</span>
          <input type="file" accept="image/*" multiple={multiple} onChange={onFile} />
        </label>
        {err && <p className="adm-err">{err}</p>}
        {multiple && <p className="modal-hint">Add as many as you like, then close.</p>}
      </div>
    </div>
  );
}
