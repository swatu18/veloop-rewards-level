import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppHeader from './AppHeader';
import BottomNav from '../BottomNav/BottomNav';
import LevelUpModal from '../LevelUpModal/LevelUpModal';
import { usePlayer } from '../../context/PlayerContext';
import styles from './AppLayout.module.css';

/** Header + page + mobile nav. The level-up celebration works from any page. */
export default function AppLayout() {
  const { levelUp, claimLevelUp } = usePlayer();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={`container-xxl ${styles.main}`}><Outlet /></main>
      <BottomNav />
      {levelUp && <LevelUpModal levelUp={levelUp} onClaim={claimLevelUp} />}
    </div>
  );
}
