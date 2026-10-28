import { Trophy } from 'lucide-react';
import { FaCoins } from 'react-icons/fa';
import XPProgress from '../XPProgress/XPProgress';
import useCountUp from '../../hooks/useCountUp';
import { fmt, pad2 } from '../../utils/format';
import styles from './Game.module.css';

export default function GameResult({ result, progress: p, attemptsLeft, onAgain, onBack }) {
  const score = useCountUp(result.score, 900);
  const { reward } = result;
  return (
    <div className={styles.result}>
      <div className={styles.trophy} aria-hidden="true"><Trophy size={44} /></div>
      <h3 className={styles.resultTitle}>Challenge complete</h3>
      <p className={styles.scoreLabel}>Final score</p>
      <p className={styles.finalScore} aria-label={`Final score ${result.score}`}>
        <span className="vl-gold-text">{score}</span>
        {result.isBest && <span className={styles.newBest}>New best</span>}
      </p>
      <div className={styles.rewards}>
        <div className={styles.rw} style={{ animationDelay: '0.25s' }}><strong>+{reward.xp} XP</strong><span>Experience</span></div>
        <div className={styles.rw} style={{ animationDelay: '0.45s' }}>
          <strong>{reward.ve > 0 ? <><FaCoins aria-hidden="true" /> +{reward.ve} VEs</> : 'No VEs'}</strong>
          <span>Your reward</span>
        </div>
      </div>
      <p className={styles.caught}>
        Caught {result.caught.xp} orbs, {result.caught.coin} coins, {result.caught.gem} gems · Best streak {result.bestStreak}
      </p>
      {!p.isMax && (
        <div className={styles.rProgress}>
          <div className={styles.rLabels}><span>Level {pad2(p.level)}</span><span>Level {pad2(p.nextLevel)}</span></div>
          <XPProgress percent={p.percent} thin />
          <p>{fmt(p.xp)} / {fmt(p.nextXP)} XP</p>
        </div>
      )}
      <p className={styles.demoNote}>Prototype: rewards update this page only and are not credited to a real account.</p>
      <div className={styles.actions}>
        <button type="button" className="vl-btn-gold" onClick={onAgain} disabled={attemptsLeft <= 0}>
          {attemptsLeft > 0 ? `Play again (${attemptsLeft} left)` : 'No runs left today'}
        </button>
        <button type="button" className="vl-btn-ghost" onClick={onBack}>Back to dashboard</button>
      </div>
    </div>
  );
}
