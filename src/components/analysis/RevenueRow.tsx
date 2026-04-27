import { useMonthlyRevenue, useWeeklyTopCategory, useDailyTopItem } from '../../hooks/useAnalysis';
import { StatCard } from './statHelpers';
import { shekel } from './analysisUtils';
import styles from '../AnalysisDashboard.module.css';

/**
 * RevenueRow — three stat cards in one row:
 * monthly revenue, weekly top category, and daily top item.
 */
export default function RevenueRow() {
  const monthly      = useMonthlyRevenue();
  const weeklyTopCat = useWeeklyTopCategory();
  const dailyTopItem = useDailyTopItem();

  return (
    <div className={styles.row3}>

      <StatCard
        id="analysis-monthly-revenue"
        icon="💰"
        label="הכנסות החודש (30 יום)"
        value={monthly.data ? shekel(monthly.data.revenue) : '—'}
        accent="green"
        loading={monthly.isLoading}
        error={monthly.isError}
      />

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
  );
}
