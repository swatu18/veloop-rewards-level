import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import styles from './LevelInfo.module.css';

/** [i] button with an accessible popover. Opens on click, hover and keyboard focus. */
export default function LevelInfo({ label = 'More information', children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const tipId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      className={styles.wrap}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.btn}
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Info size={15} />
      </button>
      {open && (
        <span role="tooltip" id={tipId} className={`${styles.tip} ${align === 'right' ? styles.right : styles.left}`}>
          {children}
        </span>
      )}
    </span>
  );
}
