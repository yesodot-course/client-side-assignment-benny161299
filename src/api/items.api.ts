import { apiClient } from './client';
import type { IItem, ApiResponse } from '../interfaces';

export const fetchAllItems = async (): Promise<IItem[]> => {
  const res = await apiClient.get<ApiResponse<IItem[]>>('/items');
  return res.data.data!;
};

export const fetchItemById = async (id: string): Promise<IItem> => {
  const res = await apiClient.get<ApiResponse<IItem>>(`/items/${id}`);
  return res.data.data!;
};

export const searchItems = async (params: Record<string, string>): Promise<IItem[]> => {
  const res = await apiClient.get<ApiResponse<IItem[]>>('/items/search', { params });
  return res.data.data!;
};

export const createItem = async (
  data: Omit<IItem, '_id' | 'createdAt' | 'updatedAt' | 'supplier'> & { supplier: string }
): Promise<IItem> => {
  const res = await apiClient.post<ApiResponse<IItem>>('/items', data);
  return res.data.data!;
};

export const updateItem = async (id: string, data: Partial<IItem>): Promise<IItem> => {
  const res = await apiClient.put<ApiResponse<IItem>>(`/items/${id}`, data);
  return res.data.data!;
};

export const deleteItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/items/${id}`);
};
