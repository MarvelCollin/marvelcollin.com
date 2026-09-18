import { useDrafting } from './use-drafting';

const pad = (n: number) => String(n).padStart(2, '0');

export function Backdrop({ numeral, label, sheet, total }: { numeral: string; label: string; sheet: number; total: number }) {
  const refs = useDrafting();

  return (
    <div className="drafting" aria-hidden="true">
      <div ref={refs.terrain} className="drafting-terrain">
        <canvas ref={refs.base} />
        <div ref={refs.lamp} className="drafting-lamp">
          <canvas ref={refs.lit} />
        </div>
      </div>
      <span ref={refs.numeral} key={numeral} className="drafting-numeral">
        {numeral}
      </span>
      <div className="drafting-vignette" />
      <div className="sheet-marks" />
      <div className="sheet-block">
        <span>
          sheet {pad(sheet)} / {pad(total)}
        </span>
        <span className="sheet-rule" />
        <span className="sheet-now">{label}</span>
      </div>
    </div>
  );
}
