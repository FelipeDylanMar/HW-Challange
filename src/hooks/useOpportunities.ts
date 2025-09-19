import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Opportunity, Lead } from '../types/crm';
import { opportunityStorage } from '../utils/opportunityStorage';

function useOpportunities() {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loadedOpportunities = await opportunityStorage.getAllOpportunities();
      setOpportunities(loadedOpportunities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const updateOpportunity = useCallback((updatedOpportunity: Opportunity) => {
    try {
      opportunityStorage.updateOpportunity(updatedOpportunity);
      setOpportunities(prevOpportunities => {
        const existingIndex = prevOpportunities.findIndex(opp => opp.id === updatedOpportunity.id);
        
        if (existingIndex !== -1) {
          const newOpportunities = [...prevOpportunities];
          newOpportunities[existingIndex] = updatedOpportunity;
          return newOpportunities;
        } else {
          return [...prevOpportunities, updatedOpportunity];
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      throw error;
    }
  }, []);

  const deleteOpportunity = useCallback((opportunityId: string) => {
    try {
      opportunityStorage.deleteOpportunity(opportunityId);
      loadOpportunities();
    } catch (error) {
      console.error('Erro ao deletar oportunidade:', error);
      throw error;
    }
  }, [loadOpportunities]);

  const addOpportunity = useCallback((newOpportunity: Opportunity) => {
    try {
      opportunityStorage.addOpportunity(newOpportunity);
      setOpportunities(prevOpportunities => [...prevOpportunities, newOpportunity]);
    } catch (error) {
      console.error(t('messages.errorAddingOpportunity'), error);
      throw error;
    }
  }, [t]);

  const convertLeadToOpportunity = useCallback((lead: Lead, opportunityData: Partial<Opportunity>) => {
    try {
      const newOpportunity = opportunityStorage.convertLeadToOpportunity(lead.id, {
        name: opportunityData.name || `${t('opportunities.opportunityPrefix')} - ${lead.name}`,
        accountName: opportunityData.accountName || lead.company || lead.name,
        description: opportunityData.description || `${t('opportunities.convertedFromLead')}: ${lead.name}`,
        stage: opportunityData.stage || 'prospecting',
        amount: opportunityData.amount || undefined,
        expectedCloseDate: opportunityData.expectedCloseDate || undefined
      });

      setOpportunities(prevOpportunities => [...prevOpportunities, newOpportunity]);
      return newOpportunity;
    } catch (error) {
      console.error(t('messages.errorConvertingLead'), error);
      throw error;
    }
  }, [t]);

  const refreshOpportunities = useCallback(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return {
    opportunities,
    isLoading,
    error,
    updateOpportunity,
    deleteOpportunity,
    addOpportunity,
    convertLeadToOpportunity,
    refreshOpportunities
  };
}

export default useOpportunities;