import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SearchBar, 
  FilterBar, 
  DataTable, 
  LoadingSpinner, 
  EmptyState,
  Alert,
  Pagination,
  type FilterConfig,
  type TableColumn
} from './';

export interface DataListConfig<T> {
  searchFields: (keyof T)[];
  filterConfigs: FilterConfig[];
  columns: TableColumn<T>[];
  emptyState: {
    title: string;
    description: string;
    suggestions?: string[];
  };
  mobileCardRender?: (item: T) => React.ReactNode;
}

export interface DataListProps<T> {
  data: T[];
  config: DataListConfig<T>;
  onItemSelect?: (item: T) => void;
  onItemDelete?: (itemId: string) => void;
  onItemUpdate?: (item: T) => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
  storageKey?: string;
  className?: string;
  itemsPerPage?: number;
  enablePagination?: boolean;
}

interface DataListState {
  searchTerm: string;
  filters: Record<string, string | string[]>;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
  currentPage: number;
}

function DataList<T extends { id: string }>({
  data,
  config,
  onItemSelect,
  isLoading = false,
  error = null,
  successMessage = null,
  onRetry,
  onDismissError,
  onDismissSuccess,
  storageKey,
  className = '',
  itemsPerPage = 50,
  enablePagination = true
}: DataListProps<T>) {
  const { t } = useTranslation();

  const loadFromStorage = (): DataListState => {
    if (!storageKey) {
      return {
        searchTerm: '',
        filters: {} as Record<string, string | string[]>,
        sortConfig: { field: 'createdAt', direction: 'desc' },
        currentPage: 1
      };
    }

    try {
      const savedSearchTerm = localStorage.getItem(`${storageKey}-search-term`) || '';
      const savedFilters = JSON.parse(localStorage.getItem(`${storageKey}-filters`) || '{}') as Record<string, string | string[]>;
      const savedSortConfig = JSON.parse(localStorage.getItem(`${storageKey}-sort-config`) || '{"field":"createdAt","direction":"desc"}');
      const savedCurrentPage = parseInt(localStorage.getItem(`${storageKey}-current-page`) || '1', 10);

      return {
        searchTerm: savedSearchTerm,
        filters: savedFilters,
        sortConfig: savedSortConfig,
        currentPage: savedCurrentPage
      };
    } catch (error) {
      console.warn(t('messages.errorLoadingFromStorage'), error);
      return {
        searchTerm: '',
        filters: {} as Record<string, string | string[]>,
        sortConfig: { field: 'createdAt', direction: 'desc' },
        currentPage: 1
      };
    }
  };

  const initialState = loadFromStorage();
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm);
  const [filters, setFilters] = useState<Record<string, string | string[]>>(initialState.filters);
  const [sortConfig, setSortConfig] = useState(initialState.sortConfig);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);

  useEffect(() => {
    if (!storageKey) return;

    try {
      localStorage.setItem(`${storageKey}-search-term`, searchTerm);
      localStorage.setItem(`${storageKey}-filters`, JSON.stringify(filters));
      localStorage.setItem(`${storageKey}-sort-config`, JSON.stringify(sortConfig));
      localStorage.setItem(`${storageKey}-current-page`, currentPage.toString());
    } catch (error) {
      console.warn(t('messages.errorSavingToStorage'), error);
    }
  }, [searchTerm, filters, sortConfig, currentPage, storageKey, t]);

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      // Primeiro, verifica se o item é válido
      if (!item || typeof item !== 'object' || !item.id) {
        return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = config.searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      for (const [key, value] of Object.entries(filters)) {
        if (value && Array.isArray(value) && value.length > 0) {
          const itemValue = item[key as keyof T];
          if (!value.includes(String(itemValue))) return false;
        } else if (value && !Array.isArray(value)) {
          const itemValue = item[key as keyof T];
          if (String(itemValue) !== value) return false;
        }
      }

      return true;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field as keyof T];
      const bValue = b[sortConfig.field as keyof T];

      if (aValue !== undefined && bValue !== undefined) {
        // Convert to string for comparison to handle different types
        const aStr = String(aValue);
        const bStr = String(bValue);
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [data, searchTerm, filters, sortConfig, config.searchFields]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return filteredAndSortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, itemsPerPage, enablePagination]);

  const totalPages = useMemo(() => {
    if (!enablePagination) return 1;
    return Math.ceil(filteredAndSortedData.length / itemsPerPage);
  }, [filteredAndSortedData.length, itemsPerPage, enablePagination]);

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters or search term change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);



  const enhancedColumns = config.columns.map(column => {
    if (column.key === 'actions' || column.render) {
      return {
        ...column,
        render: column.render ? (value: unknown, item: T) => {
          const originalRender = column.render!(value, item);
          
          if (column.key === 'actions' && React.isValidElement(originalRender)) {
            // Return the original render without modifications for now
            return originalRender;
          }
          
          return originalRender;
        } : undefined
      };
    }
    return column;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <Alert
          variant="error"
          message={error}
          onRetry={onRetry}
          onDismiss={onDismissError || (() => {})}
        />
      )}

      {successMessage && (
        <Alert
          variant="success"
          message={successMessage}
          onDismiss={onDismissSuccess || (() => {})}
        />
      )}

      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`${t('common.search')}...`}
          disabled={isLoading}
        />

        <FilterBar
          filters={config.filterConfigs}
          values={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text={t('common.loading')} centered />
      ) : filteredAndSortedData.length === 0 ? (
        <EmptyState
          title={config.emptyState.title}
          description={config.emptyState.description}
          suggestions={config.emptyState.suggestions}
        />
      ) : (
        <>
          <DataTable
            data={paginatedData}
            columns={enhancedColumns}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={onItemSelect}
            mobileCardRender={config.mobileCardRender}
          />
          
          {enablePagination && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DataList;