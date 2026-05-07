import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { IItem, ISupplier } from '../interfaces';
import styles from './FilterBar.module.css';

interface Props {
  items: IItem[];
  suppliers: ISupplier[];
  onFilter: (filtered: IItem[]) => void;
}

export default function FilterBar({ items, suppliers, onFilter }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category))].sort(),
    [items]
  );

  const apply = (
    cat: string, sup: string, min: string, max: string, sort: string
  ) => {
    let result = [...items];

    if (cat)  result = result.filter((i) => i.category === cat);
    if (sup)  result = result.filter((i) =>
      (typeof i.supplier === 'object' ? i.supplier._id : i.supplier) === sup
    );
    if (min)  result = result.filter((i) => i.price >= Number(min));
    if (max)  result = result.filter((i) => i.price <= Number(max));

    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'name-asc')   result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc')  result.sort((a, b) => b.name.localeCompare(a.name));

    onFilter(result);
  };

  const update = (
    cat = category, sup = supplierId,
    min = minPrice, max = maxPrice, sort = sortBy
  ) => {
    setCategory(cat); setSupplierId(sup);
    setMinPrice(min); setMaxPrice(max); setSortBy(sort);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      apply(category, supplierId, minPrice, maxPrice, sortBy);
    }, 300);

    return () => clearTimeout(timer);
  }, [category, supplierId, minPrice, maxPrice, sortBy, items]);

  const reset = () => {
    setCategory(''); setSupplierId('');
    setMinPrice(''); setMaxPrice(''); setSortBy('');
    onFilter(items);
  };

  return (
    <div className={styles.bar}>
      <select id="filter-category" value={category}
        onChange={(e) => update(e.target.value)}>
        <option value="">{t('filter.all_categories')}</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select id="filter-supplier" value={supplierId}
        onChange={(e) => update(undefined, e.target.value)}>
        <option value="">{t('filter.all_suppliers')}</option>
        {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      <input id="filter-min-price" type="number" placeholder={t('filter.min_price')}
        value={minPrice} min={0}
        onChange={(e) => update(undefined, undefined, e.target.value)} />

      <input id="filter-max-price" type="number" placeholder={t('filter.max_price')}
        value={maxPrice} min={0}
        onChange={(e) => update(undefined, undefined, undefined, e.target.value)} />

      <select id="filter-sort" value={sortBy}
        onChange={(e) => update(undefined, undefined, undefined, undefined, e.target.value)}>
        <option value="">{t('filter.sort')}</option>
        <option value="price-asc">{t('filter.price_asc')}</option>
        <option value="price-desc">{t('filter.price_desc')}</option>
        <option value="name-asc">{t('filter.name_asc')}</option>
        <option value="name-desc">{t('filter.name_desc')}</option>
      </select>

      <button id="filter-reset" onClick={reset} className={styles.reset}>{t('filter.reset')}</button>
    </div>
  );
}
