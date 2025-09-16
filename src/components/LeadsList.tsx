import React, { useState, useMemo, useEffect } from "react";
import type { Lead } from "../types/crm";
import type { LeadFilters, SortConfig } from "../types/crm";

interface LeadsListProps {
  leads: Lead[];
  onLeadSelect?: (lead: Lead) => void;
  onLeadUpdate?: (updatedLead: Lead) => void;
  onConvertToOpportunity?: (lead: Lead) => void;
  onLeadDelete?: (leadId: string) => void;
}

const LeadsList: React.FC<LeadsListProps> = ({
  leads,
  onLeadSelect,
  onConvertToOpportunity,
  onLeadDelete,
}) => {
  const loadFromStorage = () => {
    try {
      const savedSearchTerm = localStorage.getItem("leads-search-term");
      const savedFilters = localStorage.getItem("leads-filters");
      const savedSortConfig = localStorage.getItem("leads-sort-config");

      return {
        searchTerm: savedSearchTerm || "",
        filters: savedFilters ? JSON.parse(savedFilters) : {},
        sortConfig: savedSortConfig
          ? JSON.parse(savedSortConfig)
          : { field: "createdAt", direction: "desc" },
      };
    } catch (error) {
      console.warn("Erro ao carregar dados do localStorage:", error);
      return {
        searchTerm: "",
        filters: {},
        sortConfig: { field: "createdAt", direction: "desc" },
      };
    }
  };

  const initialState = loadFromStorage();
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm);
  const [filters, setFilters] = useState<LeadFilters>(initialState.filters);
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialState.sortConfig
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastFailedAction, setLastFailedAction] = useState<(() => void) | null>(
    null
  );

  useEffect(() => {
    try {
      localStorage.setItem("leads-search-term", searchTerm);
    } catch (error) {
      console.warn("Erro ao salvar termo de busca no localStorage:", error);
    }
  }, [searchTerm]);

  useEffect(() => {
    try {
      localStorage.setItem("leads-filters", JSON.stringify(filters));
    } catch (error) {
      console.warn("Erro ao salvar filtros no localStorage:", error);
    }
  }, [filters]);

  useEffect(() => {
    try {
      localStorage.setItem("leads-sort-config", JSON.stringify(sortConfig));
    } catch (error) {
      console.warn(
        "Erro ao salvar configuração de ordenação no localStorage:",
        error
      );
    }
  }, [sortConfig]);

  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower) ||
          lead.position.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(lead.status)) return false;
      }

      if (filters.source && filters.source.length > 0) {
        if (!filters.source.includes(lead.source)) return false;
      }

      if (filters.scoreRange) {
        const [min, max] = filters.scoreRange;
        if (lead.score < min || lead.score > max) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field as keyof Lead];
      const bValue = b[sortConfig.field as keyof Lead];

      if (aValue !== undefined && bValue !== undefined) {
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [leads, searchTerm, filters, sortConfig]);

  const handleSort = async (field: string) => {
    const sortAction = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 300));

        if (Math.random() < 0.05) {
          throw new Error("Erro ao ordenar dados. Tente novamente.");
        }

        setSortConfig((prev) => ({
          field,
          direction:
            prev.field === field && prev.direction === "asc" ? "desc" : "asc",
        }));
        setLastFailedAction(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro desconhecido ao ordenar"
        );
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

        await new Promise((resolve) => setTimeout(resolve, 400));

        if (Math.random() < 0.03) {
          throw new Error("Erro ao buscar dados. Verifique sua conexão.");
        }

        setSearchTerm(value);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro desconhecido na busca"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFilterChange = async (newFilters: LeadFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 350));

      if (Math.random() < 0.04) {
        throw new Error("Erro ao aplicar filtros. Tente novamente.");
      }

      setFilters(newFilters);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido ao filtrar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 250));

      if (Math.random() < 0.02) {
        throw new Error("Erro ao limpar filtros. Tente novamente.");
      }

      setFilters({});
      setSearchTerm("");
      setSuccessMessage("Filtros limpos com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao limpar filtros"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastAction = () => {
    if (lastFailedAction) {
      lastFailedAction();
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!onLeadDelete) {
      setError("Função de exclusão não disponível");
      return;
    }

    if (
      !confirm(
        "Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      setDeletingId(leadId);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() < 0.1) {
        throw new Error(
          "Erro ao excluir lead. Verifique sua conexão e tente novamente."
        );
      }

      onLeadDelete(leadId);
      setSuccessMessage("Lead excluído com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido ao excluir lead"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
      unqualified: "bg-red-100 text-red-800",
      converted: "bg-purple-100 text-purple-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 font-semibold";
    if (score >= 60) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
      <div className="p-6 sm:p-8 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Leads ({filteredAndSortedLeads.length})
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <svg
                className="h-5 w-5 text-green-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-700">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative">
            <select
              value={filters.status?.[0] || ""}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  status: e.target.value ? [e.target.value as any] : undefined,
                })
              }
              disabled={isLoading}
              className={`w-full sm:w-auto appearance-none bg-white/80 border border-gray-200/50 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Todos os Status</option>
              <option value="new">Novo</option>
              <option value="contacted">Contatado</option>
              <option value="qualified">Qualificado</option>
              <option value="unqualified">Não Qualificado</option>
              <option value="converted">Convertido</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={filters.source?.[0] || ""}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  source: e.target.value ? [e.target.value as any] : undefined,
                })
              }
              disabled={isLoading}
              className={`w-full sm:w-auto appearance-none bg-white/80 border border-gray-200/50 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Todas as Fontes</option>
              <option value="Website">Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Indicação</option>
              <option value="Event">Evento</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Email">Email</option>
              <option value="Social Media">Redes Sociais</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {(filters.status || filters.source || searchTerm) && (
            <button
              onClick={clearFilters}
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/80 border border-gray-200/50 rounded-xl hover:bg-white transition-all duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      <div className="hidden md:block relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 font-medium">
                Carregando...
              </span>
            </div>
          </div>
        )}
        {filteredAndSortedLeads.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 text-gray-300 mb-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-3">
              {searchTerm || filters.status || filters.source
                ? "Nenhum lead encontrado"
                : "Nenhum lead disponível"}
            </h3>
            <p className="text-gray-500 mb-8 font-light">
              {searchTerm || filters.status || filters.source
                ? "Tente ajustar os filtros para encontrar leads."
                : "Não há leads cadastrados no momento."}
            </p>
            {(searchTerm || filters.status || filters.source) && (
              <button
                onClick={() => {
                  setFilters({});
                  setSearchTerm("");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200/50">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Nome</span>
                      {sortConfig.field === "name" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("company")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Empresa</span>
                      {sortConfig.field === "company" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {sortConfig.field === "status" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Score</span>
                      {sortConfig.field === "score" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("source")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Fonte</span>
                      {sortConfig.field === "source" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Data</span>
                      {sortConfig.field === "createdAt" && (
                        <span className="text-blue-500 text-sm">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-gray-200/30">
                {filteredAndSortedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500 font-light">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-700 font-medium">
                          {lead.company}
                        </div>
                        <div className="text-sm text-gray-500 font-light">
                          {lead.position}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`font-medium ${getScoreColor(lead.score)}`}
                        >
                          {lead.score}
                        </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {lead.source}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-light">
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => onLeadSelect?.(lead)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      >
                        Ver
                      </button>
                      {lead.status === "qualified" && (
                        <button
                          onClick={() => onConvertToOpportunity?.(lead)}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors duration-200 font-medium"
                        >
                          Converter
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (
                            confirm("Tem certeza que deseja excluir este lead?")
                          ) {
                            handleDelete(lead.id);
                          }
                        }}
                        disabled={deletingId === lead.id}
                        className={`text-red-600 hover:text-red-800 transition-colors duration-200 font-medium ${
                          deletingId === lead.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {deletingId === lead.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 font-medium">
                Carregando...
              </span>
            </div>
          </div>
        )}
        {filteredAndSortedLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-14 w-14 text-gray-300 mb-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-light text-gray-900 mb-3">
              {searchTerm || filters.status || filters.source
                ? "Nenhum lead encontrado"
                : "Nenhum lead disponível"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-light">
              {searchTerm || filters.status || filters.source
                ? "Tente ajustar os filtros para encontrar leads."
                : "Não há leads cadastrados no momento."}
            </p>
            {(searchTerm || filters.status || filters.source) && (
              <button
                onClick={() => {
                  setFilters({});
                  setSearchTerm("");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-light truncate">
                    {lead.email}
                  </p>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {lead.company}
                  </p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ml-3 ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Score
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {lead.score}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Fonte
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {lead.source}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200/50">
                <span className="font-light">
                  Criado em{" "}
                  {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onLeadSelect?.(lead)}
                  className="flex-1 px-4 py-2.5 text-sm text-blue-600 bg-blue-50/80 rounded-xl hover:bg-blue-100/80 font-medium transition-all duration-200"
                >
                  Ver detalhes
                </button>
                {lead.status === "qualified" && (
                  <button
                    onClick={() => onConvertToOpportunity?.(lead)}
                    className="flex-1 px-4 py-2.5 text-sm text-emerald-600 bg-emerald-50/80 rounded-xl hover:bg-emerald-100/80 font-medium transition-all duration-200"
                  >
                    Converter
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir este lead?")) {
                      handleDelete(lead.id);
                    }
                  }}
                  disabled={deletingId === lead.id}
                  className={`px-4 py-2.5 text-sm text-red-600 bg-red-50/80 rounded-xl hover:bg-red-100/80 font-medium transition-all duration-200 ${
                    deletingId === lead.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {deletingId === lead.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadsList;
