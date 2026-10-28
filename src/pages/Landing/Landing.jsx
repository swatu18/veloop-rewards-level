import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Magnet, Trophy, Wallet } from 'lucide-react';
import { FaCoins, FaGem } from 'react-icons/fa';
import Logo from '../../components/shared/Logo';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import XPProgress from '../../components/XPProgress/XPProgress';
import { useAuth } from '../../context/AuthContext';
import { LEVELS } from '../../data/levelData';
import styles from './Landing.module.css';

const STEPS = [
  { t: 'Do activities and play', d: 'Complete daily missions, watch and earn, or beat the 20-second XP Catcher challenge.' },
  { t: 'Earn XP and level up', d: 'Every activity adds XP. Fill your bar to reach the next level and unlock its reward.' },
  { t: 'Redeem your rewards', d: 'Spend the VEs and Gems you collect in the Rewards store, and track them in your Wallet.' },
];
const FEATURES = [
  { icon: Trophy, t: 'Level roadmap', d: 'See where you are, what comes next and what each level gives you.' },
  { icon: Magnet, t: 'Play & Earn', d: 'A short skill game that turns your score into XP. No luck, no betting.' },
  { icon: Gift, t: 'Rewards store', d: 'Vouchers, boosts and badges you can redeem with VEs and Gems.' },
  { icon: Wallet, t: 'Clear wallet', d: 'Every VE, Gem and XP you earn or spend is listed in one place.' },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className={styles.page}>
      <header className={`container-xxl ${styles.nav}`}>
        <Logo />
        <div className={styles.navLinks}>
          <Link to="/Lvl-Dashboard" className={styles.guest}>View demo</Link>
          {user ? (
            <Link to="/Lvl-Dashboard" className={`vl-btn-gold ${styles.cta}`}>Open dashboard</Link>
          ) : (
            <>
              <Link to="/signin" className={styles.signin}>Sign in</Link>
              <Link to="/signup" className={`vl-btn-gold ${styles.cta}`}>Sign up</Link>
            </>
          )}
        </div>
      </header>

      <section className={`container-xxl ${styles.hero}`}>
        <div className={styles.copy}>
          <span className="vl-pill">Welcome to VELOOP Rewards</span>
          <h1>Earn XP. Level up. Unlock real rewards.</h1>
          <p>Complete simple activities, play a quick game and watch your level grow. Every step brings you closer to your next reward.</p>
          <div className={styles.actions}>
            <Link to="/signup" className="vl-btn-gold">Create free account <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link to="/signin" className="vl-btn-ghost">I already have an account</Link>
          </div>
          <p className={styles.note}>New members start with a 150 XP welcome bonus. Prototype build: reward values are demo values.</p>
        </div>

        <div className={styles.showcase} aria-hidden="true">
          <div className={styles.glow} />
          <div className={`vl-card ${styles.card}`}>
            <div className={styles.cardTop}>
              <LevelBadge level={5} size="lg" />
              <div>
                <p className={styles.small}>Current XP</p>
                <p className={styles.big}><span className="vl-gold-text">6,420</span> XP</p>
                <p className={styles.small}>1,580 XP to Level 06</p>
              </div>
            </div>
            <XPProgress percent={44} />
            <div className={styles.rewardRow}>
              <span><FaCoins /> 750 VEs</span>
              <span className={styles.gem}><FaGem /> 30 Gems</span>
              <span className={styles.lock}>Level 06 reward</span>
            </div>
          </div>
          <span className={`${styles.float} ${styles.f1}`}><FaCoins /></span>
          <span className={`${styles.float} ${styles.f2} ${styles.gem}`}><FaGem /></span>
        </div>
      </section>

      <section className={`container-xxl ${styles.section}`} aria-labelledby="how">
        <h2 id="how">How it works</h2>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.t} className={`vl-card ${styles.step}`}>
              <span className={styles.num}>{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container-xxl ${styles.section}`} aria-labelledby="levels">
        <h2 id="levels">A clear path from Level 1 upward</h2>
        <div className={`vl-card ${styles.path}`}>
          {LEVELS.slice(0, 6).map((l, i) => (
            <div key={l.level} className={styles.pathItem}>
              <LevelBadge level={l.level} size="sm" state={i === 0 ? 'current' : 'locked'} />
              <span>{l.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`container-xxl ${styles.section}`} aria-labelledby="features">
        <h2 id="features">Everything in one place</h2>
        <ul className={styles.features}>
          {FEATURES.map(({ icon: Icon, t, d }) => (
            <li key={t} className="vl-card">
              <span className={styles.ficon}><Icon size={22} aria-hidden="true" /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container-xxl ${styles.final}`}>
        <div className={`vl-card ${styles.finalCard}`}>
          <h2>Ready to start your first level?</h2>
          <p>Create an account in under a minute, or look around first.</p>
          <div className={styles.actions}>
            <Link to="/signup" className="vl-btn-gold">Sign up free</Link>
            <Link to="/Lvl-Dashboard" className="vl-btn-ghost">Explore the demo</Link>
          </div>
        </div>
      </section>

      <footer className={`container-xxl ${styles.footer}`}>
        <Logo small />
        <p>VELOOP Rewards prototype. All XP, VE, Gem and reward values are demo values until the official rules are approved.</p>
      </footer>
    </div>
  );
}
