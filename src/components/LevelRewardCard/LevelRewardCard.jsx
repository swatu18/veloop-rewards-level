import LevelBadge from '../LevelBadge/LevelBadge';
import RewardChips from '../shared/RewardChips';
import { pad2 } from '../../utils/format';
import styles from './LevelRewardCard.module.css';

const STATE_LABEL = { done: '✓ Completed', current: 'You are here', next: 'Next goal', locked: 'Locked' };

export default function LevelRewardCard({ level, state, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`${styles.card} ${styles[state]} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      aria-label={`Level ${level.level}, ${STATE_LABEL[state].replace('✓ ', '')}`}
      onClick={() => onSelect(level.level)}
      data-level={level.level}
    >
      <LevelBadge level={level.level} size="md" state={state} />
      <span className={styles.body}>
        <span className={styles.name}>Level {pad2(level.level)}</span>
        <span className={styles.state}>{STATE_LABEL[state]}</span>
        {level.reward ? <RewardChips reward={level.reward} muted={state === 'locked'} /> : <span className={styles.none}>Starting level</span>}
      </span>
    </button>
  );
}
