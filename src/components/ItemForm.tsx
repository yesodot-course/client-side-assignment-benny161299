import { useState, useEffect } from 'react';
import type { IItem, ISupplier } from '../interfaces';
import styles from './ItemForm.module.css';

interface Props {
  suppliers: ISupplier[];
  initial?: IItem | null;
  onSubmit: (data: ItemFormData) => void;
  onClose: () => void;
  isPending: boolean;
}

export interface ItemFormData {
  name: string;
  price: number;
  stock: number;
  category: string;
  supplier: string;      // supplier _id
  image: string;
  description: string;
}

export default function ItemForm({ suppliers, initial, onSubmit, onClose, isPending }: Props) {
  const [name, setName]             = useState(initial?.name ?? '');
  const [price, setPrice]           = useState(initial?.price?.toString() ?? '');
  const [stock, setStock]           = useState(initial?.stock?.toString() ?? '');
  const [category, setCategory]     = useState(initial?.category ?? '');
  const [supplierId, setSupplierId] = useState(
    initial?.supplier ? (typeof initial.supplier === 'object' ? initial.supplier._id : initial.supplier) : ''
  );
  const [image, setImage]           = useState(initial?.image ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');

  // when supplier changes reset name to first matching supplierItem (UX hint)
  const selectedSupplier = suppliers.find((s) => s._id === supplierId);
  const supplierItemNames = selectedSupplier?.items.map((i) => i.itemName) ?? [];

  useEffect(() => {
    // if edit mode — keep existing name; otherwise clear when supplier changes
    if (!initial) setName('');
  }, [supplierId, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      supplier: supplierId,
      image: image.trim(),
      description: description.trim(),
    });
  };

  const isEdit = !!initial;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="סגור">✕</button>
        <h2 className={styles.title}>{isEdit ? '✏️ עריכת פריט' : '➕ פריט חדש'}</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Supplier (must choose first) */}
          <div className={styles.field}>
            <label htmlFor="item-form-supplier">ספק *</label>
            <select
              id="item-form-supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              disabled={isEdit}   // cannot change supplier on edit
            >
              <option value="">— בחר ספק —</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            {isEdit && (
              <span className={styles.hint}>לא ניתן לשנות ספק בעריכה</span>
            )}
          </div>

          {/* Name — must match supplier item name */}
          <div className={styles.field}>
            <label htmlFor="item-form-name">שם פריט *</label>
            {supplierItemNames.length > 0 ? (
              <select
                id="item-form-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isEdit}
              >
                <option value="">— בחר שם פריט —</option>
                {supplierItemNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <input
                id="item-form-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={supplierId ? 'הספק אין לו פריטים רשומים' : 'בחר ספק תחילה'}
                required
                disabled={isEdit || !supplierId}
              />
            )}
            {!isEdit && supplierId && supplierItemNames.length > 0 && (
              <span className={styles.hint}>השם חייב להיות זהה לשם פריט אצל הספק</span>
            )}
          </div>

          {/* Price */}
          <div className={styles.field}>
            <label htmlFor="item-form-price">מחיר (₪) *</label>
            <input
              id="item-form-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              required
            />
            {selectedSupplier && name && (() => {
              const si = selectedSupplier.items.find((i) => i.itemName === name);
              if (!si) return null;
              const minP = (si.supplierPrice * 1.3).toFixed(2);
              return <span className={styles.hint}>מינימום: ₪{minP} (מחיר ספק × 1.3)</span>;
            })()}
          </div>

          {/* Stock */}
          <div className={styles.field}>
            <label htmlFor="item-form-stock">כמות במלאי *</label>
            <input
              id="item-form-stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min={0}
              placeholder="0"
              required
            />
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label htmlFor="item-form-category">קטגוריה *</label>
            <input
              id="item-form-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="למשל: אלקטרוניקה"
              required
            />
          </div>

          {/* Image URL (optional) */}
          <div className={styles.field}>
            <label htmlFor="item-form-image">קישור לתמונה (אופציונלי)</label>
            <input
              id="item-form-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Description (optional) */}
          <div className={styles.field}>
            <label htmlFor="item-form-description">תיאור (אופציונלי)</label>
            <textarea
              id="item-form-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="תיאור קצר של המוצר..."
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              ביטול
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || !supplierId || !name || !price || !stock || !category}
            >
              {isPending ? 'שומר...' : isEdit ? '💾 שמור שינויים' : '✅ צור פריט'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
