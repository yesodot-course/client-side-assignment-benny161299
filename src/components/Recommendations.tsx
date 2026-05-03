import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ICartItem } from '../interfaces';
import { useItems } from '../hooks/useItems';
import styles from '../pages/CartPage.module.css';

interface RecommendationsProps {
  cartItems: ICartItem[];
}

export default function Recommendations({ cartItems }: RecommendationsProps) {
  const { data: allItems = [] } = useItems();

  const recs = useMemo(() => {
    const cartIds        = new Set(cartItems.map((ci) => ci.item._id));
    const cartCategories = new Set(cartItems.map((ci) => ci.item.category));
    const seed = cartItems.reduce((acc, ci) => acc + ci.item._id.charCodeAt(0), 0);

    return allItems
      .filter((i) => !cartIds.has(i._id) && cartCategories.has(i.category) && i.stock > 0)
      .sort((a, b) => ((a._id.charCodeAt(seed % a._id.length) - b._id.charCodeAt(seed % b._id.length)) || 0))
      .slice(0, 4);
  }, [allItems, cartItems]);

  if (recs.length === 0) return null;

  return (
    <section className={styles.recsSection}>
      <h2 className={styles.recsTitle}>💡 אולי תאהב גם</h2>
      <div className={styles.recsGrid}>
        {recs.map((item) => (
          <Link key={item._id} to={`/items/${item._id}`} className={styles.recCard}>
            {item.image
              ? <img src={item.image} alt={item.name} className={styles.recImg} />
              : <div className={styles.recPlaceholder}>📦</div>}
            <span className={styles.recName}>{item.name}</span>
            <span className={styles.recPrice}>₪{item.price.toFixed(2)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
