import styles from '../AnalysisDashboard.module.css';

export interface StatCardProps {
  id: string;
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  accent?: 'green' | 'red' | 'purple' | 'blue' | 'gold';
  loading?: boolean;
  error?: boolean;
}

/** Placeholder card shown while data is loading. */
export function SkeletonCard() {
  return <div className={`${styles.card} ${styles.skeleton}`} aria-busy="true" />;
}

/** Generic stat card used throughout the analytics dashboard. */
export function StatCard({
  id, icon, label, value, subValue, accent = 'purple', loading, error,
}: StatCardProps) {
  if (loading) return <SkeletonCard />;
  return (
    <div className={`${styles.card} ${styles[accent]}`} id={id}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardBody}>
        <p className={styles.cardLabel}>{label}</p>
        {error
          ? <p className={styles.cardError}>— אין נתונים —</p>
          : <p className={styles.cardValue}>{value}</p>
        }
        {!error && subValue && <p className={styles.cardSub}>{subValue}</p>}
      </div>
    </div>
  );
}
