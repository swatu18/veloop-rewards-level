import { ClipboardList, Flame, Sparkles, Star } from 'lucide-react';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgress from '../XPProgress/XPProgress';
import LevelInfo from '../LevelInfo/LevelInfo';
import { fmt, pad2 } from '../../utils/format';
import styles from './LevelHero.module.css';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

function recommendation(p, maxGameXP) {
  if (p.isMax) return 'You have reached the top level. Keep earning to unlock new opportunities.';
  if (p.xpToNext <= maxGameXP) {
    return `You're only ${fmt(p.xpToNext)} XP away from Level ${pad2(p.nextLevel)}. One XP Catcher run could get you there.`;
  }
  return `Play XP Catcher for up to +${maxGameXP} XP, or finish a daily mission, to close the ${fmt(p.xpToNext)} XP gap.`;
}

export default function LevelHero({ name, player, progress: p, todayXP, maxGameXP, onPlay }) {
  const boost = [
    { icon: Star, label: 'XP Earned', value: `${fmt(todayXP)} XP`, tone: 'purple' },
    { icon: ClipboardList, label: 'Tasks Done', value: `${player.tasksDone}/${player.tasksTotal}`, tone: 'green' },
    { icon: Flame, label: 'Streak', value: `${player.streak} Days`, tone: 'orange' },
  ];
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <header className={styles.top}>
        <div className={styles.greet}>
          <h1 id="hero-title">{greeting()}, {name}! <span aria-hidden="true">👋</span></h1>
          <p>Keep earning XP, unlock new levels, and discover better rewards along the way.</p>
        </div>
      </header>

      <div className={`vl-card ${styles.levelCard}`}>
        <div className={styles.badgeCol}>
          <LevelBadge level={p.level} size="xl" />
          <p className={styles.levelName}>{p.name}</p>
        </div>
        <div className={styles.xpCol}>
          <p className={styles.kicker}>
            Current XP
            <LevelInfo label="About levels and XP">
              XP helps you progress through VELOOP Rewards levels. As you reach new levels, you may unlock
              additional rewards and experiences according to the platform's level system.
            </LevelInfo>
          </p>
          <p className={styles.xpValue}><span className="vl-gold-text">{fmt(p.xp)}</span> XP</p>
          <p className={styles.toNext}>
            {p.isMax ? 'Top level reached' : <><strong>{fmt(p.xpToNext)} XP</strong> to Level {pad2(p.nextLevel)}</>}
          </p>
        </div>
        <div className={styles.progressCol}>
          <div className={styles.labels}>
            <span>Level {pad2(p.level)}</span>
            {!p.isMax && <span>Level {pad2(p.nextLevel)}</span>}
          </div>
          <XPProgress percent={p.percent} />
          <div className={styles.labels}>
            <span>{p.isMax ? `${fmt(p.xp)} XP` : `${fmt(p.xp)} / ${fmt(p.nextXP)} XP`}</span>
            <span>{Math.round(p.percent)}% of Level {pad2(p.level)}</span>
          </div>
        </div>
        <div className={styles.reco}>
          <Sparkles size={18} aria-hidden="true" />
          <p>{recommendation(p, maxGameXP)}</p>
          <button type="button" className="vl-btn-ghost" onClick={onPlay}>Play now</button>
        </div>
      </div>

      <div className={`vl-card ${styles.boost}`}>
        <h2 className={styles.boostTitle}>Today's Boost</h2>
        <ul className={styles.tiles}>
          {boost.map(({ icon: Icon, label, value, tone }) => (
            <li key={label} className={styles.tile}>
              <span className={`${styles.tileIcon} ${styles[tone]}`}><Icon size={20} /></span>
              <span className={styles.tileLabel}>{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
