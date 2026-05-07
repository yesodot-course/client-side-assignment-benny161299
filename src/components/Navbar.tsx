import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, ci) => sum + ci.quantity, 0)
  );

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        {t('navbar.icons.logo')} {t('navbar.store_name')}
      </Link>
      <div className={styles.actions}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={theme === 'light' ? t('navbar.dark_mode') : t('navbar.light_mode')}
        >
          {theme === 'light' ? t('navbar.icons.dark') : t('navbar.icons.light')}
        </button>

        <Link to="/admin" className={styles.adminLink}>
          {t('navbar.icons.admin')} {t('navbar.admin')}
        </Link>
        <button
          id="nav-cart-btn"
          className={styles.cartBtn}
          onClick={() => navigate('/cart')}
        >
          {t('navbar.icons.cart')} {t('navbar.cart')}
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
