import { FaCoins, FaGem } from 'react-icons/fa';
import { fmt } from '../../utils/format';
import styles from './RewardChips.module.css';

export default function RewardChips({ reward, large = false, muted = false }) {
  if (!reward) return null;
  return (
    <div className={`${styles.wrap} ${large ? styles.large : ''} ${muted ? styles.muted : ''}`}>
      {reward.ve > 0 && (
        <span className={`${styles.chip} ${styles.ve}`}>
          <FaCoins aria-hidden="true" /> {fmt(reward.ve)} VEs
        </span>
      )}
      {reward.gems > 0 && (
        <span className={`${styles.chip} ${styles.gem}`}>
          <FaGem aria-hidden="true" /> {fmt(reward.gems)} Gems
        </span>
      )}
    </div>
  );
}
