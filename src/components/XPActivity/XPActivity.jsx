import { useState } from 'react';
import { Coins, Filter, Star } from 'lucide-react';
import { FEATURE_ICONS } from '../../utils/icons';
import { fmt } from '../../utils/format';
import styles from './XPActivity.module.css';

export default function XPActivity({ items, todayXP, todayVE, onStartEarning }) {
  const [filter, setFilter] = useState('all');
  const shown = items.filter((a) => (filter === 'xp' ? a.xp > 0 : filter === 've' ? a.ve > 0 : true));

  return (
    <section className={`vl-card ${styles.section}`} aria-labelledby="act-title">
      <div className={styles.head}>
        <h2 id="act-title" className={styles.title}>Recent Activity</h2>
        <label className={styles.filter}>
          <Filter size={16} aria-hidden="true" />
          <span className="vl-sr">Filter activity</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="xp">XP only</option>
            <option value="ve">VEs only</option>
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <Star size={30} aria-hidden="true" />
          <h3>Your XP journey starts here</h3>
          <p>Complete an activity or play XP Catcher and your XP will show up in this list.</p>
          <button type="button" className="vl-btn-gold" onClick={onStartEarning}>Start Earning XP</button>
        </div>
      ) : (
        <ul className={styles.list}>
          {shown.length === 0 && <li className={styles.none}>Nothing matches this filter yet.</li>}
          {shown.map((a) => {
            const Icon = FEATURE_ICONS[a.icon] ?? Star;
            return (
              <li key={a.id} className={styles.row}>
                <span className={styles.ico}><Icon size={20} aria-hidden="true" /></span>
                <span className={styles.txt}>
                  <strong>{[a.xp > 0 && `+${a.xp} XP`, a.ve > 0 && `+${a.ve} VEs`, a.gems > 0 && `+${a.gems} Gems`].filter(Boolean).join(' · ')}</strong>
                  <span>{a.title}</span>
                  <small>{a.time}</small>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.summary}>
        <p>Today's Summary</p>
        <div>
          <span><Star size={16} aria-hidden="true" /> <strong>{fmt(todayXP)} XP</strong> earned</span>
          <span><Coins size={16} aria-hidden="true" /> <strong>{fmt(todayVE)} VEs</strong> earned</span>
        </div>
      </div>
    </section>
  );
}
