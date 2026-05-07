import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useItems } from '../../hooks/useItems';
import styles from '../AnalysisDashboard.module.css';

const LOW_STOCK_THRESHOLD = 5;

export default function InventoryStatsRow() {
  const { t } = useTranslation();
  const { data: allItems = [] } = useItems();

  const totalProducts = allItems.length;

  const lowStockItems = useMemo(() => 
    allItems.filter((i) => i.stock > 0 && i.stock < LOW_STOCK_THRESHOLD),
  [allItems]);

  const outOfStockItems = useMemo(() => 
    allItems.filter((i) => i.stock === 0),
  [allItems]);

  return (
    <>
      <div className={styles.sectionTitle}>{t('analysis.inventory_title')}</div>
      <div className={styles.row3}>

        {/* Total products */}
        <div className={`${styles.card} ${styles.purple}`} id="analysis-total-products">
          <div className={styles.cardIcon}>{t('analysis.icons.inventory')}</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>{t('analysis.total_products')}</p>
            <p className={styles.cardValue}>{totalProducts}</p>
            <p className={styles.cardSub}>{t('analysis.unique_items')}</p>
          </div>
        </div>

        {/* Low stock */}
        <div
          className={`${styles.card} ${lowStockItems.length > 0 ? styles.gold : styles.green}`}
          id="analysis-low-stock"
        >
          <div className={styles.cardIcon}>{t('analysis.icons.low_stock')}</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>{t('analysis.low_stock', { threshold: LOW_STOCK_THRESHOLD })}</p>
            <p className={styles.cardValue}>{lowStockItems.length}</p>
            
            {lowStockItems.length > 0 ? (
              <ul className={styles.lowStockList}>
                {lowStockItems.map((i) => (
                  <li key={i._id} className={styles.lowStockItem}>
                    <span>{i.name}</span>
                    <span className={styles.lowStockBadge}>{t('analysis.items_left', { count: i.stock })}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.cardSub}>
                {t('analysis.icons.success')} {t('analysis.healthy_stock')}
              </p>
            )}
          </div>
        </div>

        {/* Out of stock */}
        <div
          className={`${styles.card} ${outOfStockItems.length > 0 ? styles.danger : styles.green}`}
          id="analysis-out-of-stock"
        >
          <div className={styles.cardIcon}>{t('analysis.icons.oos')}</div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>{t('analysis.out_of_stock')}</p>
            <p className={styles.cardValue}>{outOfStockItems.length}</p>

            {outOfStockItems.length > 0 ? (
              <ul className={styles.lowStockList}>
                {outOfStockItems.map((i) => (
                  <li key={i._id} className={styles.lowStockItem}>
                    <span>{i.name}</span>
                    <span className={`${styles.lowStockBadge} ${styles.badgeOos}`}>{t('analysis.out_of_stock_badge')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.cardSub}>
                {t('analysis.icons.success')} {t('analysis.all_in_stock')}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
