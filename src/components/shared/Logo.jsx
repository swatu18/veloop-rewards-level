import styles from './Logo.module.css';

export default function Logo({ small = false }) {
  return (
    <span className={`${styles.logo} ${small ? styles.small : ''}`}>
      <svg viewBox="0 0 100 112" className={styles.mark} aria-hidden="true">
        <polygon points="50,3 95,28 95,84 50,109 5,84 5,28" fill="#e9b949" />
        <polygon points="50,14 85,34 85,78 50,98 15,78 15,34" fill="#161827" />
        <path d="M30 42 L50 80 L70 42" stroke="#f8dc8a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className={styles.word}>VELOOP<em>Rewards</em></span>
    </span>
  );
}
