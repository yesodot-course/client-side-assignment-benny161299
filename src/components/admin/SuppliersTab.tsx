import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SupplierForm, { type SupplierFormData } from '../SupplierForm';
import ConfirmDialog from './ConfirmDialog';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useRemoveItemFromSupplier,
} from '../../hooks/useSuppliers';
import type { ISupplier } from '../../interfaces';
import styles from '../../pages/AdminPage.module.css';

const RETAIL_MARKUP_FACTOR = 1.3;

export default function SuppliersTab() {
  const { t } = useTranslation();
  const { data: suppliers = [], isLoading, isError } = useSuppliers();
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const { mutateAsync: updateSupplier } = useUpdateSupplier();
  const { mutateAsync: deleteSupplier } = useDeleteSupplier();
  const { mutateAsync: removeItem } = useRemoveItemFromSupplier();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ISupplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ISupplier | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [removeItemTarget, setRemoveItemTarget] = useState<{ supplier: ISupplier; itemName: string } | null>(null);
  const [removingItem, setRemovingItem] = useState(false);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormSubmit = async (data: SupplierFormData) => {
    try {
      if (editTarget) {
        await updateSupplier({ id: editTarget._id, data });
        toast.success(t('common.success'));
      } else {
        await createSupplier(data);
        toast.success(t('common.success'));
      }
      setShowForm(false);
      setEditTarget(null);
    } catch {
      toast.error(t('errors.saving_failed'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget._id);
      toast.success(t('common.success'));
      setDeleteTarget(null);
    } catch {
      toast.error(t('errors.deleting_failed'));
    }
  };

  const handleRemoveItem = async () => {
    if (!removeItemTarget) return;
    setRemovingItem(true);
    try {
      await removeItem({
        supplierId: removeItemTarget.supplier._id,
        itemName: removeItemTarget.itemName,
      });
      toast.success(t('common.success'));
      setRemoveItemTarget(null);
    } catch {
      toast.error(t('errors.deleting_failed'));
    } finally {
      setRemovingItem(false);
    }
  };

  if (isError) return <p className={styles.errorMsg}>{t('errors.loading_failed')}</p>;

  return (
    <section className={styles.tabContent}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder={t('admin.suppliers.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.countLabel}>
            {t('admin.suppliers.count', { count: filtered.length })}
          </span>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(true)}>
          {t('admin.suppliers.new_btn')}
        </button>
      </div>

      {isLoading ? (
        <p className={styles.info}>{t('admin.suppliers.loading')}</p>
      ) : (
        <div className={styles.supplierGrid}>
          {filtered.map((sup) => {
            const expanded = expandedId === sup._id;
            return (
              <div key={sup._id} className={styles.supplierCard}>
                <div className={styles.supplierHeader}>
                  <div className={styles.supplierMeta}>
                    <span className={styles.supplierName}>{t('common.supplier_icon')} {sup.name}</span>
                    <span className={styles.supplierCount}>
                      {t('details.quantity')} {sup.items.length}
                    </span>
                  </div>
                  <div className={styles.supplierHeaderActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setEditTarget(sup);
                        setShowForm(true);
                      }}
                      title={t('common.edit')}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget(sup)}
                      title={t('common.delete')}
                    >
                      {t('common.remove_icon')}
                    </button>
                    <button
                      className={styles.toggleBtn}
                      onClick={() => setExpandedId(expanded ? null : sup._id)}
                      title={expanded ? t('common.collapse') : t('common.search')}
                    >
                      {expanded ? t('common.arrow_up') : t('common.arrow_down')}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className={styles.supplierItems}>
                    {sup.items.length === 0 ? (
                      <p className={styles.info}>{t('admin.suppliers.no_items')}</p>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>{t('admin.suppliers.table.item_name')}</th>
                            <th>{t('admin.suppliers.table.supplier_price')}</th>
                            <th>{t('admin.suppliers.table.min_retail')}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sup.items.map((si) => (
                            <tr key={si.itemName}>
                              <td>{si.itemName}</td>
                              <td>₪{si.supplierPrice.toFixed(2)}</td>
                              <td className={styles.minPrice}>
                                ₪{(si.supplierPrice * RETAIL_MARKUP_FACTOR).toFixed(2)}
                              </td>
                              <td>
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() => setRemoveItemTarget({ supplier: sup, itemName: si.itemName })}
                                  disabled={removingItem}
                                  title={t('admin.suppliers.remove_item')}
                                >
                                  {t('common.remove_icon')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>{editTarget ? t('common.edit') : t('admin.suppliers.new_btn')}</h3>
            <SupplierForm
              initialData={editTarget ? { name: editTarget.name } : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditTarget(null);
              }}
            />
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={t('admin.items.confirm_delete', { name: deleteTarget.name })}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {removeItemTarget && (
        <ConfirmDialog
          message={t('admin.items.confirm_delete', { name: removeItemTarget.itemName })}
          onConfirm={handleRemoveItem}
          onCancel={() => setRemoveItemTarget(null)}
        />
      )}
    </section>
  );
}
