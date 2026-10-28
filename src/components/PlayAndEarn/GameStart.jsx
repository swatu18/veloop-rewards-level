import { Clock, Gamepad2, ListChecks, Target, UserCheck, Zap } from 'lucide-react';
import styles from './Game.module.css';

export default function GameStart({ config, best, attemptsLeft, onStart }) {
  const { points } = config;
  const rules = [
    { icon: Gamepad2, t: 'How to play', d: 'Drag or touch to move the basket. On a keyboard, use the left and right arrow keys.' },
    { icon: Target, t: 'Objective', d: `Catch XP orbs (+${points.xp}), coins (+${points.coin}) and gems (+${points.gem}) before time runs out.` },
    { icon: Clock, t: 'Time limit', d: `${config.durationSec} seconds per run.` },
    { icon: Zap, t: 'Bonus', d: `Catch ${config.streakForMultiplier} in a row for ${config.multiplier}X points until you miss.` },
    { icon: ListChecks, t: 'How often', d: `${config.dailyAttempts} runs per day (demo limit).` },
    { icon: UserCheck, t: 'Eligibility', d: 'Open to every member. Rewards apply when a run ends.' },
  ];
  const tiers = [...config.rewardTiers].sort((a, b) => a.min - b.min);
  return (
    <div className={styles.start}>
      <div className={styles.preview} aria-hidden="true">
        <span className={`${styles.orb} ${styles.o1}`}>XP</span>
        <span className={`${styles.coin} ${styles.o2}`}>V</span>
        <span className={`${styles.gem} ${styles.o3}`} />
        <span className={`${styles.orb} ${styles.o4}`}>XP</span>
        <span className={styles.basketArt} />
      </div>
      <div className={styles.startBody}>
        <h3 className={styles.gameName}>{config.name}</h3>
        <p className={styles.lead}>Catch orbs and coins. Score high for better rewards.</p>
        <ul className={styles.rules}>
          {rules.map(({ icon: Icon, t, d }) => (
            <li key={t}><Icon size={18} aria-hidden="true" /><span><strong>{t}</strong>{d}</span></li>
          ))}
        </ul>
        <table className={styles.tiers}>
          <caption>Reward by score (demo values)</caption>
          <thead><tr><th scope="col">Score</th><th scope="col">XP</th><th scope="col">VEs</th></tr></thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.min}><td>{t.min}+</td><td>+{t.xp}</td><td>{t.ve ? `+${t.ve}` : '-'}</td></tr>
            ))}
          </tbody>
        </table>
        <div className={styles.startFoot}>
          <span className={styles.meta}>Best score: <strong>{best}</strong> · Runs left today: <strong>{attemptsLeft}</strong></span>
          <button type="button" className="vl-btn-gold" onClick={onStart} disabled={attemptsLeft <= 0}>
            {attemptsLeft > 0 ? 'Start game' : 'Come back tomorrow'}
          </button>
        </div>
      </div>
    </div>
  );
}
