import { useEffect, useState } from 'react';
import styles from './XPProgress.module.css';

/** Gold progress bar that fills from 0 on mount. */
export default function XPProgress({ percent, label = 'XP progress to next level', thin = false }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.max(0, Math.min(100, percent))), 150);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <div
      className={`${styles.track} ${thin ? styles.thin : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <div className={styles.fill} style={{ width: `${width}%` }}>
        <span className={styles.shine} />
      </div>
    </div>
  );
}
