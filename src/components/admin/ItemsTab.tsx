import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ItemForm, { type ItemFormData } from '../ItemForm';
import ConfirmDialog from './ConfirmDialog';
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '../../hooks/useItems';
import { useSuppliers } from '../../hooks/useSuppliers';
import type { IItem } from '../../interfaces';
import styles from '../../pages/AdminPage.module.css';


export default function ItemsTab() {
  const { t } = useTranslation();
  const { data: items = [], isLoading, isError } = useItems();
  const { data: suppliers = [] } = useSuppliers();
  const { mutateAsync: createItem, isPending: creating } = useCreateItem();
  const { mutateAsync: updateItem, isPending: updating } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: deleting } = useDeleteItem();

  const [showForm, setShowForm]         = useState(false);
  const [editTarget, setEditTarget]     = useState<IItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IItem | null>(null);
  const [search, setSearch]             = useState('');

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(lowerSearch) ||
        i.category.toLowerCase().includes(lowerSearch)
    );
  }, [items, search]);

  const handleFormSubmit = async (data: ItemFormData) => {
    try {
      if (editTarget) {
        await updateItem({
          id: editTarget._id,
          data: {
            price: data.price,
            stock: data.stock,
            category: data.category,
            image:       data.image       || null,
            description: data.description || null,
          },
        });
        toast.success(t('admin.items.update_success'));
      } else {
        await createItem({
          name:        data.name,
          price:       data.price,
          stock:       data.stock,
          category:    data.category,
          supplier:    data.supplier,
          image:       data.image       || null,
          description: data.description || null,
        });
        toast.success(t('admin.items.create_success'));
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('errors.saving_failed'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget._id);
      toast.success(t('common.deleted', { name: deleteTarget.name, defaultValue: 'נמחק' }));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('errors.deleting_failed'));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <section className={styles.tabContent}>
    
      <div className={styles.toolbar}>
        <input
          id="admin-items-search"
          type="text"
          placeholder={t('admin.items.search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button
          id="admin-create-item-btn"
          className={styles.primaryBtn}
          onClick={() => { setEditTarget(null); setShowForm(true); }}
        >
          {t('admin.items.new_btn')}
        </button>
      </div>

      {isLoading && <p className={styles.info}>{t('admin.items.loading')}</p>}
      {isError   && <p className={styles.errorMsg}>{t('errors.loading_failed')}</p>}

      {!isLoading && filtered.length === 0 && (
        <p className={styles.info}>{t('home.no_products')}</p>
      )}

   
      {filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.items.table.image')}</th>
                <th>{t('admin.items.table.name')}</th>
                <th>{t('admin.items.table.category')}</th>
                <th>{t('admin.items.table.supplier')}</th>
                <th>{t('admin.items.table.price')}</th>
                <th>{t('admin.items.table.stock')}</th>
                <th>{t('admin.items.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} id={`admin-item-row-${item._id}`}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className={styles.thumb} />
                    ) : (
                      <div className={styles.thumbPlaceholder}>📦</div>
                    )}
                  </td>
                  <td className={styles.nameCell}>
                    <div className={styles.nameWrapper}>
                      <span className={styles.itemName}>{item.name}</span>
                      {item.description && (
                        <span className={styles.itemDesc}>{item.description}</span>
                      )}
                    </div>
                  </td>
                  <td><span className={styles.badge}>{item.category}</span></td>
                  <td>{typeof item.supplier === 'object' ? item.supplier.name : '—'}</td>
                  <td className={styles.price}>₪{item.price.toFixed(2)}</td>
                  <td>
                    <span className={item.stock === 0 ? styles.outOfStock : styles.inStock}>
                      {item.stock}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsWrapper}>
                      <button
                        id={`admin-edit-item-${item._id}`}
                        className={styles.editBtn}
                        onClick={() => { setEditTarget(item); setShowForm(true); }}
                      >
                        ✏️
                      </button>
                      <button
                        id={`admin-delete-item-${item._id}`}
                        className={styles.deleteBtn}
                        onClick={() => setDeleteTarget(item)}
                        disabled={deleting}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

  
      {showForm && (
        <ItemForm
          suppliers={suppliers}
          initial={editTarget}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          isPending={creating || updating}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={t('admin.items.confirm_delete', { name: deleteTarget.name })}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
