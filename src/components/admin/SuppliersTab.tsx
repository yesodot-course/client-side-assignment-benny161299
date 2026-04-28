import { useState } from 'react';
import { toast } from 'react-toastify';
import SupplierForm from '../SupplierForm';
import ConfirmDialog from './ConfirmDialog';
import {
  useSuppliers,
  useCreateSupplier,
  useDeleteSupplier,
  useAddItemToSupplier,
  useRemoveItemFromSupplier,
} from '../../hooks/useSuppliers';
import type { ISupplier } from '../../interfaces';
import styles from '../../pages/AdminPage.module.css';


export default function SuppliersTab() {
  const { data: suppliers = [], isLoading, isError } = useSuppliers();
  const { mutateAsync: createSupplier,         isPending: creating    } = useCreateSupplier();
  const { mutateAsync: deleteSupplier,         isPending: deletingSup } = useDeleteSupplier();
  const { mutateAsync: addItemToSupplier,      isPending: addingItem  } = useAddItemToSupplier();
  const { mutateAsync: removeItemFromSupplier, isPending: removingItem } = useRemoveItemFromSupplier();

  const [showCreateForm, setShowCreateForm]     = useState(false);
  const [addItemTarget, setAddItemTarget]       = useState<ISupplier | null>(null);
  const [deleteTarget, setDeleteTarget]         = useState<ISupplier | null>(null);
  const [removeItemTarget, setRemoveItemTarget] = useState<{ supplier: ISupplier; itemName: string } | null>(null);
  const [expandedId, setExpandedId]             = useState<string | null>(null);

  const handleCreateSupplier = async (name: string) => {
    try {
      await createSupplier({ name });
      toast.success(`✅ ספק "${name}" נוצר בהצלחה`);
      setShowCreateForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה ביצירת הספק');
    }
  };

  const handleDeleteSupplier = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget._id);
      toast.success(`🗑️ ספק "${deleteTarget.name}" ו-פריטיו נמחקו`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה במחיקת הספק');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAddItem = async (supplierId: string, itemName: string, supplierPrice: number) => {
    try {
      await addItemToSupplier({ supplierId, item: { itemName, supplierPrice } });
      toast.success(`✅ "${itemName}" נוסף לספק`);
      setAddItemTarget(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה בהוספת פריט לספק');
    }
  };

  const handleRemoveItem = async () => {
    if (!removeItemTarget) return;
    try {
      await removeItemFromSupplier({
        supplierId: removeItemTarget.supplier._id,
        itemName:   removeItemTarget.itemName,
      });
      toast.success(`🗑️ "${removeItemTarget.itemName}" הוסר מהספק`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה בהסרת הפריט');
    } finally {
      setRemoveItemTarget(null);
    }
  };

  return (
    <section className={styles.tabContent}>
    
      <div className={styles.toolbar}>
        <span className={styles.countLabel}>{suppliers.length} ספקים</span>
        <button
          id="admin-create-supplier-btn"
          className={styles.primaryBtn}
          onClick={() => setShowCreateForm(true)}
        >
          ➕ ספק חדש
        </button>
      </div>

      {isLoading && <p className={styles.info}>⏳ טוען ספקים...</p>}
      {isError   && <p className={styles.errorMsg}>❌ שגיאה בטעינת ספקים.</p>}

      {!isLoading && suppliers.length === 0 && (
        <p className={styles.info}>לא נמצאו ספקים.</p>
      )}

  
      <div className={styles.supplierGrid}>
        {suppliers.map((sup) => {
          const expanded = expandedId === sup._id;
          return (
            <div key={sup._id} className={styles.supplierCard} id={`admin-supplier-${sup._id}`}>
         
              <div className={styles.supplierHeader}>
                <div className={styles.supplierMeta}>
                  <span className={styles.supplierName}>{sup.name}</span>
                  <span className={styles.supplierCount}>{sup.items.length} פריטים בקטלוג</span>
                </div>
                <div className={styles.supplierHeaderActions}>
                  <button
                    className={styles.toggleBtn}
                    onClick={() => setExpandedId(expanded ? null : sup._id)}
                    title={expanded ? 'כווץ' : 'הרחב'}
                  >
                    {expanded ? '▲' : '▼'}
                  </button>
                  <button
                    id={`admin-add-item-sup-${sup._id}`}
                    className={styles.editBtn}
                    onClick={() => setAddItemTarget(sup)}
                    title="הוסף פריט לספק"
                  >
                    ➕
                  </button>
                  <button
                    id={`admin-delete-sup-${sup._id}`}
                    className={styles.deleteBtn}
                    onClick={() => setDeleteTarget(sup)}
                    disabled={deletingSup}
                    title="מחק ספק"
                  >
                    🗑️
                  </button>
                </div>
              </div>

         
              {expanded && (
                <div className={styles.supplierItems}>
                  {sup.items.length === 0 ? (
                    <p className={styles.info}>אין פריטים בקטלוג</p>
                  ) : (
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>שם פריט</th>
                          <th>מחיר ספק ₪</th>
                          <th>מינ׳ קמעוני ₪</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sup.items.map((si) => (
                          <tr key={si.itemName}>
                            <td>{si.itemName}</td>
                            <td>₪{si.supplierPrice.toFixed(2)}</td>
                            <td className={styles.minPrice}>
                              ₪{(si.supplierPrice * 1.3).toFixed(2)}
                            </td>
                            <td>
                              <button
                                id={`admin-remove-sup-item-${sup._id}-${si.itemName}`}
                                className={styles.deleteBtn}
                                onClick={() => setRemoveItemTarget({ supplier: sup, itemName: si.itemName })}
                                disabled={removingItem}
                                title="הסר מהקטלוג"
                              >
                                🗑️
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


      {showCreateForm && (
        <SupplierForm
          mode="create"
          onSubmit={handleCreateSupplier}
          onClose={() => setShowCreateForm(false)}
          isPending={creating}
        />
      )}

      {addItemTarget && (
        <SupplierForm
          mode="add-item"
          supplier={addItemTarget}
          onSubmit={handleAddItem}
          onClose={() => setAddItemTarget(null)}
          isPending={addingItem}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`האם למחוק את ספק "${deleteTarget.name}"? כל פריטי החנות שלו יימחקו אוטומטית!`}
          onConfirm={handleDeleteSupplier}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {removeItemTarget && (
        <ConfirmDialog
          message={`האם להסיר "${removeItemTarget.itemName}" מקטלוג הספק? פריטי החנות המקושרים יימחקו!`}
          onConfirm={handleRemoveItem}
          onCancel={() => setRemoveItemTarget(null)}
        />
      )}
    </section>
  );
}
