import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useItems } from '../../hooks/useItems';
import type { IItem } from '../../interfaces';
import styles from '../../pages/AdminPage.module.css';
import orderStyles from './OrdersTab.module.css';


export default function OrdersTab() {
  const { t } = useTranslation();
  const { data: orders = [], isLoading: loadingOrders, isError: errorOrders } = useOrders();
  const { data: allItems = [] } = useItems();
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const itemMap = useMemo(() => 
    new Map<string, IItem>(allItems.map((i) => [i._id, i])),
  [allItems]);

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
        <span className={styles.countLabel}>{t('admin.orders.count', { count: orders.length })}</span>
      </div>

      {loadingOrders && <p className={styles.info}>{t('admin.orders.loading')}</p>}
      {errorOrders   && <p className={styles.errorMsg}>{t('admin.orders.error_loading')}</p>}

      {!loadingOrders && orders.length === 0 && (
        <p className={styles.info}>{t('admin.orders.no_orders')}</p>
      )}

  
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
    
                <div className={styles.supplierHeader}>
                  <div className={styles.supplierMeta}>
                    <span className={styles.supplierName}>
                      {t('common.cart_icon')} {formatted(order.orderDate ?? order.createdAt)}
                    </span>
                    <span className={styles.supplierCount}>
                      {t('admin.orders.summary', { count: order.items.length, profit: shekel(order.shopProfit) })}
                    </span>
                    <span className={styles.supplierCount}>{t('common.location_icon')} {order.address}</span>
                  </div>
                  <div className={styles.supplierHeaderActions}>
                    <button
                      className={styles.toggleBtn}
                      onClick={() => setExpandedId(expanded ? null : order._id)}
                      title={expanded ? t('common.collapse') : t('admin.orders.show_items')}
                    >
                      {expanded ? t('common.arrow_up') : t('common.arrow_down')}
                    </button>
                  </div>
                </div>

           
                {expanded && (
                  <div className={styles.supplierItems}>
                    {order.items.length === 0 ? (
                      <p className={styles.info}>{t('admin.orders.empty_order')}</p>
                    ) : (
                      <div className={orderStyles.itemsList}>
                        {order.items.map((orderItem, idx) => {
                          const itemId = typeof orderItem.itemId === 'object' 
                            ? orderItem.itemId._id 
                            : orderItem.itemId;
                          
                          const isPopulated = typeof orderItem.itemId === 'object';
                          const itemFromMap = itemMap.get(itemId);
                          const item = (itemFromMap || (isPopulated ? orderItem.itemId : null)) as (Partial<IItem> | null);
                          const itemName = typeof orderItem.itemId === 'object' ? orderItem.itemId.name : (itemFromMap?.name ?? itemId);
                          const itemImage = typeof orderItem.itemId === 'object' ? orderItem.itemId.image : itemFromMap?.image;

                          return (
                            <div key={`${itemId}-${idx}`} className={orderStyles.itemCard}>
                          
                              <div className={orderStyles.thumb}>
                                  {itemImage ? (
                                    <img src={itemImage} alt={itemName} className={orderStyles.thumbImg} />
                                  ) : (
                                    <div className={orderStyles.thumbPlaceholder}>{t('common.box_icon')}</div>
                                  )}
                              </div>

                          
                              <div className={orderStyles.itemDetails}>
                                <Link
                                  to={`/items/${itemId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={orderStyles.itemName}
                                >
                                  {itemName} {t('common.link_icon')}
                                </Link>

                                <div className={orderStyles.meta}>
                                  {item?.supplier && (
                                    <span className={orderStyles.tag}>{t('common.supplier_icon')} {
                                      typeof item.supplier === 'object'
                                        ? item.supplier.name
                                        : item.supplier
                                    }</span>
                                  )}
                                  {item?.category && (
                                    <span className={orderStyles.tag}>{t('common.tag_icon')} {item.category}</span>
                                  )}
                                  <span className={orderStyles.tag}>{t('common.quantity_prefix')} {orderItem.quantity}</span>
                                </div>

                                {item?.description && (
                                  <p className={orderStyles.desc}>{item.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
