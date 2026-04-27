import { Component, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTopSupplier } from '../hooks/useAnalysis';
import { StatCard } from './analysis/statHelpers';
import { shekel } from './analysis/analysisUtils';
import InventoryStatsRow   from './analysis/InventoryStatsRow';
import RevenueRow          from './analysis/RevenueRow';
import ProfitMarginsRow    from './analysis/ProfitMarginsRow';
import SupplierSpendTable  from './analysis/SupplierSpendTable';
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

// ─── Inner dashboard ─────────────────────────────────────────────────────────
function AnalysisDashboardInner() {
  const qc          = useQueryClient();
  const topSupplier = useTopSupplier();

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

      {/* Row 0 — local inventory stats */}
      <InventoryStatsRow />

      {/* Row 1 — revenue, weekly category, daily item */}
      <RevenueRow />

      {/* Row 2 — profit margins */}
      <ProfitMarginsRow />

      {/* Top supplier */}
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

      {/* Supplier spend table */}
      <SupplierSpendTable />

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
