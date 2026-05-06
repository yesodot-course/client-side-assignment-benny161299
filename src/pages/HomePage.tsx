import { useState, useEffect } from 'react';
import { useItems } from '../hooks/useItems';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSearchItems } from '../hooks/useItems';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import type { IItem } from '../interfaces';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [filterActive, setFilterActive] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data: allItems = [], isLoading: loadingItems, isError: errorItems } = useItems();
  const { data: suppliers = [] } = useSuppliers();
  const { data: searchResults, isFetching: searching } = useSearchItems(
    debouncedSearch ? { name: debouncedSearch } : {}
  );


  const displayedItems = debouncedSearch
    ? (searchResults ?? [])
    : filterActive
    ? filteredItems
    : allItems;

  const handleFilter = (filtered: IItem[]) => {
    setFilteredItems(filtered);
    setFilterActive(true);
  };

  return (
    <>
      <Navbar />

      {/* Search bar */}
      <div className={styles.searchWrap}>
        <input
          id="home-search"
          type="text"
          placeholder={t('home.search_placeholder')}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setFilterActive(false); }}
          className={styles.searchInput}
        />
        {searching && <span className={styles.searchSpinner}>⏳</span>}
      </div>

      {/* Filter bar — hidden while searching */}
      {!debouncedSearch && (
        <FilterBar items={allItems} suppliers={suppliers} onFilter={handleFilter} />
      )}

      <main className={styles.main}>
        <h1 className={styles.title}>
          {debouncedSearch
            ? t('home.results_for', { query: debouncedSearch, count: displayedItems.length })
            : t('home.all_products', { count: displayedItems.length })}
        </h1>

        {loadingItems && <p className={styles.info}>{t('home.loading_products')}</p>}
        {errorItems  && <p className={styles.error}>{t('errors.loading_failed')}</p>}

        {!loadingItems && displayedItems.length === 0 && (
          <p className={styles.info}>{t('home.no_products')}</p>
        )}

        <div className={styles.grid}>
          {displayedItems.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}
