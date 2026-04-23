import { apiClient } from './client';
import type { ISupplier, ApiResponse } from '../interfaces';

export const fetchAllSuppliers = async (): Promise<ISupplier[]> => {
  const res = await apiClient.get<ApiResponse<ISupplier[]>>('/suppliers');
  return res.data.data!;
};

export const fetchSupplierById = async (id: string): Promise<ISupplier> => {
  const res = await apiClient.get<ApiResponse<ISupplier>>(`/suppliers/${id}`);
  return res.data.data!;
};

export const createSupplier = async (data: { name: string }): Promise<ISupplier> => {
  const res = await apiClient.post<ApiResponse<ISupplier>>('/suppliers', data);
  return res.data.data!;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await apiClient.delete(`/suppliers/${id}`);
};

export const addItemToSupplier = async (
  supplierId: string,
  item: { itemName: string; supplierPrice: number }
): Promise<ISupplier> => {
  const res = await apiClient.post<ApiResponse<ISupplier>>(`/suppliers/${supplierId}/items`, item);
  return res.data.data!;
};

export const removeItemFromSupplier = async (
  supplierId: string,
  itemName: string
): Promise<ISupplier> => {
  const res = await apiClient.delete<ApiResponse<ISupplier>>(`/suppliers/${supplierId}/items`, {
    data: { itemName },
  });
  return res.data.data!;
};
