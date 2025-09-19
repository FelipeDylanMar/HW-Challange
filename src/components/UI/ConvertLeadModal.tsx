import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lead, Opportunity, OpportunityStage } from '../../types/crm';

interface ConvertLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConvert: (lead: Lead, opportunityData: Partial<Opportunity>) => void;
}

const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConvert
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    accountName: '',
    description: '',
    stage: 'prospecting' as OpportunityStage,
    amount: '',
    expectedCloseDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        name: `${t('opportunities.opportunityPrefix')} - ${lead.name}`,
        accountName: lead.company || lead.name,
        description: `${t('opportunities.convertedFromLead')}: ${lead.name}`,
        stage: 'prospecting',
        amount: '',
        expectedCloseDate: ''
      });
    }
  }, [lead, isOpen, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);
    try {
      const opportunityData: Partial<Opportunity> = {
        name: formData.name,
        accountName: formData.accountName,
        description: formData.description,
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        expectedCloseDate: formData.expectedCloseDate || undefined
      };

      onConvert(lead, opportunityData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        accountName: '',
        description: '',
        stage: 'prospecting',
        amount: '',
        expectedCloseDate: ''
      });
    } catch (error) {
      console.error(t('messages.errorConvertingLead'), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('opportunities.convertLeadToOpportunity')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {lead && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">{t('opportunities.leadToBeConverted')}:</h3>
              <p className="text-blue-800">{lead.name}</p>
              {lead.company && <p className="text-blue-700 text-sm">{lead.company}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.opportunityName')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.accountName')} *
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.stage')} *
              </label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="prospecting">{t('opportunities.stages.prospecting')}</option>
                <option value="qualification">{t('opportunities.stages.qualification')}</option>
                <option value="proposal">{t('opportunities.stages.proposal')}</option>
                <option value="negotiation">{t('opportunities.stages.negotiation')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.estimatedValue')}
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.expectedCloseDate')}
              </label>
              <input
                type="date"
                id="expectedCloseDate"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('opportunities.description')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t('opportunities.converting') : t('opportunities.convert')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConvertLeadModal;