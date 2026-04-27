/** Format a number as ₪ currency string — safe against undefined/null */
export function shekel(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `₪${n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a number as percentage — safe against undefined/null */
export function pct(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}
