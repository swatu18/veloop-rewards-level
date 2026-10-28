import { useEffect, useRef, useState } from 'react';
import LevelRewardCard from '../LevelRewardCard/LevelRewardCard';
import LevelInfo from '../LevelInfo/LevelInfo';
import RewardChips from '../shared/RewardChips';
import { fmt, pad2 } from '../../utils/format';
import styles from './LevelRoadmap.module.css';

function stateOf(level, current) {
  if (level < current) return 'done';
  if (level === current) return 'current';
  if (level === current + 1) return 'next';
  return 'locked';
}

export default function LevelRoadmap({ levels, currentLevel }) {
  const [selected, setSelected] = useState(currentLevel);
  const trackRef = useRef(null);

  useEffect(() => setSelected(currentLevel), [currentLevel]);

  // Centre the current level in the horizontal (tablet/desktop) layout.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth) return;
    const el = track.querySelector(`[data-level="${currentLevel}"]`);
    if (el) track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2, behavior: 'smooth' });
  }, [currentLevel]);

  const info = levels.find((l) => l.level === selected) ?? levels[0];
  const infoState = stateOf(info.level, currentLevel);

  return (
    <section className={`vl-card ${styles.section}`} id="roadmap" aria-labelledby="road-title">
      <div className={styles.head}>
        <div>
          <h2 id="road-title" className={styles.title}>
            Level roadmap
            <LevelInfo label="About the level roadmap">
              Rewards shown for each level use the current reward configuration and may change.
            </LevelInfo>
          </h2>
          <p className={styles.sub}>Tap a level to see what it takes and what you receive.</p>
        </div>
      </div>

      <ol className={styles.track} ref={trackRef}>
        {levels.map((l) => (
          <li key={l.level} className={styles.item}>
            <LevelRewardCard level={l} state={stateOf(l.level, currentLevel)} selected={selected === l.level} onSelect={setSelected} />
          </li>
        ))}
      </ol>

      <div className={styles.detail} aria-live="polite">
        <strong>Level {pad2(info.level)}: {info.name}</strong>
        <span>{info.startXP === 0 ? 'Starting level' : `Starts at ${fmt(info.startXP)} XP`}</span>
        <span className={styles.status}>
          {infoState === 'done' && 'Completed'}
          {infoState === 'current' && 'You are here'}
          {infoState === 'next' && 'Your next goal'}
          {infoState === 'locked' && 'Locked'}
        </span>
        {info.reward && <RewardChips reward={info.reward} />}
      </div>
    </section>
  );
}
