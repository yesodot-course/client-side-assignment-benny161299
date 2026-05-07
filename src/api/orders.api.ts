import { apiClient } from './client.api';
import type { IOrder, IOrderItem, ApiResponse } from '../interfaces';


export interface CreateOrderPayload {
  items: IOrderItem[];
  address: string;
}

export const createOrder = async (data: CreateOrderPayload): Promise<IOrder> => {
  const res = await apiClient.post<ApiResponse<IOrder>>('/orders', data);
  return res.data.data!;
};

export const fetchAllOrders = async (): Promise<IOrder[]> => {
  const res = await apiClient.get<ApiResponse<IOrder[]>>('/orders');
  return res.data.data!;
};

export const fetchOrderById = async (id: string): Promise<IOrder> => {
  const res = await apiClient.get<ApiResponse<IOrder>>(`/orders/${id}`);
  return res.data.data!;
};
