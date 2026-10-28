import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { FaCoins } from 'react-icons/fa';
import Logo from '../shared/Logo';
import { NAV_ITEMS } from './navItems';
import { usePlayer } from '../../context/PlayerContext';
import { fmt } from '../../utils/format';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  const { user, player, activity } = usePlayer();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container-xxl ${styles.inner}`}>
        <Link to="/Lvl-Dashboard" className={styles.brand} aria-label="VELOOP Rewards home"><Logo small /></Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>{label}</NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <Link to="/wallet" className={styles.balance} aria-label={`${fmt(player.ve)} VEs in wallet`}>
            <FaCoins aria-hidden="true" /> {fmt(player.ve)}
          </Link>

          <div className={styles.bellWrap} ref={ref}>
            <button type="button" className={styles.iconBtn} aria-label="Notifications" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <Bell size={20} />
            </button>
            {open && (
              <div className={styles.pop} role="dialog" aria-label="Recent notifications">
                <p className={styles.popTitle}>Recent activity</p>
                {activity.length === 0 && <p className={styles.popEmpty}>Nothing yet. Earn some XP to see updates here.</p>}
                <ul>
                  {activity.slice(0, 3).map((a) => (
                    <li key={a.id}><strong>{a.xp > 0 ? `+${a.xp} XP` : `+${a.ve} VEs`}</strong><span>{a.title}</span></li>
                  ))}
                </ul>
                <Link to="/wallet" className="vl-link" onClick={() => setOpen(false)}>View all activity</Link>
              </div>
            )}
          </div>

          {user ? (
            <Link to="/profile" className={styles.avatar} aria-label="Your profile">{user.name.trim().charAt(0).toUpperCase()}</Link>
          ) : (
            <>
              <Link to="/signin" className={styles.signin}>Sign in</Link>
              <Link to="/signup" className={`vl-btn-gold ${styles.signup}`}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
