import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Lead } from '../../types/crm';
import { StatusBadge, Button, getStatusVariant } from '../UI';

interface LeadViewModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToOpportunity?: (lead: Lead) => void;
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConvertToOpportunity
}) => {
  const { t } = useTranslation();

  // Constants
  const STATUS_LABELS = {
    new: t('status.new'),
    contacted: t('status.contacted'),
    qualified: t('status.qualified'),
    unqualified: t('status.unqualified'),
    converted: t('status.converted')
  } as const;

  const SOURCE_LABELS = {
    Website: t('common.website'),
    LinkedIn: t('common.linkedin'),
    Referral: t('common.referral'),
    Event: t('common.event'),
    'Cold Call': t('common.coldCall'),
    Email: t('common.email'),
    'Social Media': t('common.socialMedia')
  } as const;

  // Helper functions
  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Components
  const InfoField: React.FC<{ label: string; value: string | null; placeholder?: string }> = ({ 
    label, 
    value, 
    placeholder = '-' 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{value || placeholder}</p>
    </div>
  );

  const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.score')}</label>
      <div className="flex items-center space-x-3">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );

  const StatusSection: React.FC<{ lead: Lead }> = ({ lead }) => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('leads.statusAndSource')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.status')}</label>
          <StatusBadge variant={getStatusVariant(lead.status)}>
            {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS] || lead.status}
          </StatusBadge>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.source')}</label>
          <StatusBadge variant="secondary">
            {SOURCE_LABELS[lead.source as keyof typeof SOURCE_LABELS] || lead.source}
          </StatusBadge>
        </div>
        
        <ScoreDisplay score={lead.score} />
      </div>
    </div>
  );

  const NotesSection: React.FC<{ notes?: string }> = ({ notes }) => {
    if (!notes) return null;
    
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.notes')}</h3>
        <div className="bg-gray-50 px-4 py-3 rounded-md">
          <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
        </div>
      </div>
    );
  };

  const HistorySection: React.FC<{ lead: Lead }> = ({ lead }) => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.history')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField 
          label={t('common.createdAt')} 
          value={formatDate(lead.createdAt)} 
        />
        <InfoField 
          label={t('common.lastContact')} 
          value={formatDate(lead.lastContact)} 
        />
      </div>
    </div>
  );

  const ModalActions: React.FC<{
    lead: Lead;
    onClose: () => void;
    onConvertToOpportunity?: (lead: Lead) => void;
  }> = ({ lead, onClose, onConvertToOpportunity }) => (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onClose}>
          {t('common.close')}
        </Button>
        
        {onConvertToOpportunity && lead.status === 'qualified' && (
          <Button variant="success" onClick={() => onConvertToOpportunity(lead)}>
            {t('leads.convertToOpportunity')}
          </Button>
        )}
      </div>
    </div>
  );

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{lead.position} • {lead.company}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('common.basicInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label={t('common.email')} value={lead.email} />
              <InfoField label={t('common.phone')} value={lead.phone} />
              <InfoField label={t('common.company')} value={lead.company} />
              <InfoField label={t('common.position')} value={lead.position} />
            </div>
          </div>

          <StatusSection lead={lead} />
          <NotesSection notes={lead.notes} />
          <HistorySection lead={lead} />
        </div>

        <ModalActions 
          lead={lead}
          onClose={onClose}
          onConvertToOpportunity={onConvertToOpportunity}
        />
      </div>
    </div>
  );
};

export default LeadViewModal;