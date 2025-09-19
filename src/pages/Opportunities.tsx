import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OpportunitiesManager } from '../components';
import { OpportunityViewModal } from '../components/Opportunities';
import { Button, StatsGrid, type StatsCardProps } from '../components/UI';
import { useOpportunityContext } from '../hooks';
import { opportunityStorage } from '../utils/opportunityStorage';
import type { Opportunity } from '../types/crm';

const Opportunities: React.FC = () => {
  const { t } = useTranslation();
  const { opportunities, isLoading, error, refreshOpportunities, updateOpportunity, deleteOpportunity } = useOpportunityContext();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleOpportunitySelect = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedOpportunity(null);
  };

  const handleAdvanceStage = (opportunity: Opportunity) => {
    const stageProgression = {
      'prospecting': 'qualification',
      'qualification': 'proposal', 
      'proposal': 'negotiation',
      'negotiation': 'closed-won'
    } as const;

    const nextStage = stageProgression[opportunity.stage as keyof typeof stageProgression];
    
    if (nextStage) {
      const updatedOpportunity = {
        ...opportunity,
        stage: nextStage,
        updatedAt: new Date().toISOString()
      };
      
      updateOpportunity(updatedOpportunity);
      setSelectedOpportunity(updatedOpportunity);
    }
  };

  const handleOpportunityDelete = (opportunityId: string) => {
    // Fecha o modal imediatamente se a oportunidade sendo deletada é a selecionada
    if (selectedOpportunity?.id === opportunityId) {
      handleViewModalClose();
    }
    // Deleta a oportunidade após fechar o modal
    deleteOpportunity(opportunityId);
  };

  const handleClearCache = () => {
    if (confirm(t('common.confirmClearCache'))) {
      opportunityStorage.clearAllStorageData();
      window.location.reload();
    }
  };
  
  // Garantir que opportunities é um array válido e filtrar valores null/undefined
  const validOpportunities = opportunities?.filter(opp => opp && opp.stage) || [];
  
  // Calcular valores totais para os cards
  const totalOpportunities = validOpportunities.length;
  const totalValue = validOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
  const wonOpportunities = validOpportunities.filter(opp => opp.stage === 'closed-won').length;
  const activeOpportunities = validOpportunities.filter(opp => 
    !['closed-won', 'closed-lost'].includes(opp.stage)
  ).length;

  const statsData: StatsCardProps[] = [
    {
      title: t('opportunities.stats.totalOpportunities'),
      value: totalOpportunities,
      icon: "📊",
      iconColor: "blue"
    },
    {
      title: t('opportunities.stats.activeOpportunities'),
      value: activeOpportunities,
      icon: "🔥",
      iconColor: "orange"
    },
    {
      title: t('opportunities.stats.closedWon'),
      value: wonOpportunities,
      icon: "✅",
      iconColor: "green"
    },
    {
      title: t('opportunities.stats.totalValue'),
      value: `R$ ${totalValue.toLocaleString('pt-BR')}`,
      icon: "💰",
      iconColor: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('opportunities.title')}</h1>
              <p className="mt-2 text-gray-600">{t('opportunities.subtitle')}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearCache}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            >
              🗑️ {t('common.clearCache')}
            </Button>
          </div>
        </div>

        <StatsGrid 
          stats={statsData} 
          columns={4} 
          className="mb-8" 
        />

        <OpportunitiesManager 
          opportunities={validOpportunities}
          onOpportunitySelect={handleOpportunitySelect}
          onOpportunityDelete={handleOpportunityDelete}
          isLoading={isLoading}
          error={error}
          onRetry={refreshOpportunities}
        />

        <OpportunityViewModal
          opportunity={selectedOpportunity}
          isOpen={isViewModalOpen}
          onClose={handleViewModalClose}
          onAdvanceStage={handleAdvanceStage}
          onDelete={handleOpportunityDelete}
        />
      </div>
    </div>
  );
};

export default Opportunities;