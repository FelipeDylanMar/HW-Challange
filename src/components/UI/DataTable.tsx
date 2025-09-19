import React from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';

/**
 * Configuração de coluna para a tabela
 * @template T - Tipo dos dados da linha
 */
export interface TableColumn<T = Record<string, unknown>> {
  /** Chave única da coluna */
  key: string;
  /** Rótulo exibido no cabeçalho */
  label: string;
  /** Se a coluna é ordenável */
  sortable?: boolean;
  /** Função personalizada para renderizar o valor da célula */
  render?: (value: unknown, item: T) => React.ReactNode;
  /** Classes CSS adicionais para a coluna */
  className?: string;
  /** Se a coluna deve ser ocultada em dispositivos móveis */
  mobileHidden?: boolean;
}

/**
 * Configuração de ordenação da tabela
 */
export interface SortConfig {
  /** Campo pelo qual ordenar */
  field: string;
  /** Direção da ordenação */
  direction: 'asc' | 'desc';
}

/**
 * Props do componente DataTable
 * @template T - Tipo dos dados das linhas
 */
interface DataTableProps<T = Record<string, unknown>> {
  /** Array de dados para exibir na tabela */
  data: T[];
  /** Configuração das colunas da tabela */
  columns: TableColumn<T>[];
  /** Se a tabela está em estado de carregamento */
  loading?: boolean;
  /** Mensagem exibida quando não há dados */
  emptyMessage?: string;
  /** Configuração atual de ordenação */
  sortConfig?: SortConfig;
  /** Callback chamado quando uma coluna é clicada para ordenação */
  onSort?: (field: string) => void;
  /** Callback chamado quando uma linha é clicada */
  onRowClick?: (item: T) => void;
  /** Classes CSS adicionais para a tabela */
  className?: string;
  /** Função personalizada para renderizar cards em dispositivos móveis */
  mobileCardRender?: (item: T) => React.ReactNode;
  /** Se deve mostrar cards em dispositivos móveis */
  showMobileCards?: boolean;
}

/**
 * Componente de tabela de dados responsiva e reutilizável
 * 
 * Características:
 * - Suporte a ordenação por colunas
 * - Renderização personalizada de células
 * - Layout responsivo com cards para mobile
 * - Estado de carregamento integrado
 * - Tratamento de dados vazios
 * - Eventos de clique em linhas
 * 
 * @template T - Tipo dos dados das linhas
 * @param props - Propriedades do componente
 * @returns Componente de tabela renderizado
 * 
 * @example
 * ```tsx
 * const columns: TableColumn<User>[] = [
 *   { key: 'name', label: 'Nome', sortable: true },
 *   { key: 'email', label: 'Email' },
 *   { 
 *     key: 'status', 
 *     label: 'Status',
 *     render: (value) => <StatusBadge variant={value} />
 *   }
 * ];
 * 
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   loading={isLoading}
 *   onSort={handleSort}
 *   onRowClick={handleRowClick}
 * />
 * ```
 */
const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage,
  sortConfig,
  onSort,
  onRowClick,
  className = "",
  mobileCardRender,
  showMobileCards = true
}: DataTableProps<T>) => {
  const { t } = useTranslation();
  
  const defaultEmptyMessage = emptyMessage || t('common.noItemsFound');

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (!sortConfig || sortConfig.field !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <LoadingSpinner size="lg" text={t('common.loading')} centered />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">{defaultEmptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="hidden md:block">
        <div className="table-responsive">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.className || ''} ${
                      column.key === 'actions' ? 'actions-column-header' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={column.key === 'actions' ? { minWidth: '120px' } : undefined}
                  >
                    <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => {
            if (!item) return null;
            
            return (
              <tr
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={(item as any)?.id || index}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-sm ${column.className || ''} ${
                        column.key === 'actions' ? 'actions-column' : ''
                      }`}
                      style={{ minWidth: column.key === 'actions' ? '120px' : 'auto' }}
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </td>
                  ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showMobileCards && (
        <div className="md:hidden space-y-4 p-4">
          {data.map((item, index) => {
            if (!item) return null;
            
            return (
              <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={(item as any)?.id || index}
                className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
                  onRowClick ? 'cursor-pointer hover:shadow-md' : ''
                }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
              {mobileCardRender ? (
                mobileCardRender(item)
              ) : (
                <div className="space-y-2">
                  {columns
                    .filter(col => !col.mobileHidden)
                    .map((column) => (
                      <div key={column.key} className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          {column.label}:
                        </span>
                        <span className="text-sm text-gray-900">
                          {column.render 
                            ? column.render(item[column.key], item)
                            : String(item[column.key] || '')
                          }
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DataTable;