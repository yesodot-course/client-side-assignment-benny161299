import { useSupplierSpend } from '../../hooks/useAnalysis';
import { shekel, pct } from './analysisUtils';
import styles from '../AnalysisDashboard.module.css';

/**
 * SupplierSpendTable — ranked table of total spending per supplier
 * (orders + current stock), sorted descending, with relative share bars.
 */
export default function SupplierSpendTable() {
  const supplierSpend = useSupplierSpend();

  return (
    <>
      <div className={styles.sectionTitle}>
        הוצאות לפי ספק (כל הזמנים)
        <span className={styles.sectionNote}>הזמנות + מלאי קיים, ממוין בסדר יורד</span>
      </div>

      {supplierSpend.isLoading && (
        <div className={styles.tableWrap}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonRow} />
          ))}
        </div>
      )}

      {supplierSpend.isError && (
        <p className={styles.tableError}>❌ שגיאה בטעינת נתוני הוצאות</p>
      )}

      {!supplierSpend.isLoading && !supplierSpend.isError && supplierSpend.data && (
        supplierSpend.data.length === 0 ? (
          <p className={styles.emptyMsg}>אין נתוני הוצאות עדיין.</p>
        ) : (
          <div className={styles.tableWrap} id="analysis-supplier-spend-table">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ספק</th>
                  <th>סה״כ הוצאה</th>
                  <th>נתח יחסי</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const total = supplierSpend.data!.reduce((s, r) => s + r.totalSpent, 0);
                  return supplierSpend.data!.map((row, idx) => {
                    const share = total > 0 ? row.totalSpent / total : 0;
                    return (
                      <tr key={row.supplierId} id={`analysis-spend-row-${row.supplierId}`}>
                        <td className={styles.rank}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className={styles.supplierName}>{row.name}</td>
                        <td className={styles.amount}>{shekel(row.totalSpent)}</td>
                        <td className={styles.shareCell}>
                          <div className={styles.shareBar}>
                            <div
                              className={styles.shareFill}
                              style={{ width: `${(share * 100).toFixed(1)}%` }}
                            />
                          </div>
                          <span className={styles.shareLabel}>{pct(share)}</span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
}
