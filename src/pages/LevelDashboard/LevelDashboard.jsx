import { useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { EARN_FEATURES, GAME_CONFIG, LEVELS } from '../../data/levelData';
import { scrollToId } from '../../utils/format';
import LevelHero from '../../components/LevelHero/LevelHero';
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward';
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap';
import GameContainer from '../../components/PlayAndEarn/GameContainer';
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP';
import XPActivity from '../../components/XPActivity/XPActivity';
import ErrorState from '../../components/States/ErrorState';
import DashboardSkeleton from '../../components/States/DashboardSkeleton';
import styles from './LevelDashboard.module.css';

const MAX_GAME_XP = Math.max(...GAME_CONFIG.rewardTiers.map((t) => t.xp));

/**
 * Preview UI states with a query string:
 *   ?state=loading | error | empty | nogame      ?demo=1 shows the demo bar
 */
export default function LevelDashboard() {
  const lp = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const { hash, search } = useLocation();
  const demo = new URLSearchParams(search).get('demo') === '1';

  // open the dashboard at #play or #roadmap when linked from another page
  useEffect(() => {
    if (lp.status === 'ready' && hash) setTimeout(() => scrollToId(hash.slice(1)), 150);
  }, [lp.status, hash]);

  const onFeature = useCallback((f) => {
    if (f.status === 'soon') return toast(`${f.title} is coming soon.`);
    if (f.action === 'game') return scrollToId('play');
    const focus = { watch: 'watch', daily: 'daily', refer: 'refer', streak: 'streak' }[f.id];
    return navigate(`/earn?focus=${focus ?? f.id}`);
  }, [navigate, toast]);

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const playNow = () => scrollToId('play');

  if (lp.status === 'loading') return <DashboardSkeleton />;
  if (lp.status === 'error') return <ErrorState onRetry={lp.retry} />;

  return (
    <>
      {!lp.user && (
        <div className={styles.guestBar} role="note">
          <span>You're viewing demo data. Sign in to save your own progress.</span>
          <Link to="/signin" className="vl-link">Sign in</Link>
          <Link to="/signup" className={`vl-btn-gold ${styles.guestBtn}`}>Sign up</Link>
        </div>
      )}
      <div className={styles.grid}>
        <div className={styles.hero}>
          <LevelHero name={lp.displayName} player={lp.player} progress={lp.progress} todayXP={lp.todayXP} maxGameXP={MAX_GAME_XP} onPlay={playNow} />
        </div>
        <div className={styles.reward}>
          <NextLevelReward progress={lp.progress} onViewRoadmap={() => scrollToId('roadmap')} />
        </div>
        <div className={styles.road}>
          <LevelRoadmap levels={LEVELS} currentLevel={lp.progress.level} />
        </div>
        <div className={styles.game}>
          <GameContainer config={GAME_CONFIG} gameAvailable={lp.gameAvailable} progress={lp.progress} onReward={lp.rewardGame} onBackToTop={backToTop} />
        </div>
        <div className={styles.earn}>
          <EarnMoreXP features={EARN_FEATURES} onAction={onFeature} />
        </div>
        <div className={styles.act}>
          <XPActivity items={lp.activity} todayXP={lp.todayXP} todayVE={lp.todayVE} onStartEarning={() => navigate('/earn')} />
        </div>
      </div>

      {demo && (
        <div className={styles.demoBar}>
          <span>Demo controls</span>
          <button type="button" onClick={() => lp.applyReward({ xp: lp.progress.xpToNext, title: 'Demo level-up', icon: 'game' })}>Trigger level up</button>
          <a href="?state=loading&demo=1">Loading</a>
          <a href="?state=error&demo=1">Error</a>
          <a href="?state=empty&demo=1">Empty</a>
          <a href="?state=nogame&demo=1">No game</a>
          <a href="?demo=1">Reset</a>
        </div>
      )}
    </>
  );
}
