import { Lock } from 'lucide-react';
import RewardChips from '../shared/RewardChips';
import XPProgress from '../XPProgress/XPProgress';
import LevelInfo from '../LevelInfo/LevelInfo';
import { fmt, pad2 } from '../../utils/format';
import styles from './NextLevelReward.module.css';

function Chest() {
  return (
    <svg viewBox="0 0 160 140" className={styles.chest} aria-hidden="true">
      <defs>
        <linearGradient id="nlr-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8dc8a" /><stop offset="0.6" stopColor="#e9b949" /><stop offset="1" stopColor="#a87a22" />
        </linearGradient>
        <linearGradient id="nlr-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3560" /><stop offset="1" stopColor="#1d1a38" />
        </linearGradient>
        <radialGradient id="nlr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e9b949" stopOpacity="0.45" /><stop offset="1" stopColor="#e9b949" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className={styles.glow} cx="80" cy="70" rx="78" ry="60" fill="url(#nlr-glow)" />
      <ellipse cx="80" cy="128" rx="56" ry="7" fill="rgba(0,0,0,.35)" />
      <polygon className={styles.gem1} points="52,52 60,40 70,52 60,64" fill="#8d73f2" />
      <polygon className={styles.gem2} points="98,50 106,40 116,50 106,62" fill="#4cc38a" />
      <rect x="26" y="60" width="108" height="62" rx="9" fill="url(#nlr-wood)" stroke="url(#nlr-gold)" strokeWidth="3" />
      <rect x="44" y="60" width="9" height="62" fill="url(#nlr-gold)" opacity="0.9" />
      <rect x="107" y="60" width="9" height="62" fill="url(#nlr-gold)" opacity="0.9" />
      <g className={styles.lid}>
        <path d="M26 62 Q26 26 80 26 Q134 26 134 62 Z" fill="url(#nlr-wood)" stroke="url(#nlr-gold)" strokeWidth="3" />
        <rect x="44" y="30" width="9" height="32" fill="url(#nlr-gold)" opacity="0.9" />
        <rect x="107" y="30" width="9" height="32" fill="url(#nlr-gold)" opacity="0.9" />
      </g>
      <rect x="67" y="54" width="26" height="30" rx="6" fill="url(#nlr-gold)" />
      <circle cx="80" cy="66" r="4.5" fill="#2a1d05" />
      <rect x="78" y="68" width="4" height="9" rx="2" fill="#2a1d05" />
    </svg>
  );
}

export default function NextLevelReward({ progress: p, onViewRoadmap }) {
  if (p.isMax) {
    return (
      <section className={`vl-card ${styles.card}`} aria-label="Next level reward">
        <p className={styles.title}>Top level reached</p>
        <p className={styles.muted}>There are no further levels right now. New rewards will appear here when they are added.</p>
      </section>
    );
  }
  return (
    <section className={`vl-card ${styles.card}`} aria-labelledby="nlr-title">
      <div className={styles.head}>
        <h2 id="nlr-title" className={styles.title}>Level {pad2(p.nextLevel)} Rewards</h2>
        <LevelInfo label="About the next level reward" align="right">
          The displayed reward is associated with the next level according to the current reward configuration.
        </LevelInfo>
      </div>
      <p className={styles.muted}>Next level reward</p>
      <div className={styles.stage} tabIndex={0} aria-label={`Locked reward chest for Level ${pad2(p.nextLevel)}`}>
        <Chest />
        <span className={styles.lock}><Lock size={14} /> Locked</span>
      </div>
      <RewardChips reward={p.nextReward} large />
      <p className={styles.unlock}>Reach Level {pad2(p.nextLevel)} to unlock</p>
      <XPProgress percent={p.percent} thin label="Progress to unlock the next level reward" />
      <p className={styles.foot}>{fmt(p.xpToNext)} XP remaining</p>
      <button type="button" className="vl-btn-gold" onClick={onViewRoadmap}>View Rewards</button>
    </section>
  );
}
