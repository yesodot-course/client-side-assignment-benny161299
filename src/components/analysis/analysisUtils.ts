export function shekel(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `₪${n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function pct(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}
