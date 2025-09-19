import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from './Select';
import Button from './Button';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string | string[]>;
  onChange: (key: string, value: string | string[]) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onClear,
  disabled = false,
  className = "",
  showClearButton = true
}) => {
  const { t } = useTranslation();
  
  const hasActiveFilters = Object.values(values).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ""
  );

  const activeFiltersCount = Object.values(values).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value !== "" && value !== undefined ? 1 : 0);
  }, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filters.map((filter) => {
          const currentValue = values[filter.key];
          const hasValue = Array.isArray(currentValue) 
            ? currentValue.length > 0 
            : currentValue !== "" && currentValue !== undefined;
          
          return (
            <Select
              key={filter.key}
              label={filter.label}
              placeholder={filter.placeholder}
              options={filter.options}
              value={values[filter.key] as string || ""}
              hasValue={hasValue}
              onChange={(e) => {
                if (filter.multiple) {
                  const currentValues = (values[filter.key] as string[]) || [];
                  const newValue = e.target.value;
                  if (newValue && !currentValues.includes(newValue)) {
                    onChange(filter.key, [...currentValues, newValue]);
                  }
                } else {
                  onChange(filter.key, e.target.value);
                }
              }}
              disabled={disabled}
            />
          );
        })}
        
        {showClearButton && hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="secondary"
              size="md"
              onClick={onClear}
              disabled={disabled}
              className="w-full bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                  {activeFiltersCount}
                </span>
                {t('common.clearFilters')}
              </span>
            </Button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {t('common.appliedFilters')} ({activeFiltersCount})
            </h3>
            <button
              onClick={onClear}
              disabled={disabled}
              className="text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
            >
              {t('common.clearAll')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(values).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;

              const valuesToShow = Array.isArray(value) ? value : [value];
              
              return valuesToShow.map((val) => {
                const option = filter.options.find(opt => opt.value === val);
                if (!option) return null;

                return (
                  <span
                    key={`${key}-${val}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-blue-300 text-blue-800 shadow-sm"
                  >
                    <span className="text-xs text-blue-600 mr-1">{filter.label}:</span>
                    {option.label}
                    <button
                      onClick={() => {
                        if (Array.isArray(value)) {
                          onChange(key, value.filter(v => v !== val));
                        } else {
                          onChange(key, "");
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                      disabled={disabled}
                      title={t('common.removeFilter')}
                    >
                      ×
                    </button>
                  </span>
                );
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;