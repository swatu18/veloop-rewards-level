import { ChevronRight } from 'lucide-react';
import { FEATURE_ICONS } from '../../utils/icons';
import styles from './EarnMoreXP.module.css';

export default function EarnMoreXP({ features, onAction }) {
  return (
    <section className={`vl-card ${styles.section}`} id="earn" aria-labelledby="earn-title">
      <div>
        <h2 id="earn-title" className={styles.title}>Earn More XP &amp; Rewards</h2>
        <p className={styles.sub}>Explore activities and reach your next level faster.</p>
      </div>
      <ul className={styles.grid}>
        {features.map((f) => {
          const Icon = FEATURE_ICONS[f.icon];
          const soon = f.status === 'soon';
          return (
            <li key={f.id}>
              <button type="button" className={`${styles.card} ${soon ? styles.soon : ''}`} onClick={() => onAction(f)} aria-disabled={soon}>
                <span className={`${styles.icon} ${styles[f.tone]}`}><Icon size={24} aria-hidden="true" /></span>
                <span className={styles.text}>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                  <em className={styles.reward}>{f.reward}</em>
                </span>
                {soon ? <span className={styles.badge}>Coming soon</span> : <ChevronRight size={20} className={styles.chev} aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
