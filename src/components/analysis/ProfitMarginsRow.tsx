import { useProfitMargins } from '../../hooks/useAnalysis';
import { SkeletonCard } from './statHelpers';
import { pct } from './analysisUtils';
import styles from '../AnalysisDashboard.module.css';


export default function ProfitMarginsRow() {
  const profitMargins = useProfitMargins();

  return (
    <>
      <div className={styles.sectionTitle}>מרווחי רווח (כל הזמנים)</div>
      <div className={styles.row2}>

        {profitMargins.isLoading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : profitMargins.isError ? (
          <div className={`${styles.card} ${styles.errorCard}`} id="analysis-profit-margins-error">
            <p className={styles.cardError}>❌ שגיאה בטעינת מרווחי רווח</p>
          </div>
        ) : (
          <>
            <div className={`${styles.card} ${styles.green}`} id="analysis-highest-margin">
              <div className={styles.cardIcon}>📈</div>
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>מרווח הרווח הגבוה ביותר</p>
                <p className={styles.cardValue}>{profitMargins.data?.highest.name ?? '—'}</p>
                <p className={styles.cardSub}>
                  {profitMargins.data ? pct(profitMargins.data.highest.margin) : ''}
                </p>
              </div>
              <div className={`${styles.marginBadge} ${styles.badgeGreen}`}>↑ גבוה</div>
            </div>

            <div className={`${styles.card} ${styles.red}`} id="analysis-lowest-margin">
              <div className={styles.cardIcon}>📉</div>
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>מרווח הרווח הנמוך ביותר</p>
                <p className={styles.cardValue}>{profitMargins.data?.lowest.name ?? '—'}</p>
                <p className={styles.cardSub}>
                  {profitMargins.data ? pct(profitMargins.data.lowest.margin) : ''}
                </p>
              </div>
              <div className={`${styles.marginBadge} ${styles.badgeRed}`}>↓ נמוך</div>
            </div>
          </>
        )}

      </div>
    </>
  );
}
