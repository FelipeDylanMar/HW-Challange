import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Opportunity } from '../../types/crm';
import { Button } from '../UI';

interface OpportunityViewModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage?: (opportunity: Opportunity) => void;
  onDelete?: (opportunityId: string) => void;
}

// Helper functions
const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Components
const InfoField: React.FC<{ label: string; value: string | null; className?: string }> = ({ 
  label, 
  value, 
  className = '' 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{value || '-'}</p>
  </div>
);

const StageDisplay: React.FC<{ stage: string }> = ({ stage }) => {
  const { t } = useTranslation();
  
  // Constants
  const STAGE_CONFIG = {
    prospecting: {
      label: t('opportunities.prospecting'),
      color: 'bg-slate-100 text-slate-700 border border-slate-200',
      next: 'qualification'
    },
    qualification: {
      label: t('opportunities.qualification'),
      color: 'bg-blue-100 text-blue-700 border border-blue-200',
      next: 'proposal'
    },
    proposal: {
      label: t('opportunities.proposal'),
      color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      next: 'negotiation'
    },
    negotiation: {
      label: t('opportunities.negotiation'),
      color: 'bg-amber-100 text-amber-700 border border-amber-200',
      next: 'closed-won'
    },
    'closed-won': {
      label: t('opportunities.closedWon'),
      color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      next: null
    },
    'closed-lost': {
      label: t('opportunities.closedLost'),
      color: 'bg-rose-100 text-rose-700 border border-rose-200',
      next: null
    }
  } as const;

  const getStageConfig = (stage: string) => {
    return STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG] || {
      label: stage,
      color: 'bg-gray-100 text-gray-700 border border-gray-200',
      next: null
    };
  };

  const config = getStageConfig(stage);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('opportunities.currentStage')}</h3>
      <div className="flex items-center space-x-3">
        <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full ${config.color}`}>
          <span>{config.label}</span>
        </span>
      </div>
    </div>
  );
};

const PipelineProgress: React.FC<{ currentStage: string }> = ({ currentStage }) => {
  const { t } = useTranslation();
  
  const PIPELINE_STAGES = ['prospecting', 'qualification', 'proposal', 'negotiation'] as const;
  
  const STAGE_CONFIG = {
    prospecting: {
      label: t('opportunities.prospecting'),
      color: 'bg-slate-100 text-slate-700 border border-slate-200',
      next: 'qualification'
    },
    qualification: {
      label: t('opportunities.qualification'),
      color: 'bg-blue-100 text-blue-700 border border-blue-200',
      next: 'proposal'
    },
    proposal: {
      label: t('opportunities.proposal'),
      color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      next: 'negotiation'
    },
    negotiation: {
      label: t('opportunities.negotiation'),
      color: 'bg-amber-100 text-amber-700 border border-amber-200',
      next: 'closed-won'
    },
    'closed-won': {
      label: t('opportunities.closedWon'),
      color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      next: null
    },
    'closed-lost': {
      label: t('opportunities.closedLost'),
      color: 'bg-rose-100 text-rose-700 border border-rose-200',
      next: null
    }
  } as const;

  const getStageConfig = (stage: string) => {
    return STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG] || {
      label: stage,
      color: 'bg-gray-100 text-gray-700 border border-gray-200',
      next: null
    };
  };

  const currentIndex = PIPELINE_STAGES.indexOf(currentStage as typeof PIPELINE_STAGES[number]);
  const isClosed = currentStage.startsWith('closed-');
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('opportunities.pipelineProgress')}</h3>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {PIPELINE_STAGES.map((stage, index) => {
            const isActive = currentStage === stage;
            const isPassed = currentIndex > index;
            const config = getStageConfig(stage);
            
            return (
              <div key={stage} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isActive ? 'bg-blue-600 text-white' :
                  isPassed || isClosed ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {isPassed || isClosed ? '✓' : index + 1}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center">
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {isClosed && (
          <div className="mt-4 p-3 rounded-md border-2 border-dashed">
            <div className={`flex items-center justify-center ${
              currentStage === 'closed-won' ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50'
            }`}>
              <span className="font-medium">{getStageConfig(currentStage).label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdvanceStageButton: React.FC<{ 
  opportunity: Opportunity; 
  onAdvanceStage?: (opportunity: Opportunity) => void;
}> = ({ opportunity, onAdvanceStage }) => {
  const { t } = useTranslation();
  
  const STAGE_CONFIG = {
    prospecting: {
      label: t('opportunities.prospecting'),
      color: 'bg-slate-100 text-slate-700 border border-slate-200',
      next: 'qualification'
    },
    qualification: {
      label: t('opportunities.qualification'),
      color: 'bg-blue-100 text-blue-700 border border-blue-200',
      next: 'proposal'
    },
    proposal: {
      label: t('opportunities.proposal'),
      color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      next: 'negotiation'
    },
    negotiation: {
      label: t('opportunities.negotiation'),
      color: 'bg-amber-100 text-amber-700 border border-amber-200',
      next: 'closed-won'
    },
    'closed-won': {
      label: t('opportunities.closedWon'),
      color: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      next: null
    },
    'closed-lost': {
      label: t('opportunities.closedLost'),
      color: 'bg-rose-100 text-rose-700 border border-rose-200',
      next: null
    }
  } as const;

  const getStageConfig = (stage: string) => {
    return STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG] || {
      label: stage,
      color: 'bg-gray-100 text-gray-700 border border-gray-200',
      next: null
    };
  };

  const canAdvanceStage = (stage: string): boolean => {
    const config = getStageConfig(stage);
    return config.next !== null;
  };

  const getNextStageLabel = (stage: string): string => {
    const config = getStageConfig(stage);
    if (!config.next) return '';
    return getStageConfig(config.next).label;
  };

  // Verificação de segurança para evitar erros de null
  if (!opportunity || !opportunity.stage || !canAdvanceStage(opportunity.stage) || !onAdvanceStage) {
    return null;
  }

  const nextStageLabel = getNextStageLabel(opportunity.stage);
  
  return (
    <Button
      variant="primary"
      onClick={() => onAdvanceStage(opportunity)}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
    >
      <span>{t('opportunities.advanceTo')} {nextStageLabel}</span>
      <span className="ml-1">→</span>
    </Button>
  );
};

const ModalActions: React.FC<{
  opportunity: Opportunity;
  onClose: () => void;
  onAdvanceStage?: (opportunity: Opportunity) => void;
  onDelete?: (opportunityId: string) => void;
}> = ({ opportunity, onClose, onAdvanceStage, onDelete }) => {
  const { t } = useTranslation();
  
  // Verificação de segurança para evitar erros de null
  if (!opportunity || !opportunity.id) {
    return (
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <div className="flex justify-between items-center">
        <div>
          {onDelete && opportunity.stage && !opportunity.stage.startsWith('closed-') && (
            <Button
              variant="danger"
              onClick={() => onDelete(opportunity.id)}
              className="text-red-700 bg-red-100 border border-red-300 hover:bg-red-200"
            >
              {t('common.delete')}
            </Button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose}>
            {t('common.close')}
          </Button>

          <AdvanceStageButton 
            opportunity={opportunity} 
            onAdvanceStage={onAdvanceStage} 
          />
        </div>
      </div>
    </div>
  );
};

const OpportunityViewModal: React.FC<OpportunityViewModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onAdvanceStage,
  onDelete
}) => {
  const { t } = useTranslation();
  
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('opportunities.opportunityDetails')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('opportunities.completeDataView')}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('opportunities.basicInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                label={t('opportunities.opportunityName')} 
                value={opportunity.name}
                className="font-medium"
              />
              <InfoField label={t('opportunities.accountClient')} value={opportunity.accountName} />
              <InfoField 
                label={t('opportunities.amount')} 
                value={formatCurrency(opportunity.amount)}
                className="font-semibold text-lg"
              />
              <InfoField 
                label={t('opportunities.expectedCloseDate')} 
                value={formatDate(opportunity.expectedCloseDate)} 
              />
            </div>
          </div>

          <StageDisplay stage={opportunity.stage} />

          {/* Description */}
          {opportunity.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('opportunities.description')}</h3>
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            </div>
          )}

          {/* Lead Information */}
          {opportunity.leadId && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('opportunities.origin')}</h3>
              <div className="bg-blue-50 px-4 py-3 rounded-md border border-blue-200">
                <div className="flex items-center">
                  <span className="text-blue-800 font-medium">
                    {t('opportunities.convertedFromLead')}: {opportunity.leadId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.history')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                label={t('common.createdAt')} 
                value={formatDateTime(opportunity.createdAt)} 
              />
              <InfoField 
                label={t('common.lastUpdate')} 
                value={formatDateTime(opportunity.updatedAt)} 
              />
            </div>
          </div>

          <PipelineProgress currentStage={opportunity.stage} />
        </div>

        <ModalActions
          opportunity={opportunity}
          onClose={onClose}
          onAdvanceStage={onAdvanceStage}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default OpportunityViewModal;