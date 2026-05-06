import type { IItem } from '../interfaces';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import styles from './ProductCard.module.css';

interface Props {
  item: IItem;
}

export default function ProductCard({ item }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    dispatch(addToCart({ item, quantity: qty }));
    toast.success(t('product.added_to_cart', { name: item.name }));
  };

  const outOfStock = item.stock === 0;

  return (
    <article className={styles.card} id={`product-card-${item._id}`}>
      <Link to={`/items/${item._id}`} className={styles.imgWrap}>
        {item.image ? (
          <img src={item.image} alt={item.name} className={styles.img} />
        ) : (
          <div className={styles.placeholder}>📦</div>
        )}
      </Link>

      <div className={styles.body}>
        <Link to={`/items/${item._id}`} className={styles.name}>{item.name}</Link>
        <span className={styles.category}>{item.category}</span>
        <span className={styles.supplier}>
          {typeof item.supplier === 'object' ? item.supplier.name : '—'}
        </span>

        <div className={styles.footer}>
          <span className={styles.price}>₪{item.price.toFixed(2)}</span>
          {outOfStock ? (
            <span className={styles.outOfStock}>{t('product.out_of_stock')}</span>
          ) : (
            <div className={styles.addRow}>
              <input
                id={`qty-${item._id}`}
                type="number"
                min={1}
                max={item.stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(item.stock, Number(e.target.value))))}
                className={styles.qtyInput}
              />
              <button
                id={`add-to-cart-${item._id}`}
                onClick={handleAdd}
                className={styles.addBtn}
              >
                {t('product.add')}
              </button>
            </div>
          )}
        </div>
        <span className={styles.stock}>{t('product.in_stock', { count: item.stock })}</span>
      </div>
    </article>
  );
}
