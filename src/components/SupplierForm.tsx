import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SupplierForm.module.css';

export interface SupplierFormData {
  name: string;
}

interface Props {
  initialData?: SupplierFormData;
  onSubmit: (data: SupplierFormData) => void;
  onCancel: () => void;
}

export default function SupplierForm({ initialData, onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialData?.name || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="supplier-name">{t('admin.suppliers.name_label')}</label>
        <input
          id="supplier-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('admin.suppliers.name_placeholder')}
          required
          autoFocus
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!name.trim()}
        >
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}
