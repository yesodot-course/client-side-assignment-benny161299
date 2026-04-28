import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, fetchAllOrders } from '../api/orders.api';
import type { CreateOrderPayload } from '../api/orders.api';

export const useOrders = () =>
  useQuery({ queryKey: ['orders'], queryFn: fetchAllOrders });


export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
   
      qc.invalidateQueries({ queryKey: ['items'] });
      qc.invalidateQueries({ queryKey: ['analysis'] });
    },
  });
};
