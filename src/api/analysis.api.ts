import { apiClient } from './client';
import type {
  ApiResponse,
  IMonthlyRevenue,
  IWeeklyTopCategory,
  IDailyTopItem,
  IProfitMargins,
  ITopSupplier,
  ISupplierSpend,
} from '../interfaces';

export const getMonthlyRevenue = async (): Promise<IMonthlyRevenue> => {
  const res = await apiClient.get<ApiResponse<IMonthlyRevenue>>('/analysis/monthly-revenue');
  return res.data.data!;
};

export const getWeeklyTopCategory = async (): Promise<IWeeklyTopCategory> => {
  const res = await apiClient.get<ApiResponse<IWeeklyTopCategory>>('/analysis/weekly-top-category');
  return res.data.data!;
};

export const getDailyTopItem = async (): Promise<IDailyTopItem> => {
  const res = await apiClient.get<ApiResponse<IDailyTopItem>>('/analysis/daily-top-item');
  return res.data.data!;
};

export const getProfitMargins = async (): Promise<IProfitMargins> => {
  const res = await apiClient.get<ApiResponse<IProfitMargins>>('/analysis/profit-margins');
  return res.data.data!;
};

export const getTopSupplier = async (): Promise<ITopSupplier> => {
  const res = await apiClient.get<ApiResponse<ITopSupplier>>('/analysis/top-supplier');
  return res.data.data!;
};

export const getSupplierSpend = async (): Promise<ISupplierSpend[]> => {
  const res = await apiClient.get<ApiResponse<ISupplierSpend[]>>('/analysis/supplier-spend');
  return res.data.data!;
};
