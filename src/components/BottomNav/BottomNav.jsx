import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../layout/navItems';
import styles from './BottomNav.module.css';

/** Mobile navigation. Every item is a real route. */
export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${styles.item} ${isActive ? styles.on : ''}`}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
