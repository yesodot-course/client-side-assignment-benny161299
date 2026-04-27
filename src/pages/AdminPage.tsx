import { useState } from 'react';
import Navbar            from '../components/Navbar';
import ItemsTab          from '../components/admin/ItemsTab';
import SuppliersTab      from '../components/admin/SuppliersTab';
import OrdersTab         from '../components/admin/OrdersTab';
import AnalysisDashboard from '../components/AnalysisDashboard';
import styles from './AdminPage.module.css';

type Tab = 'items' | 'suppliers' | 'orders' | 'analysis';

/**
 * AdminPage — root page for the admin interface.
 * Renders four tabs: Items, Suppliers, Orders, and Analytics.
 * Each tab is a focused, self-contained component.
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('items');

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>⚙️ ממשק ניהול</h1>
          <p className={styles.pageSubtitle}>ניהול מוצרים, ספקים, הזמנות ואנליטיקה</p>
        </header>

        {/* Tab navigation */}
        <div className={styles.tabs} role="tablist">
          <button
            id="admin-tab-items"
            role="tab"
            aria-selected={activeTab === 'items'}
            className={`${styles.tab} ${activeTab === 'items' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('items')}
          >
            📦 פריטים
          </button>
          <button
            id="admin-tab-suppliers"
            role="tab"
            aria-selected={activeTab === 'suppliers'}
            className={`${styles.tab} ${activeTab === 'suppliers' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            🏭 ספקים
          </button>
          <button
            id="admin-tab-orders"
            role="tab"
            aria-selected={activeTab === 'orders'}
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 הזמנות
          </button>
          <button
            id="admin-tab-analysis"
            role="tab"
            aria-selected={activeTab === 'analysis'}
            className={`${styles.tab} ${activeTab === 'analysis' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📊 אנליטיקה
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'items'     && <ItemsTab />}
        {activeTab === 'suppliers' && <SuppliersTab />}
        {activeTab === 'orders'    && <OrdersTab />}
        {activeTab === 'analysis'  && <AnalysisDashboard />}
      </main>
    </>
  );
}
