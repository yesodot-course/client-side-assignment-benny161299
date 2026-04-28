import { useState } from 'react';
import type { ISupplier } from '../interfaces';
import styles from './SupplierForm.module.css';


interface CreateProps {
  mode: 'create';
  onSubmit: (name: string) => void;
  onClose: () => void;
  isPending: boolean;
}


interface AddItemProps {
  mode: 'add-item';
  supplier: ISupplier;
  onSubmit: (supplierId: string, itemName: string, supplierPrice: number) => void;
  onClose: () => void;
  isPending: boolean;
}

type Props = CreateProps | AddItemProps;

export default function SupplierForm(props: Props) {
  const { onClose, isPending } = props;


  const [newName, setNewName] = useState('');


  const [itemName, setItemName] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.mode === 'create') {
      props.onSubmit(newName.trim());
    } else {
      props.onSubmit(props.supplier._id, itemName.trim(), Number(supplierPrice));
    }
  };

  const isCreate = props.mode === 'create';
  const title    = isCreate ? '➕ ספק חדש' : `📦 הוסף פריט לספק "${(props as AddItemProps).supplier.name}"`;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="סגור">✕</button>
        <h2 className={styles.title}>{title}</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {isCreate ? (
            <div className={styles.field}>
              <label htmlFor="supplier-form-name">שם הספק *</label>
              <input
                id="supplier-form-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="שם הספק"
                required
                autoFocus
              />
            </div>
          ) : (
            <>
              <div className={styles.field}>
                <label htmlFor="supplier-item-name">שם הפריט *</label>
                <input
                  id="supplier-item-name"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="למשל: Samsung Galaxy S24"
                  required
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="supplier-item-price">מחיר ספק (₪) *</label>
                <input
                  id="supplier-item-price"
                  type="number"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(e.target.value)}
                  min={0.01}
                  step={0.01}
                  placeholder="0.00"
                  required
                />
                {supplierPrice && (
                  <span className={styles.hint}>
                    מחיר מינימום לחנות: ₪{(Number(supplierPrice) * 1.3).toFixed(2)}
                  </span>
                )}
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              ביטול
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || (isCreate ? !newName.trim() : (!itemName.trim() || !supplierPrice))}
            >
              {isPending ? 'שומר...' : '✅ שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
