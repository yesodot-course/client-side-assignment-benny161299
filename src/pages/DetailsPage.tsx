import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItem } from '../hooks/useItems';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import styles from './DetailsPage.module.css';

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);

  const { data: item, isLoading, isError } = useItem(id ?? '');

  if (isLoading) return (
    <>
      <Navbar />
      <div className={styles.center}><p>טוען מוצר...</p></div>
    </>
  );

  if (isError || !item) return (
    <>
      <Navbar />
      <div className={styles.center}>
        <p className={styles.error}>מוצר לא נמצא.</p>
        <Link to="/" className={styles.backLink}>← חזרה לחנות</Link>
      </div>
    </>
  );

  const outOfStock = item.stock === 0;
  const supplierName = typeof item.supplier === 'object' ? item.supplier.name : '—';

  const handleAdd = () => {
    dispatch(addToCart({ item, quantity: qty }));
    toast.success(`✅ ${item.name} נוסף לעגלה`);
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link to="/" className={styles.backLink}>← חזרה לחנות</Link>

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
              <span className={styles.tag}>ספק: {supplierName}</span>
            </div>

            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}

            <div className={styles.priceRow}>
              <span className={styles.price}>₪{item.price.toFixed(2)}</span>
              <span className={outOfStock ? styles.outOfStock : styles.inStock}>
                {outOfStock ? '❌ אזל המלאי' : `✅ במלאי: ${item.stock}`}
              </span>
            </div>

            {!outOfStock && (
              <div className={styles.addRow}>
                <label htmlFor="detail-qty" className={styles.label}>כמות:</label>
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
                  🛒 הוסף לעגלה
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
