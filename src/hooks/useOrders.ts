import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../api/orders.api';
import type { CreateOrderPayload } from '../api/orders.api';

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] }); // stock מתעדכן בשרת
    },
  });
};
