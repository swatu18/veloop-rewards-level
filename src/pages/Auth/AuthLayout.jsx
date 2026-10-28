import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Logo from '../../components/shared/Logo';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import styles from './Auth.module.css';

const PERKS = ['150 XP welcome bonus on sign up', 'Daily missions, streaks and a quick game', 'Redeem rewards from your wallet balance'];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.page}>
      <aside className={styles.brand}>
        <Link to="/" aria-label="Back to the welcome page"><Logo /></Link>
        <div className={styles.art}><LevelBadge level={1} size="xl" /></div>
        <h2>Your rewards journey starts at Level 1</h2>
        <ul>{PERKS.map((p) => <li key={p}><Check size={16} aria-hidden="true" /> {p}</li>)}</ul>
      </aside>
      <main className={styles.formSide}>
        <Link to="/" className={styles.mobileLogo} aria-label="Back to the welcome page"><Logo small /></Link>
        <div className={`vl-card ${styles.card}`}>
          <h1>{title}</h1>
          <p className={styles.sub}>{subtitle}</p>
          {children}
          <p className={styles.footer}>{footer}</p>
        </div>
        <Link to="/Lvl-Dashboard" className={`vl-link ${styles.guestLink}`}>Continue as guest to view the demo</Link>
      </main>
    </div>
  );
}
