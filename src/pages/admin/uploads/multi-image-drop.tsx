import { useRef, useState } from 'react';
import { UploadModal } from './upload-modal';
import { SmartImage } from '../../../components/smart-image';

export function MultiImageDrop({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const add = (url: string) => onChange([...valueRef.current, url]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  return (
    <div className="fld">
      <span>{label}</span>
      {value.length > 0 && (
        <div className="img-grid">
          {value.map((url, i) => (
            <div className="img-cell" key={i}>
              <SmartImage fill src={url} alt="" eager className="object-contain" />
              <button type="button" onClick={() => remove(i)}>×</button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="img-add" onClick={() => setOpen(true)}>+ Add images</button>
      {open && <UploadModal title={label} multiple onClose={() => setOpen(false)} onAdd={add} />}
    </div>
  );
}
