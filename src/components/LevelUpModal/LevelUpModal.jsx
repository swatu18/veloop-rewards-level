import { useEffect, useRef } from 'react';
import { Gift, Target, TrendingUp } from 'lucide-react';
import { FaCoins, FaGem } from 'react-icons/fa';
import LevelBadge from '../LevelBadge/LevelBadge';
import { LEVEL_PERKS } from '../../data/levelData';
import { fmt } from '../../utils/format';
import styles from './LevelUpModal.module.css';

const PERK_ICONS = { trend: TrendingUp, target: Target, gift: Gift };

export default function LevelUpModal({ levelUp, onClaim }) {
  const btn = useRef(null);
  useEffect(() => {
    btn.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClaim(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClaim]);

  const { level, name, reward } = levelUp;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="lu-title">
      <div className={styles.panel}>
        {[...Array(8)].map((_, i) => <span key={i} className={styles.spark} style={{ '--i': i }} aria-hidden="true" />)}
        <h2 id="lu-title" className={`${styles.title} vl-gold-text`}>LEVEL UP!</h2>
        <p className={styles.sub}>You've reached</p>
        <div className={styles.badge}><LevelBadge level={level} size="xl" /></div>
        <p className={styles.name}>{name}</p>
        <div className={styles.rewards}>
          {reward.ve > 0 && <div><FaCoins size={26} aria-hidden="true" /><strong>+{fmt(reward.ve)} VEs</strong></div>}
          {reward.gems > 0 && <div className={styles.gems}><FaGem size={26} aria-hidden="true" /><strong>+{fmt(reward.gems)} Gems</strong></div>}
        </div>
        <ul className={styles.perks}>
          {LEVEL_PERKS.map(({ icon, text }) => {
            const Icon = PERK_ICONS[icon];
            return <li key={text}><Icon size={18} aria-hidden="true" /> {text}</li>;
          })}
        </ul>
        <button ref={btn} type="button" className="vl-btn-gold" onClick={onClaim}>Claim Rewards</button>
      </div>
    </div>
  );
}
