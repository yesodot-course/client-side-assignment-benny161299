import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllItems,
  fetchItemById,
  searchItems,
  createItem,
  updateItem,
  deleteItem,
} from '../api/items.api';
import type { IItem } from '../interfaces';

export const useItems = () =>
  useQuery({ queryKey: ['items'], queryFn: fetchAllItems });

export const useItem = (id: string) =>
  useQuery({ queryKey: ['items', id], queryFn: () => fetchItemById(id), enabled: !!id });

export const useSearchItems = (params: Record<string, string>) =>
  useQuery({
    queryKey: ['items', 'search', params],
    queryFn: () => searchItems(params),
    enabled: Object.values(params).some((v) => !!v),
  });

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
};

export const useUpdateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IItem> }) => updateItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
};

export const useDeleteItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
};
