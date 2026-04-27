import { Component, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMonthlyRevenue,
  useWeeklyTopCategory,
  useDailyTopItem,
  useProfitMargins,
  useTopSupplier,
  useSupplierSpend,
} from '../hooks/useAnalysis';
import styles from './AnalysisDashboard.module.css';

// ─── Error Boundary ───────────────────────────────────────────────────────────
class AnalysisErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: err instanceof Error ? err.message : 'שגיאה לא ידועה' };
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div className={styles.boundaryError}>
          <p>❌ שגיאה בטעינת לוח האנליטיקה</p>
          <p className={styles.boundaryMsg}>{this.state.message}</p>
          <button
            className={styles.refreshBtn}
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            🔄 נסה שוב
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Format a number as ₪ currency string — safe against undefined */
function shekel(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `₪${n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a number as percentage — safe against undefined */
function pct(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return <div className={`${styles.card} ${styles.skeleton}`} aria-busy="true" />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  id: string;
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  accent?: 'green' | 'red' | 'purple' | 'blue' | 'gold';
  loading?: boolean;
  error?: boolean;
}

function StatCard({ id, icon, label, value, subValue, accent = 'purple', loading, error }: StatCardProps) {
  if (loading) return <SkeletonCard />;
  return (
    <div className={`${styles.card} ${styles[accent]}`} id={id}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardBody}>
        <p className={styles.cardLabel}>{label}</p>
        {error
          ? <p className={styles.cardError}>— אין נתונים —</p>
          : <p className={styles.cardValue}>{value}</p>
        }
        {!error && subValue && <p className={styles.cardSub}>{subValue}</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AnalysisDashboard (inner)
// ══════════════════════════════════════════════════════════════════════════════
function AnalysisDashboardInner() {
  const qc = useQueryClient();

  const monthly       = useMonthlyRevenue();
  const weeklyTopCat  = useWeeklyTopCategory();
  const dailyTopItem  = useDailyTopItem();
  const profitMargins = useProfitMargins();
  const topSupplier   = useTopSupplier();
  const supplierSpend = useSupplierSpend();

  const handleRefresh = () => {
    void qc.invalidateQueries({ queryKey: ['analysis'] });
  };

  return (
    <section className={styles.dashboard} id="analysis-dashboard">

      {/* Header */}
      <div className={styles.dashHeader}>
        <div>
          <h2 className={styles.dashTitle}>📊 דוחות ואנליטיקה</h2>
          <p className={styles.dashSub}>נתונים מהשרת בזמן אמת</p>
        </div>
        <button
          id="analysis-refresh-btn"
          className={styles.refreshBtn}
          onClick={handleRefresh}
          title="רענן נתונים"
        >
          🔄 רענן
        </button>
      </div>

      {/* ── Row 1: revenue + weekly category + daily item ─────────────────── */}
      <div className={styles.row3}>

        {/* Monthly Revenue */}
        <StatCard
          id="analysis-monthly-revenue"
          icon="💰"
          label="הכנסות החודש (30 יום)"
          value={monthly.data ? shekel(monthly.data.revenue) : '—'}
          accent="green"
          loading={monthly.isLoading}
          error={monthly.isError}
        />

        {/* Weekly Top Category */}
        <StatCard
          id="analysis-weekly-top-category"
          icon="📊"
          label="קטגוריה מובילה השבוע (7 יום)"
          value={weeklyTopCat.data?.category ?? '—'}
          subValue={weeklyTopCat.data ? `רווח: ${shekel(weeklyTopCat.data.profit)}` : undefined}
          accent="blue"
          loading={weeklyTopCat.isLoading}
          error={weeklyTopCat.isError}
        />

        {/* Daily Top Item */}
        <StatCard
          id="analysis-daily-top-item"
          icon="🏆"
          label="פריט מוביל היום (24 שעות)"
          value={dailyTopItem.data?.name ?? '—'}
          subValue={dailyTopItem.data ? `רווח: ${shekel(dailyTopItem.data.profit)}` : undefined}
          accent="gold"
          loading={dailyTopItem.isLoading}
          error={dailyTopItem.isError}
        />
      </div>

      {/* ── Row 2: profit margins ─────────────────────────────────────────── */}
      <div className={styles.sectionTitle}>מרווחי רווח (כל הזמנים)</div>
      <div className={styles.row2}>

        {/* Highest Margin */}
        {profitMargins.isLoading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : profitMargins.isError ? (
          <div className={`${styles.card} ${styles.errorCard}`} id="analysis-profit-margins-error">
            <p className={styles.cardError}>❌ שגיאה בטעינת מרווחי רווח</p>
          </div>
        ) : (
          <>
            <div className={`${styles.card} ${styles.green}`} id="analysis-highest-margin">
              <div className={styles.cardIcon}>📈</div>
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>מרווח הרווח הגבוה ביותר</p>
                <p className={styles.cardValue}>{profitMargins.data?.highest.name ?? '—'}</p>
                <p className={styles.cardSub}>
                  {profitMargins.data ? pct(profitMargins.data.highest.margin) : ''}
                </p>
              </div>
              <div className={styles.marginBadge + ' ' + styles.badgeGreen}>↑ גבוה</div>
            </div>

            <div className={`${styles.card} ${styles.red}`} id="analysis-lowest-margin">
              <div className={styles.cardIcon}>📉</div>
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>מרווח הרווח הנמוך ביותר</p>
                <p className={styles.cardValue}>{profitMargins.data?.lowest.name ?? '—'}</p>
                <p className={styles.cardSub}>
                  {profitMargins.data ? pct(profitMargins.data.lowest.margin) : ''}
                </p>
              </div>
              <div className={styles.marginBadge + ' ' + styles.badgeRed}>↓ נמוך</div>
            </div>
          </>
        )}
      </div>

      {/* ── Row 3: top supplier ───────────────────────────────────────────── */}
      <StatCard
        id="analysis-top-supplier"
        icon="🥇"
        label="ספק הכי רווחי (כל הזמנים)"
        value={topSupplier.data?.name ?? '—'}
        subValue={topSupplier.data ? `רווח כולל: ${shekel(topSupplier.data.profit)}` : undefined}
        accent="purple"
        loading={topSupplier.isLoading}
        error={topSupplier.isError}
      />

      {/* ── Supplier Spend Table ──────────────────────────────────────────── */}
      <div className={styles.sectionTitle}>
        הוצאות לפי ספק (כל הזמנים)
        <span className={styles.sectionNote}>הזמנות + מלאי קיים, ממוין בסדר יורד</span>
      </div>

      {supplierSpend.isLoading && (
        <div className={styles.tableWrap}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skeletonRow}`} />
          ))}
        </div>
      )}

      {supplierSpend.isError && (
        <p className={styles.tableError}>❌ שגיאה בטעינת נתוני הוצאות</p>
      )}

      {!supplierSpend.isLoading && !supplierSpend.isError && supplierSpend.data && (
        supplierSpend.data.length === 0 ? (
          <p className={styles.emptyMsg}>אין נתוני הוצאות עדיין.</p>
        ) : (
          <div className={styles.tableWrap} id="analysis-supplier-spend-table">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ספק</th>
                  <th>סה״כ הוצאה</th>
                  <th>נתח יחסי</th>
                </tr>
              </thead>
              <tbody>
                {supplierSpend.data.map((row, idx) => {
                  const total = supplierSpend.data!.reduce((s, r) => s + r.totalSpent, 0);
                  const share = total > 0 ? row.totalSpent / total : 0;
                  return (
                    <tr key={row.supplierId} id={`analysis-spend-row-${row.supplierId}`}>
                      <td className={styles.rank}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </td>
                      <td className={styles.supplierName}>{row.name}</td>
                      <td className={styles.amount}>{shekel(row.totalSpent)}</td>
                      <td className={styles.shareCell}>
                        <div className={styles.shareBar}>
                          <div
                            className={styles.shareFill}
                            style={{ width: `${(share * 100).toFixed(1)}%` }}
                          />
                        </div>
                        <span className={styles.shareLabel}>{pct(share)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  );
}

// ── Exported wrapper with ErrorBoundary ───────────────────────────────────────
export default function AnalysisDashboard() {
  return (
    <AnalysisErrorBoundary>
      <AnalysisDashboardInner />
    </AnalysisErrorBoundary>
  );
}
