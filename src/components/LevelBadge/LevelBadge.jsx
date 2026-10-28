import { useId } from 'react';
import { Check, Lock } from 'lucide-react';
import { pad2 } from '../../utils/format';
import styles from './LevelBadge.module.css';

/*
 * Drop official badge images into src/assets/badges/ named level-1.png,
 * level-2.png ... (png, webp, jpg or svg). When one exists for a level it is
 * used automatically; otherwise the built-in gold hexagon badge is drawn.
 */
const images = import.meta.glob('../../assets/badges/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const badgeByLevel = Object.entries(images).reduce((acc, [path, url]) => {
  const m = path.match(/level-?0*(\d+)/i);
  if (m) acc[Number(m[1])] = url;
  return acc;
}, {});

/** state: current | done | next | locked    size: sm | md | lg | xl */
export default function LevelBadge({ level, size = 'md', state = 'current' }) {
  const id = useId().replace(/:/g, '');
  const src = badgeByLevel[level];
  return (
    <div
      className={`${styles.badge} ${styles[size]} ${styles[state]}`}
      role="img"
      aria-label={`Level ${level}${state === 'locked' ? ', locked' : ''}`}
    >
      {src ? (
        <img src={src} alt="" className={styles.img} />
      ) : (
        <svg viewBox="0 0 100 112" className={styles.svg} aria-hidden="true">
          <defs>
            <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f8dc8a" />
              <stop offset="0.55" stopColor="#e9b949" />
              <stop offset="1" stopColor="#a87a22" />
            </linearGradient>
            <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#262a45" />
              <stop offset="1" stopColor="#12142a" />
            </linearGradient>
          </defs>
          <polygon points="50,3 95,28 95,84 50,109 5,84 5,28" fill={`url(#g${id})`} />
          <polygon points="50,12 87,33 87,79 50,100 13,79 13,33" fill={`url(#f${id})`} />
          <text x="50" y="41" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="2" fill="#f8dc8a" fontFamily="DM Sans, sans-serif">LEVEL</text>
          <text x="50" y="77" textAnchor="middle" fontSize="38" fontWeight="800" fill="#fff" fontFamily="Sora, sans-serif">{pad2(level)}</text>
        </svg>
      )}
      {state === 'locked' && <span className={styles.mark}><Lock size={12} /></span>}
      {state === 'done' && <span className={`${styles.mark} ${styles.ok}`}><Check size={12} strokeWidth={3} /></span>}
    </div>
  );
}
