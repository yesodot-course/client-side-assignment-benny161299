import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItem } from '../hooks/useItems';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import styles from './DetailsPage.module.css';

export default function DetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);

  const { data: item, isLoading, isError } = useItem(id ?? '');

  if (isLoading) return (
    <>
      <Navbar />
      <div className={styles.center}><p>{t('details.loading')}</p></div>
    </>
  );

  if (isError || !item) return (
    <>
      <Navbar />
      <div className={styles.center}>
        <p className={styles.error}>{t('details.not_found')}</p>
        <Link to="/" className={styles.backLink}>{t('details.back')}</Link>
      </div>
    </>
  );

  const outOfStock = item.stock === 0;
  const supplierName = typeof item.supplier === 'object' ? item.supplier.name : '—';

  const handleAdd = () => {
    dispatch(addToCart({ item, quantity: qty }));
    toast.success(t('product.added_to_cart', { name: item.name }));
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link to="/" className={styles.backLink}>{t('details.back')}</Link>

        <div className={styles.card}>
          {/* Image */}
          <div className={styles.imgWrap}>
            {item.image ? (
              <img src={item.image} alt={item.name} className={styles.img} />
            ) : (
              <div className={styles.placeholder}>📦</div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h1 className={styles.name}>{item.name}</h1>

            <div className={styles.tags}>
              <span className={styles.tag}>{item.category}</span>
              <span className={styles.tag}>{t('details.supplier', { name: supplierName })}</span>
            </div>

            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}

            <div className={styles.priceRow}>
              <span className={styles.price}>₪{item.price.toFixed(2)}</span>
              <span className={outOfStock ? styles.outOfStock : styles.inStock}>
                {outOfStock ? t('details.out_of_stock') : t('details.in_stock', { count: item.stock })}
              </span>
            </div>

            {!outOfStock && (
              <div className={styles.addRow}>
                <label htmlFor="detail-qty" className={styles.label}>{t('details.quantity')}</label>
                <input
                  id="detail-qty"
                  type="number"
                  min={1}
                  max={item.stock}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.min(item.stock, Number(e.target.value))))
                  }
                  className={styles.qtyInput}
                />
                <button id="detail-add-btn" onClick={handleAdd} className={styles.addBtn}>
                  {t('details.add_to_cart')}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
