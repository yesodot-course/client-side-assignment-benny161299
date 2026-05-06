import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar            from '../components/Navbar';
import ItemsTab          from '../components/admin/ItemsTab';
import SuppliersTab      from '../components/admin/SuppliersTab';
import OrdersTab         from '../components/admin/OrdersTab';
import AnalysisDashboard from '../components/AnalysisDashboard';
import styles from './AdminPage.module.css';

type Tab = 'items' | 'suppliers' | 'orders' | 'analysis';


export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('items');

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t('admin.title')}</h1>
          <p className={styles.pageSubtitle}>{t('admin.subtitle')}</p>
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
            {t('admin.tabs.items')}
          </button>
          <button
            id="admin-tab-suppliers"
            role="tab"
            aria-selected={activeTab === 'suppliers'}
            className={`${styles.tab} ${activeTab === 'suppliers' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            {t('admin.tabs.suppliers')}
          </button>
          <button
            id="admin-tab-orders"
            role="tab"
            aria-selected={activeTab === 'orders'}
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            {t('admin.tabs.orders')}
          </button>
          <button
            id="admin-tab-analysis"
            role="tab"
            aria-selected={activeTab === 'analysis'}
            className={`${styles.tab} ${activeTab === 'analysis' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            {t('admin.tabs.analysis')}
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
