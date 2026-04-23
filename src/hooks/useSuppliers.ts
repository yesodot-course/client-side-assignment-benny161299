import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllSuppliers,
  fetchSupplierById,
  createSupplier,
  deleteSupplier,
  addItemToSupplier,
  removeItemFromSupplier,
} from '../api/suppliers.api';

export const useSuppliers = () =>
  useQuery({ queryKey: ['suppliers'], queryFn: fetchAllSuppliers });

export const useSupplier = (id: string) =>
  useQuery({ queryKey: ['suppliers', id], queryFn: () => fetchSupplierById(id), enabled: !!id });

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['items'] }); // cascade delete מהשרת
    },
  });
};

export const useAddItemToSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, item }: { supplierId: string; item: { itemName: string; supplierPrice: number } }) =>
      addItemToSupplier(supplierId, item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useRemoveItemFromSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, itemName }: { supplierId: string; itemName: string }) =>
      removeItemFromSupplier(supplierId, itemName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['items'] }); // cascade delete מהשרת
    },
  });
};
