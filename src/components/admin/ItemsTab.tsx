import { useState } from 'react';
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
  const { data: items = [], isLoading, isError } = useItems();
  const { data: suppliers = [] } = useSuppliers();
  const { mutateAsync: createItem, isPending: creating } = useCreateItem();
  const { mutateAsync: updateItem, isPending: updating } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: deleting } = useDeleteItem();

  const [showForm, setShowForm]         = useState(false);
  const [editTarget, setEditTarget]     = useState<IItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IItem | null>(null);
  const [search, setSearch]             = useState('');

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

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
        toast.success('✅ הפריט עודכן בהצלחה');
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
        toast.success('✅ פריט חדש נוצר בהצלחה');
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה בשמירת הפריט');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget._id);
      toast.success(`🗑️ "${deleteTarget.name}" נמחק`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'שגיאה במחיקת הפריט');
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
          placeholder="🔍 חפש פריט..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button
          id="admin-create-item-btn"
          className={styles.primaryBtn}
          onClick={() => { setEditTarget(null); setShowForm(true); }}
        >
          ➕ פריט חדש
        </button>
      </div>

      {isLoading && <p className={styles.info}>⏳ טוען פריטים...</p>}
      {isError   && <p className={styles.errorMsg}>❌ שגיאה בטעינת פריטים. וודא שהשרת פועל.</p>}

      {!isLoading && filtered.length === 0 && (
        <p className={styles.info}>לא נמצאו פריטים.</p>
      )}

   
      {filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>תמונה</th>
                <th>שם</th>
                <th>קטגוריה</th>
                <th>ספק</th>
                <th>מחיר ₪</th>
                <th>מלאי</th>
                <th>פעולות</th>
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
                    <span className={styles.itemName}>{item.name}</span>
                    {item.description && (
                      <span className={styles.itemDesc}>{item.description}</span>
                    )}
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
          message={`האם למחוק את "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
