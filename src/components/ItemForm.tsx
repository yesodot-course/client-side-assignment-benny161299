import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { IItem, ISupplier } from '../interfaces';
import { uploadToImgbb } from '../utils/imgbb';
import { RETAIL_MARKUP_FACTOR } from '../constants';
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
  supplier: string;    
  image: string;
  description: string;
}

export default function ItemForm({ suppliers, initial, onSubmit, onClose, isPending }: Props) {
  const { t } = useTranslation();
  const [name, setName]             = useState(initial?.name ?? '');
  const [price, setPrice]           = useState(initial?.price?.toString() ?? '');
  const [stock, setStock]           = useState(initial?.stock?.toString() ?? '');
  const [category, setCategory]     = useState(initial?.category ?? '');
  const [supplierId, setSupplierId] = useState(
    initial?.supplier ? (typeof initial.supplier === 'object' ? initial.supplier._id : initial.supplier) : ''
  );
  const [image, setImage]           = useState(initial?.image ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSupplier = suppliers.find((s) => s._id === supplierId);
  const supplierItemNames = selectedSupplier?.items.map((i) => i.itemName) ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadToImgbb(file);
      setImage(result.url);
    } catch (err) {
      setUploadError(t('errors.upload_failed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
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

  const isDirty = 
    name !== (initial?.name ?? '') ||
    price !== (initial?.price?.toString() ?? '') ||
    stock !== (initial?.stock?.toString() ?? '') ||
    category !== (initial?.category ?? '') ||
    description !== (initial?.description ?? '') ||
    supplierId !== (initial?.supplier ? (typeof initial.supplier === 'object' ? initial.supplier._id : initial.supplier) : '') ||
    image !== (initial?.image ?? '');

  const handleClose = () => {
    if (isDirty) {
      if (!window.confirm(t('admin.items.form.confirm_cancel'))) {
        return;
      }
    }
    onClose();
  };

  const isEdit = !!initial;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={handleClose} aria-label={t('common.click_to_close')}>✕</button>
        <h2 className={styles.title}>{isEdit ? t('admin.items.edit_title') : t('admin.items.new_title')}</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Supplier */}
          <div className={styles.field}>
            <label htmlFor="item-form-supplier">{t('admin.items.form.supplier_label')}</label>
            <select
              id="item-form-supplier"
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                if (!isEdit) setName('');
              }}
              required
              disabled={isEdit}   
            >
              <option value="">{t('admin.items.form.supplier_placeholder')}</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            {isEdit && (
              <span className={styles.hint}>{t('admin.items.form.supplier_edit_lock')}</span>
            )}
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label htmlFor="item-form-name">{t('admin.items.form.name_label')}</label>
            {supplierItemNames.length > 0 ? (
              <select
                id="item-form-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isEdit}
              >
                <option value="">{t('admin.items.form.name_select_placeholder')}</option>
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
                placeholder={supplierId ? t('admin.items.form.name_no_items') : t('admin.items.form.name_select_first')}
                required
                disabled={isEdit || !supplierId}
              />
            )}
            {!isEdit && supplierId && supplierItemNames.length > 0 && (
              <span className={styles.hint}>{t('admin.items.form.name_match_hint')}</span>
            )}
          </div>

          {/* Price */}
          <div className={styles.field}>
            <label htmlFor="item-form-price">{t('admin.items.form.price_label')}</label>
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
              const minP = (si.supplierPrice * RETAIL_MARKUP_FACTOR).toFixed(2);
              return (
                <span className={styles.hint}>
                  {t('admin.items.form.price_min_hint', { min: minP, factor: RETAIL_MARKUP_FACTOR })}
                </span>
              );
            })()}
          </div>

          {/* Stock */}
          <div className={styles.field}>
            <label htmlFor="item-form-stock">{t('admin.items.form.stock_label')}</label>
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
            <label htmlFor="item-form-category">{t('admin.items.form.category_label')}</label>
            <input
              id="item-form-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t('admin.items.form.category_placeholder')}
              required
            />
          </div>

          {/* Image */}
          <div className={styles.field}>
            <label>{t('admin.items.form.image_label')}</label>
            <div className={styles.imageRow}>
              <input
                id="item-form-image"
                type="text"
                value={image}
                onChange={(e) => { setImage(e.target.value); setUploadError(''); }}
                placeholder={t('admin.items.form.image_placeholder')}
                className={styles.imageUrlInput}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title={t('admin.items.form.upload_title')}
              >
                {uploading ? t('common.loading_icon') : `${t('common.upload_icon')} ${t('admin.items.form.upload_btn')}`}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadError && <span className={styles.errorHint}>{uploadError}</span>}
            {uploading  && <p className={styles.hint}>{t('admin.items.form.uploading_cloud')}</p>}
            {image && !uploading && (
              <img
                src={image}
                alt={t('admin.items.form.image_preview')}
                className={styles.imagePreview}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="item-form-description">{t('admin.items.form.desc_label')}</label>
            <textarea
              id="item-form-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t('admin.items.form.desc_placeholder')}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || uploading || !supplierId || !name || !price || !stock || !category}
            >
              {isPending ? t('admin.items.form.submit_saving') : isEdit ? t('admin.items.form.submit_save') : t('admin.items.form.submit_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
