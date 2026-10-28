import { RefreshCw, TriangleAlert } from 'lucide-react';
import styles from './States.module.css';

/** Friendly error. Never show raw API/server messages here. */
export default function ErrorState({ onRetry }) {
  return (
    <div className={`vl-card ${styles.error}`} role="alert">
      <TriangleAlert size={40} aria-hidden="true" />
      <h2>Unable to Load Level Progress</h2>
      <p>We couldn't load your level information right now. Please try again.</p>
      <button type="button" className="vl-btn-gold" onClick={onRetry}><RefreshCw size={18} aria-hidden="true" /> Try Again</button>
    </div>
  );
}
