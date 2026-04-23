import { useQuery } from '@tanstack/react-query';
import {
  getMonthlyRevenue,
  getWeeklyTopCategory,
  getDailyTopItem,
  getProfitMargins,
  getTopSupplier,
  getSupplierSpend,
} from '../api/analysis.api';

export const useMonthlyRevenue = () =>
  useQuery({ queryKey: ['analysis', 'monthly-revenue'], queryFn: getMonthlyRevenue });

export const useWeeklyTopCategory = () =>
  useQuery({ queryKey: ['analysis', 'weekly-top-category'], queryFn: getWeeklyTopCategory });

export const useDailyTopItem = () =>
  useQuery({ queryKey: ['analysis', 'daily-top-item'], queryFn: getDailyTopItem });

export const useProfitMargins = () =>
  useQuery({ queryKey: ['analysis', 'profit-margins'], queryFn: getProfitMargins });

export const useTopSupplier = () =>
  useQuery({ queryKey: ['analysis', 'top-supplier'], queryFn: getTopSupplier });

export const useSupplierSpend = () =>
  useQuery({ queryKey: ['analysis', 'supplier-spend'], queryFn: getSupplierSpend });
