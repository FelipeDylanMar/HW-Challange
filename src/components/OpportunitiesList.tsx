import React, { useState, useMemo, useEffect } from 'react';
import type { Opportunity, OpportunityFilters, SortConfig } from '../types/crm';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  onOpportunitySelect?: (opportunity: Opportunity) => void;
  onOpportunityUpdate?: (opportunity: Opportunity) => void;
  onOpportunityDelete?: (opportunityId: string) => void;
}

const OpportunitiesList: React.FC<OpportunitiesListProps> = ({ 
  opportunities, 
  onOpportunitySelect, 
  onOpportunityDelete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastFailedAction, setLastFailedAction] = useState<(() => void) | null>(null);


  const loadFromStorage = () => {
    try {
      const savedSearchTerm = localStorage.getItem('opportunities-search-term');
      const savedFilters = localStorage.getItem('opportunities-filters');
      const savedSortConfig = localStorage.getItem('opportunities-sort-config');
      
      return {
        searchTerm: savedSearchTerm || '',
        filters: savedFilters ? JSON.parse(savedFilters) : {},
        sortConfig: savedSortConfig ? JSON.parse(savedSortConfig) : { field: 'createdAt', direction: 'desc' }
      };
    } catch (error) {
      console.warn('Erro ao carregar dados do localStorage:', error);
      return {
        searchTerm: '',
        filters: {},
        sortConfig: { field: 'createdAt', direction: 'desc' }
      };
    }
  };

  const initialState = loadFromStorage();
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm);
  const [filters, setFilters] = useState<OpportunityFilters>(initialState.filters);
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialState.sortConfig);


  useEffect(() => {
    try {
      localStorage.setItem('opportunities-search-term', searchTerm);
    } catch (error) {
      console.warn('Erro ao salvar termo de busca no localStorage:', error);
    }
  }, [searchTerm]);

  useEffect(() => {
    try {
      localStorage.setItem('opportunities-filters', JSON.stringify(filters));
    } catch (error) {
      console.warn('Erro ao salvar filtros no localStorage:', error);
    }
  }, [filters]);

  useEffect(() => {
    try {
      localStorage.setItem('opportunities-sort-config', JSON.stringify(sortConfig));
    } catch (error) {
      console.warn('Erro ao salvar configuração de ordenação no localStorage:', error);
    }
  }, [sortConfig]);

  const filteredAndSortedOpportunities = useMemo(() => {
    const filtered = opportunities.filter(opportunity => {

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          opportunity.name.toLowerCase().includes(searchLower) ||
          opportunity.accountName.toLowerCase().includes(searchLower) ||
          (opportunity.description && opportunity.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }


      if (filters.stage && filters.stage.length > 0) {
        if (!filters.stage.includes(opportunity.stage)) return false;
      }


      if (filters.valueRange && opportunity.amount) {
        const [min, max] = filters.valueRange;
        if (opportunity.amount < min || opportunity.amount > max) return false;
      }

      return true;
    });


    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field as keyof Opportunity];
      const bValue = b[sortConfig.field as keyof Opportunity];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [opportunities, searchTerm, filters, sortConfig]);

  const handleSort = async (field: string) => {
    const sortAction = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 300));
        

        if (Math.random() < 0.05) {
          throw new Error('Erro ao ordenar dados. Tente novamente.');
        }
        
        setSortConfig(prev => ({
          field,
          direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setLastFailedAction(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao ordenar');
        setLastFailedAction(() => () => handleSort(field));
      } finally {
        setIsLoading(false);
      }
    };
    
    await sortAction();
  };

  const handleSearchChange = async (value: string) => {
    if (value !== searchTerm) {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 400));
        

        if (Math.random() < 0.03) {
          throw new Error('Erro ao buscar dados. Verifique sua conexão.');
        }
        
        setSearchTerm(value);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido na busca');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFilterChange = async (newFilters: OpportunityFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 350));
      

      if (Math.random() < 0.04) {
        throw new Error('Erro ao aplicar filtros. Tente novamente.');
      }
      
      setFilters(newFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao filtrar');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 200));
      

      if (Math.random() < 0.02) {
        throw new Error('Erro ao limpar filtros. Tente novamente.');
      }
      
      setSearchTerm('');
      setFilters({});
      setSuccessMessage('Filtros limpos com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao limpar filtros');
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastAction = () => {
    if (lastFailedAction) {
      lastFailedAction();
    }
  };



  const getStageColor = (stage: string) => {
    const colors = {
      prospecting: 'bg-blue-100 text-blue-800',
      qualification: 'bg-yellow-100 text-yellow-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const uniqueStages = Array.from(new Set(opportunities.map(opp => opp.stage)));

  return (
    <div className="space-y-6">

      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 flex-1">{error}</span>
            {lastFailedAction && (
              <button
                onClick={retryLastAction}
                className="mr-3 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Tentar novamente
              </button>
            )}
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}


      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg className="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-700">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-green-400 hover:text-green-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}


      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, conta ou descrição..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/80 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>


          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select
              value={filters.stage?.[0] || ''}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => handleFilterChange({ ...filters, stage: e.target.value ? [e.target.value as any] : undefined })}
              disabled={isLoading}
              className="pl-10 pr-8 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/80 backdrop-blur-sm transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos os estágios</option>
              {uniqueStages.map(stage => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>


          {(searchTerm || Object.keys(filters).length > 0) && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 rounded-xl transition-all duration-200 border border-gray-200/50"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>


      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden relative">

        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Carregando...</span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/30">
            <thead className="bg-gray-50/50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nome</span>
                    {sortConfig.field === 'name' && (
                      <svg className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort('accountName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Conta</span>
                    {sortConfig.field === 'accountName' && (
                      <svg className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort('stage')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Estágio</span>
                    {sortConfig.field === 'stage' && (
                      <svg className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Valor</span>
                    {sortConfig.field === 'amount' && (
                      <svg className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort('expectedCloseDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Data Esperada</span>
                    {sortConfig.field === 'expectedCloseDate' && (
                      <svg className={`h-4 w-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/80 divide-y divide-gray-200/30">
              {filteredAndSortedOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="mx-auto h-20 w-20 text-gray-300 mb-6">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-light text-gray-500 mb-2">Nenhuma opportunity encontrada</h3>
                      <p className="text-gray-400 mb-6">
                        {searchTerm || Object.keys(filters).length > 0 
                          ? 'Tente ajustar os filtros para encontrar opportunities.'
                          : 'Converta alguns leads para criar suas primeiras opportunities.'
                        }
                      </p>
                      {(searchTerm || Object.keys(filters).length > 0) && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Dicas para encontrar opportunities:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1 text-left">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              Verifique se há leads qualificados para converter
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              Ajuste os filtros de estágio
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                              Tente termos de busca diferentes
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOpportunities.map((opportunity) => (
                  <tr 
                    key={opportunity.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => onOpportunitySelect?.(opportunity)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{opportunity.name}</div>
                      {opportunity.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{opportunity.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{opportunity.accountName}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                        {opportunity.stage.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(opportunity.amount)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(opportunity.expectedCloseDate)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpportunitySelect?.(opportunity);
                          }}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                          Ver
                        </button>
                        {onOpportunityDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Tem certeza que deseja excluir esta opportunity?')) {
                                onOpportunityDelete(opportunity.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="md:hidden space-y-3 relative">

        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Carregando...</span>
            </div>
          </div>
        )}
        {filteredAndSortedOpportunities.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center">
            <div className="mx-auto h-14 w-14 text-gray-300 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-gray-500 mb-2">Nenhuma opportunity encontrada</h3>
            <p className="text-gray-400 text-sm">
              {searchTerm || Object.keys(filters).length > 0 
                ? 'Tente ajustar os filtros.'
                : 'Converta leads para criar opportunities.'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedOpportunities.map((opportunity) => (
            <div 
              key={opportunity.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onOpportunitySelect?.(opportunity)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{opportunity.name}</h3>
                  <p className="text-gray-600 text-xs mt-1">{opportunity.accountName}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                  {opportunity.stage.replace('-', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Valor</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(opportunity.amount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Data Esperada</p>
                  <p className="text-sm text-gray-900">{formatDate(opportunity.expectedCloseDate)}</p>
                </div>
              </div>

              {opportunity.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>
              )}

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Criado em {formatDate(opportunity.createdAt)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpportunitySelect?.(opportunity);
                    }}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                  >
                    Ver
                  </button>
                  {onOpportunityDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir esta opportunity?')) {
                          onOpportunityDelete(opportunity.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OpportunitiesList;
