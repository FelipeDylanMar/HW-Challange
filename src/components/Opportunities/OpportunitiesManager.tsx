import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Opportunity } from '../../types/crm';
import { 
  DataList,
  StatusBadge,
  Button,
  type DataListConfig,
  type FilterConfig,
  type TableColumn
} from '../UI';

interface OpportunitiesManagerProps {
  opportunities: Opportunity[];
  onOpportunitySelect?: (opportunity: Opportunity) => void;
  onOpportunityUpdate?: (opportunity: Opportunity) => void;
  onOpportunityDelete?: (opportunityId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
}

// Função para obter variante do estágio
const getStageVariant = (stage: string) => {
  switch (stage) {
    case 'prospecting':
      return 'secondary';
    case 'qualification':
      return 'info';
    case 'proposal':
      return 'secondary';
    case 'negotiation':
      return 'warning';
    case 'closed-won':
      return 'success';
    case 'closed-lost':
      return 'danger';
    default:
      return 'default';
  }
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const OpportunitiesManager: React.FC<OpportunitiesManagerProps> = ({
  opportunities,
  onOpportunitySelect,
  onOpportunityUpdate,
  onOpportunityDelete,
  isLoading = false,
  error = null,
  successMessage = null,
  onRetry,
  onDismissError,
  onDismissSuccess
}) => {
  const { t } = useTranslation();

  const filterConfigs: FilterConfig[] = [
    {
      key: "stage",
      label: t('opportunities.stage'),
      placeholder: t('opportunities.filterByStage'),
      multiple: true,
      options: [
        { value: "prospecting", label: t('opportunities.prospecting') },
        { value: "qualification", label: t('opportunities.qualification') },
        { value: "proposal", label: t('opportunities.proposal') },
        { value: "negotiation", label: t('opportunities.negotiation') },
        { value: "closed-won", label: t('opportunities.closedWon') },
        { value: "closed-lost", label: t('opportunities.closedLost') }
      ]
    }
  ];

  const columns: TableColumn<Opportunity>[] = [
    {
      key: "name",
      label: t('common.name'),
      sortable: true,
      className: "min-w-[200px]",
      render: (value, opportunity) => (
        <div>
          <div className="font-medium text-gray-900">{String(value)}</div>
          {opportunity.description && (
            <div className="text-sm text-gray-500 truncate max-w-[180px]">
              {opportunity.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: "accountName",
      label: t('opportunities.account'),
      sortable: true,
      className: "min-w-[150px]",
      render: (value) => (
        <div className="text-gray-900">{String(value)}</div>
      )
    },
    {
      key: "stage",
      label: t('opportunities.stage'),
      sortable: true,
      className: "min-w-[120px]",
      render: (value) => (
        <StatusBadge variant={getStageVariant(String(value))}>
          {filterConfigs[0].options.find(opt => opt.value === String(value))?.label || String(value)}
        </StatusBadge>
      )
    },
    {
      key: "amount",
      label: t('opportunities.amount'),
      sortable: true,
      className: "min-w-[100px]",
      render: (value) => (
        <div className="font-medium text-gray-900">
          {formatCurrency(Number(value))}
        </div>
      )
    },
    {
      key: "expectedCloseDate",
      label: t('opportunities.closeDate'),
      sortable: true,
      className: "min-w-[120px]",
      render: (value) => (
        <div className="text-gray-900">
          {value ? new Date(String(value)).toLocaleDateString('pt-BR') : '-'}
        </div>
      )
    },
    {
      key: "actions",
      label: t('common.actions'),
      className: "min-w-[100px] w-[100px]",
      render: (_, opportunity) => (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpportunitySelect?.(opportunity);
            }}
          >
            {t('common.view')}
          </Button>
        </div>
      )
    }
  ];

  const mobileCardRender = (opportunity: Opportunity) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{opportunity.name}</h3>
          <p className="text-sm text-gray-500">{opportunity.accountName}</p>
        </div>
        <StatusBadge variant={getStageVariant(opportunity.stage)}>
          {filterConfigs[0].options.find(opt => opt.value === opportunity.stage)?.label || opportunity.stage}
        </StatusBadge>
      </div>
      
      {opportunity.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{opportunity.description}</p>
      )}
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">{t('opportunities.amount')}:</span>
          <p className="font-medium text-lg">{formatCurrency(opportunity.amount)}</p>
        </div>
        <div>
          <span className="text-gray-500">{t('opportunities.closeDate')}:</span>
          <p className="font-medium">
            {opportunity.expectedCloseDate 
              ? new Date(opportunity.expectedCloseDate).toLocaleDateString('pt-BR')
              : '-'
            }
          </p>
        </div>
      </div>
      
      <div className="flex pt-2 border-t border-gray-100">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpportunitySelect?.(opportunity)}
          className="flex-1"
        >
          {t('opportunities.viewOpportunity')}
        </Button>
      </div>
    </div>
  );

  const dataListConfig: DataListConfig<Opportunity> = {
    searchFields: ['name', 'accountName', 'description'],
    filterConfigs,
    columns,
    emptyState: {
      title: t('opportunities.noOpportunities'),
      description: t('opportunities.noOpportunitiesDescription'),
      suggestions: [
        t('opportunities.checkFilters'),
        t('opportunities.tryBroaderSearch'),
        t('opportunities.clearFiltersToSeeAll')
      ]
    },
    mobileCardRender
  };

  return (
    <DataList
      data={opportunities}
      config={dataListConfig}
      onItemSelect={onOpportunitySelect}
      onItemDelete={onOpportunityDelete}
      onItemUpdate={onOpportunityUpdate}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      onRetry={onRetry}
      onDismissError={onDismissError}
      onDismissSuccess={onDismissSuccess}
      storageKey="opportunities-manager"
    />
  );
};

export default OpportunitiesManager;