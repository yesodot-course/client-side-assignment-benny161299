import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import styles from '../../pages/AdminPage.module.css';

/**
 * OrdersTab — displays all orders in the system.
 * Each row is expandable to show the items in the order.
 */
export default function OrdersTab() {
  const { data: orders = [], isLoading, isError } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatted = (dateStr: string) =>
    new Date(dateStr).toLocaleString('he-IL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const shekel = (n: number) =>
    `₪${n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <section className={styles.tabContent}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.countLabel}>{orders.length} הזמנות</span>
      </div>

      {isLoading && <p className={styles.info}>⏳ טוען הזמנות...</p>}
      {isError   && <p className={styles.errorMsg}>❌ שגיאה בטעינת הזמנות. וודא שהשרת פועל.</p>}

      {!isLoading && orders.length === 0 && (
        <p className={styles.info}>אין הזמנות עדיין.</p>
      )}

      {/* Orders list */}
      {orders.length > 0 && (
        <div className={styles.supplierGrid}>
          {[...orders].reverse().map((order) => {
            const expanded = expandedId === order._id;
            return (
              <div
                key={order._id}
                className={styles.supplierCard}
                id={`admin-order-${order._id}`}
              >
                {/* Header row */}
                <div className={styles.supplierHeader}>
                  <div className={styles.supplierMeta}>
                    <span className={styles.supplierName}>
                      🛒 {formatted(order.orderDate ?? order.createdAt)}
                    </span>
                    <span className={styles.supplierCount}>
                      {order.items.length} פריטים &nbsp;|&nbsp; רווח: {shekel(order.shopProfit)}
                    </span>
                    <span className={styles.supplierCount}>📍 {order.address}</span>
                  </div>
                  <div className={styles.supplierHeaderActions}>
                    <button
                      className={styles.toggleBtn}
                      onClick={() => setExpandedId(expanded ? null : order._id)}
                      title={expanded ? 'כווץ' : 'הצג פריטים'}
                    >
                      {expanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {/* Expanded items */}
                {expanded && (
                  <div className={styles.supplierItems}>
                    {order.items.length === 0 ? (
                      <p className={styles.info}>אין פריטים בהזמנה</p>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>מזהה פריט</th>
                            <th>כמות</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={`${item.itemId}-${idx}`}>
                              <td>{idx + 1}</td>
                              <td className={styles.minPrice}>{item.itemId}</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
