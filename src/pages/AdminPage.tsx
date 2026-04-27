import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ItemForm, { type ItemFormData } from '../components/ItemForm';
import SupplierForm from '../components/SupplierForm';
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '../hooks/useItems';
import {
  useSuppliers,
  useCreateSupplier,
  useDeleteSupplier,
  useAddItemToSupplier,
  useRemoveItemFromSupplier,
} from '../hooks/useSuppliers';
import type { IItem, ISupplier } from '../interfaces';
import styles from './AdminPage.module.css';

// ─── Tab type ──────────────────────────────────────────────────────────────────
type Tab = 'items' | 'suppliers';

// ─── Confirm dialog (inline) ──────────────────────────────────────────────────
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.confirmBox}>
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            ביטול
          </button>
          <button className={styles.dangerBtn} onClick={onConfirm}>
            🗑️ מחק
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Items Tab
// ══════════════════════════════════════════════════════════════════════════════
function ItemsTab() {
  const { data: items = [], isLoading, isError } = useItems();
  const { data: suppliers = [] } = useSuppliers();
  const { mutateAsync: createItem, isPending: creating } = useCreateItem();
  const { mutateAsync: updateItem, isPending: updating } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: deleting } = useDeleteItem();

  const [showForm, setShowForm]       = useState(false);
  const [editTarget, setEditTarget]   = useState<IItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IItem | null>(null);
  const [search, setSearch]           = useState('');

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
            image:  data.image  || null,
            description: data.description || null,
          },
        });
        toast.success('✅ הפריט עודכן בהצלחה');
      } else {
        await createItem({
          name: data.name,
          price: data.price,
          stock: data.stock,
          category: data.category,
          supplier: data.supplier,
          image:  data.image  || null,
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
      {/* Toolbar */}
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

      {/* Table */}
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

      {/* Modals */}
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

// ══════════════════════════════════════════════════════════════════════════════
// Suppliers Tab
// ══════════════════════════════════════════════════════════════════════════════
function SuppliersTab() {
  const { data: suppliers = [], isLoading, isError } = useSuppliers();
  const { mutateAsync: createSupplier,        isPending: creating  } = useCreateSupplier();
  const { mutateAsync: deleteSupplier,        isPending: deletingSup } = useDeleteSupplier();
  const { mutateAsync: addItemToSupplier,     isPending: addingItem  } = useAddItemToSupplier();
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
        itemName: removeItemTarget.itemName,
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
      {/* Toolbar */}
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

      {/* Supplier cards */}
      <div className={styles.supplierGrid}>
        {suppliers.map((sup) => {
          const expanded = expandedId === sup._id;
          return (
            <div key={sup._id} className={styles.supplierCard} id={`admin-supplier-${sup._id}`}>
              {/* Header */}
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

              {/* Expanded catalog items */}
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

      {/* Modals */}
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

// ══════════════════════════════════════════════════════════════════════════════
// AdminPage (root)
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('items');

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>⚙️ ממשק ניהול</h1>
          <p className={styles.pageSubtitle}>ניהול מוצרים וספקים של החנות</p>
        </header>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            id="admin-tab-items"
            role="tab"
            aria-selected={activeTab === 'items'}
            className={`${styles.tab} ${activeTab === 'items' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('items')}
          >
            📦 פריטים
          </button>
          <button
            id="admin-tab-suppliers"
            role="tab"
            aria-selected={activeTab === 'suppliers'}
            className={`${styles.tab} ${activeTab === 'suppliers' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            🏭 ספקים
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'items'     && <ItemsTab />}
        {activeTab === 'suppliers' && <SuppliersTab />}
      </main>
    </>
  );
}
