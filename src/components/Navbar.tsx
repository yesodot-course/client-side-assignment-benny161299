import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, ci) => sum + ci.quantity, 0)
  );

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>🛒 MyStore</Link>
      <div className={styles.actions}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={theme === 'light' ? 'מצב כהה' : 'מצב בהיר'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <Link to="/admin" className={styles.adminLink}>⚙️ Admin</Link>
        <button
          id="nav-cart-btn"
          className={styles.cartBtn}
          onClick={() => navigate('/cart')}
        >
          🛒 עגלה
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
