import styles from './States.module.css';

const Block = ({ h = 20, w = '100%', r = 10, className = '' }) => (
  <span className={`${styles.sk} ${className}`} style={{ height: h, width: w, borderRadius: r }} />
);

export default function DashboardSkeleton() {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading your level progress" role="status">
      <div className={`vl-card ${styles.hero}`}>
        <Block h={110} w={110} r={24} />
        <div className={styles.col}><Block h={14} w="40%" /><Block h={42} w="70%" /><Block h={14} w="55%" /></div>
        <Block h={14} className={styles.full} />
      </div>
      <div className={`vl-card ${styles.reward}`}><Block h={20} w="60%" /><Block h={120} r={16} /><Block h={36} /></div>
      <div className={`vl-card ${styles.road}`}><Block h={20} w="30%" /><div className={styles.row}>{[0, 1, 2, 3].map((i) => <Block key={i} h={150} r={16} />)}</div></div>
      <div className={`vl-card ${styles.game}`}><Block h={20} w="35%" /><Block h={220} r={16} /></div>
      <div className={`vl-card ${styles.earn}`}><Block h={20} w="40%" /><div className={styles.row}>{[0, 1, 2].map((i) => <Block key={i} h={84} r={16} />)}</div></div>
      <div className={`vl-card ${styles.act}`}><Block h={20} w="50%" /><Block h={52} /><Block h={52} /><Block h={52} /></div>
    </div>
  );
}
