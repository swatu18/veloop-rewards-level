import { useCallback, useState } from 'react';
import { Magnet } from 'lucide-react';
import GameStart from './GameStart';
import GamePlay from './GamePlay';
import GameResult from './GameResult';
import LevelInfo from '../LevelInfo/LevelInfo';
import { getReward } from '../../utils/game';
import styles from './Game.module.css';

/**
 * Prototype state machine: start -> playing -> result -> (replay).
 * Reward crediting is LOCAL ONLY. Backend reward logic plugs into `onReward`.
 */
export default function GameContainer({ config, gameAvailable, progress, onReward, onBackToTop }) {
  const [phase, setPhase] = useState('start');
  const [used, setUsed] = useState(0);
  const [best, setBest] = useState(config.demoBest);
  const [result, setResult] = useState(null);
  const left = config.dailyAttempts - used;

  const start = () => {
    if (left <= 0) return;
    setUsed((u) => u + 1);
    setPhase('playing');
  };

  const finish = useCallback((stats) => {
    const reward = getReward(stats.score, config);
    setResult({ ...stats, reward, isBest: stats.score > best });
    if (stats.score > best) setBest(stats.score);
    setPhase('result');
    onReward({ xp: reward.xp, ve: reward.ve, title: 'XP Catcher Reward', icon: 'catcher' });
  }, [best, config, onReward]);

  return (
    <section className={`vl-card ${styles.section}`} id="play" aria-labelledby="play-title">
      <div className={styles.head}>
        <h2 id="play-title" className={styles.title}>
          <Magnet size={20} aria-hidden="true" /> Play &amp; Earn
          <LevelInfo label="About Play & Earn">
            A short skill challenge. Your score decides the XP you earn. Prototype values shown here are for
            development and are not official reward rules.
          </LevelInfo>
        </h2>
        {config.isDemo && <span className={styles.demo}>Prototype · demo values</span>}
      </div>

      {!gameAvailable && (
        <div className={styles.unavail}>
          <Magnet size={32} aria-hidden="true" />
          <h3>New challenge coming soon</h3>
          <p>The game is taking a short break. Check back later, or earn XP with the activities below.</p>
        </div>
      )}
      {gameAvailable && phase === 'start' && <GameStart config={config} best={best} attemptsLeft={left} onStart={start} />}
      {gameAvailable && phase === 'playing' && <GamePlay config={config} onFinish={finish} />}
      {gameAvailable && phase === 'result' && result && (
        <GameResult result={result} progress={progress} attemptsLeft={left} onAgain={start} onBack={onBackToTop} />
      )}
    </section>
  );
}
