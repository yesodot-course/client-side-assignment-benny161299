import { useItems } from '../../hooks/useItems';
import styles from '../AnalysisDashboard.module.css';

/**
 * InventoryStatsRow — shows three local inventory cards:
 * total products, low stock (< 5), and out of stock (= 0).
 * Computed from the cached useItems data — no extra API call.
 */
export default function InventoryStatsRow() {
  const { data: allItems = [] } = useItems();
  const totalProducts   = allItems.length;
  const lowStockItems   = allItems.filter((i) => i.stock > 0 && i.stock < 5);
  const outOfStockItems = allItems.filter((i) => i.stock === 0);

  return (
    <>
      <div className={styles.sectionTitle}>מלאי החנות</div>
      <div className={styles.row3}>

        {/* Total products */}
        <div className={`${styles.card} ${styles.purple}`} id="analysis-total-products">
          <div className={styles.cardIcon}>📦</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>סה״כ פריטים בחנות</p>
            <p className={styles.cardValue}>{totalProducts}</p>
            <p className={styles.cardSub}>פריטים ייחודיים</p>
          </div>
        </div>

        {/* Low stock */}
        <div
          className={`${styles.card} ${lowStockItems.length > 0 ? styles.gold : styles.green}`}
          id="analysis-low-stock"
        >
          <div className={styles.cardIcon}>🛍️</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>עומדים להיגמר (מלאי &lt; 5)</p>
            <p className={styles.cardValue}>{lowStockItems.length}</p>
            {lowStockItems.length > 0 && (
              <ul className={styles.lowStockList}>
                {lowStockItems.map((i) => (
                  <li key={i._id} className={styles.lowStockItem}>
                    <span>{i.name}</span>
                    <span className={styles.lowStockBadge}>{i.stock} נשארו</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Out of stock */}
        <div
          className={`${styles.card} ${outOfStockItems.length > 0 ? styles.red : styles.green}`}
          id="analysis-out-of-stock"
        >
          <div className={styles.cardIcon}>🚫</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>אזל מהמלאי (stock = 0)</p>
            <p className={styles.cardValue}>{outOfStockItems.length}</p>
            {outOfStockItems.length > 0 && (
              <ul className={styles.lowStockList}>
                {outOfStockItems.map((i) => (
                  <li key={i._id} className={styles.lowStockItem}>
                    <span>{i.name}</span>
                    <span className={`${styles.lowStockBadge} ${styles.badgeOos}`}>אזל</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
