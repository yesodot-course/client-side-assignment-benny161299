import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity, clearCart, clearError } from '../store/cartSlice';
import { useCreateOrder } from '../hooks/useOrders';
import Navbar from '../components/Navbar';
import Recommendations from '../components/Recommendations';
import styles from './CartPage.module.css';



export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: cartItems, error: cartError } = useAppSelector((s) => s.cart);
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [address, setAddress] = useState('');

  const total = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const handleCheckout = async () => {
    if (!address.trim() || address.trim().length < 5) {
      toast.error('הכתובת חייבת להכיל לפחות 5 תווים');
      return;
    }
    
    const uniqueCount = cartItems.length;
    const totalQty    = cartItems.reduce((s, ci) => s + ci.quantity, 0);
    if (uniqueCount > 10) { toast.error('מקסימום 10 פריטים שונים בהזמנה'); return; }
    if (totalQty    > 50) { toast.error('מקסימום 50 פריטים בסה"כ'); return; }

    try {
      
      await createOrder({
        items: cartItems.map((ci) => ({ itemId: ci.item._id, quantity: ci.quantity })),
        address,
      });
      dispatch(clearCart());
      toast.success('✅ ההזמנה בוצעה בהצלחה!');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'שגיאה בביצוע ההזמנה';
      toast.error(msg);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>🛒 העגלה שלך</h1>

        {cartError && (
          <div className={styles.cartError} onClick={() => dispatch(clearError())}>
            ⚠️ {cartError} (לחץ לסגירה)
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className={styles.empty}>
            <p>העגלה ריקה.</p>
            <Link to="/" className={styles.continueLink}>← המשך קניות</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Cart items list */}
            <section className={styles.itemsList}>
              {cartItems.map((ci) => (
                <div key={ci.item._id} className={styles.row} id={`cart-row-${ci.item._id}`}>
                  <div className={styles.rowImg}>
                    {ci.item.image
                      ? <img src={ci.item.image} alt={ci.item.name} className={styles.thumb} />
                      : <div className={styles.thumbPlaceholder}>📦</div>}
                  </div>
                  <div className={styles.rowInfo}>
                    <Link to={`/items/${ci.item._id}`} className={styles.rowName}>
                      {ci.item.name}
                    </Link>
                    <span className={styles.rowCategory}>{ci.item.category}</span>
                  </div>
                  <div className={styles.rowControls}>
                    <button id={`cart-dec-${ci.item._id}`}
                      onClick={() => dispatch(updateQuantity({ itemId: ci.item._id, quantity: ci.quantity - 1 }))}>
                      ➖
                    </button>
                    <span className={styles.qty}>{ci.quantity}</span>
                    <button id={`cart-inc-${ci.item._id}`}
                      onClick={() => dispatch(updateQuantity({ itemId: ci.item._id, quantity: ci.quantity + 1 }))}>
                      ➕
                    </button>
                  </div>
                  <span className={styles.rowPrice}>₪{(ci.item.price * ci.quantity).toFixed(2)}</span>
                  <button id={`cart-remove-${ci.item._id}`} className={styles.removeBtn}
                    onClick={() => dispatch(removeFromCart(ci.item._id))}>🗑️</button>
                </div>
              ))}

              <div className={styles.listActions}>
                <Link to="/" className={styles.continueShoppingBtn}>
                  🛍️ המשך בקניות
                </Link>
                <button id="cart-clear-btn" className={styles.clearBtn}
                  onClick={() => dispatch(clearCart())}>
                  🗑️ נקה עגלה
                </button>
              </div>
            </section>

            {/* Summary + checkout */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>סיכום הזמנה</h2>
              <div className={styles.summaryRow}>
                <span>פריטים ({cartItems.reduce((s, ci) => s + ci.quantity, 0)})</span>
                <span>₪{total.toFixed(2)}</span>
              </div>
              <hr className={styles.divider} />
              <div className={styles.summaryTotal}>
                <span>סה"כ</span>
                <span>₪{total.toFixed(2)}</span>
              </div>
              <input
                id="checkout-address"
                type="text"
                placeholder="כתובת למשלוח *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.addressInput}
                dir="rtl"
              />
              <button
                id="checkout-btn"
                onClick={handleCheckout}
                disabled={isPending}
                className={styles.checkoutBtn}
              >
                {isPending ? 'מעבד...' : '✅ בצע הזמנה'}
              </button>
            </aside>
          </div>
        )}

        {/* Recommendations */}
        {cartItems.length > 0 && <Recommendations cartItems={cartItems} />}
      </main>
    </>
  );
}
