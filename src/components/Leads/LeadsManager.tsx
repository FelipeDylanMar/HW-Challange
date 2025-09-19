import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Lead } from '../../types/crm';
import { 
  DataList,
  StatusBadge,
  Button,
  getStatusVariant,
  type DataListConfig,
  type FilterConfig,
  type TableColumn
} from '../UI';

interface LeadsManagerProps {
  leads: Lead[];
  onLeadSelect?: (lead: Lead) => void;
  onLeadUpdate?: (updatedLead: Lead) => void;
  onConvertToOpportunity?: (lead: Lead) => void;
  onLeadDelete?: (leadId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({
  leads,
  onLeadSelect,
  onLeadUpdate,
  onConvertToOpportunity,
  onLeadDelete,
  isLoading = false,
  error = null,
  successMessage = null,
  onRetry,
  onDismissError,
  onDismissSuccess
}) => {
  const { t } = useTranslation();

  // Constants with translations
  const STATUS_OPTIONS = [
    { value: "new", label: t('status.new') },
    { value: "contacted", label: t('status.contacted') },
    { value: "qualified", label: t('status.qualified') },
    { value: "unqualified", label: t('status.unqualified') },
    { value: "converted", label: t('status.converted') }
  ];

  const SOURCE_OPTIONS = [
    { value: "Website", label: "Website" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Referral", label: t('leads.source') },
    { value: "Event", label: t('common.event') },
    { value: "Cold Call", label: "Cold Call" },
    { value: "Email", label: t('common.email') },
    { value: "Social Media", label: t('common.socialMedia') }
  ];

  // Helper functions
  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  const getOptionLabel = (options: typeof STATUS_OPTIONS, value: string) => 
    options.find(opt => opt.value === value)?.label || value;

  const confirmDelete = () => 
    window.confirm(t('messages.confirmDelete'));

  const ScoreBar: React.FC<{ score: number; size?: 'sm' | 'md' }> = ({ score, size = 'md' }) => {
    const barClass = size === 'sm' ? 'w-12 h-1.5' : 'w-16 h-2';
    const textClass = size === 'sm' ? 'text-xs' : 'text-sm';
    
    return (
      <div className="flex items-center">
        <div className={`${barClass} bg-gray-200 rounded-full mr-2`}>
          <div 
            className="bg-blue-600 h-full rounded-full" 
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`${textClass} font-medium`}>{score}%</span>
      </div>
    );
  };

  const ActionButtons: React.FC<{
    lead: Lead;
    onSelect?: (lead: Lead) => void;
    onConvert?: (lead: Lead) => void;
    onDelete?: (leadId: string) => void;
  }> = ({ lead, onSelect, onConvert, onDelete }) => (
    <div className="flex space-x-1 justify-end">
      <Button
        variant="secondary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(lead);
        }}
      >
        {t('common.view')}
      </Button>
      {onConvert && lead.status === 'qualified' && (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onConvert(lead);
          }}
        >
          {t('leads.convertToOpportunity')}
        </Button>
      )}
      {onDelete && (
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (confirmDelete()) onDelete(lead.id);
          }}
        >
          {t('common.delete')}
        </Button>
      )}
    </div>
  );

  const filterConfigs: FilterConfig[] = [
    {
      key: "status",
      label: t('common.status'),
      placeholder: t('leads.filterByStatus'),
      multiple: true,
      options: STATUS_OPTIONS
    },
    {
      key: "source",
      label: t('leads.source'),
      placeholder: t('leads.filterBySource'),
      multiple: true,
      options: SOURCE_OPTIONS
    }
  ];

  const columns: TableColumn<Lead>[] = [
    {
      key: "name",
      label: t('common.name'),
      sortable: true,
      className: "min-w-[200px]",
      render: (value, lead) => (
        <div>
          <div className="font-medium text-gray-900">{String(value)}</div>
          <div className="text-sm text-gray-500 truncate max-w-[180px]">{lead.email}</div>
        </div>
      )
    },
    {
      key: "company",
      label: t('common.company'),
      sortable: true,
      className: "min-w-[150px]",
      render: (value, lead) => (
        <div>
          <div className="text-gray-900">{String(value)}</div>
          <div className="text-sm text-gray-500 truncate max-w-[130px]">{lead.position}</div>
        </div>
      )
    },
    {
      key: "status",
      label: t('common.status'),
      sortable: true,
      className: "min-w-[120px]",
      render: (value) => (
        <StatusBadge variant={getStatusVariant(String(value))}>
          {getOptionLabel(STATUS_OPTIONS, String(value))}
        </StatusBadge>
      )
    },
    {
      key: "source",
      label: t('leads.source'),
      sortable: true,
      className: "min-w-[100px]",
      render: (value) => (
        <StatusBadge variant="secondary" size="sm">
          {getOptionLabel(SOURCE_OPTIONS, String(value))}
        </StatusBadge>
      )
    },
    {
      key: "score",
      label: t('leads.score'),
      sortable: true,
      className: "min-w-[120px]",
      render: (value) => <ScoreBar score={Number(value)} />
    },
    {
      key: "createdAt",
      label: t('leads.createdAt'),
      sortable: true,
      className: "min-w-[100px]",
      render: (value) => formatDate(String(value))
    },
    {
      key: "actions",
      label: t('common.actions'),
      className: "min-w-[180px] w-[180px]",
      render: (_, lead) => (
        <ActionButtons
          lead={lead}
          onSelect={onLeadSelect}
          onConvert={onConvertToOpportunity}
          onDelete={onLeadDelete}
        />
      )
    }
  ];

  const mobileCardRender = (lead: Lead) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-500">{lead.email}</p>
        </div>
        <StatusBadge variant={getStatusVariant(lead.status)}>
          {getOptionLabel(STATUS_OPTIONS, lead.status)}
        </StatusBadge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Empresa:</span>
          <p className="font-medium">{lead.company}</p>
        </div>
        <div>
          <span className="text-gray-500">Cargo:</span>
          <p className="font-medium">{lead.position}</p>
        </div>
        <div>
          <span className="text-gray-500">Fonte:</span>
          <StatusBadge variant="secondary" size="sm">
            {getOptionLabel(SOURCE_OPTIONS, lead.source)}
          </StatusBadge>
        </div>
        <div>
          <span className="text-gray-500">Score:</span>
          <div className="mt-1">
            <ScoreBar score={lead.score} size="sm" />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onLeadSelect?.(lead)}
          className="flex-1"
        >
          Ver Detalhes
        </Button>
        {onConvertToOpportunity && lead.status === 'qualified' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConvertToOpportunity(lead)}
            className="flex-1"
          >
            Converter
          </Button>
        )}
      </div>
    </div>
  );

  const dataListConfig: DataListConfig<Lead> = {
    searchFields: ['name', 'email', 'company', 'position'],
    filterConfigs,
    columns,
    emptyState: {
      title: t('leads.noLeads'),
      description: t('leads.noLeadsDescription'),
      suggestions: [
        t('leads.checkFilters'),
        t('leads.tryBroaderSearch'),
        t('leads.clearFilters')
      ]
    },
    mobileCardRender
  };

  return (
    <DataList
      data={leads}
      config={dataListConfig}
      onItemSelect={onLeadSelect}
      onItemDelete={onLeadDelete}
      onItemUpdate={onLeadUpdate}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      onRetry={onRetry}
      onDismissError={onDismissError}
      onDismissSuccess={onDismissSuccess}
      storageKey="leads-manager"
    />
  );
};

export default LeadsManager;