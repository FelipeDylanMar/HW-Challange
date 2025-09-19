import { useState, useEffect, useCallback } from 'react';
import type { Lead, Opportunity } from '../types/crm';
import { leadStorage } from '../utils/leadStorage';

function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allLeads = leadStorage.getAllLeads();
      setLeads(allLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const updateLead = useCallback((updatedLead: Lead) => {
    try {
      const allLeads = leadStorage.getAllLeads();
      const isCustomLead = !allLeads.slice(0, -leadStorage.getAllLeads().length + allLeads.length).find(lead => lead.id === updatedLead.id);
      
      if (isCustomLead) {
        leadStorage.updateLead(updatedLead);
      }
      
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === updatedLead.id ? updatedLead : lead
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  }, []);

  const deleteLead = useCallback((leadId: string) => {
    try {
      leadStorage.deleteLead(leadId);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  }, []);

  const addLead = useCallback((newLead: Lead) => {
    try {
      leadStorage.addLead(newLead);
      setLeads(prevLeads => [...prevLeads, newLead]);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      throw error;
    }
  }, []);

  const refreshLeads = useCallback(() => {
    loadLeads();
  }, [loadLeads]);

  const convertToOpportunity = useCallback((lead: Lead, opportunityData: Partial<Opportunity>) => {
    try {
      const updatedLead = { ...lead, status: 'converted' as const };
      updateLead(updatedLead);
      
      return {
        lead: updatedLead,
        opportunityData
      };
    } catch (error) {
      console.error('Erro ao converter lead:', error);
      throw error;
    }
  }, [updateLead]);

  return {
    leads,
    isLoading,
    error,
    updateLead,
    deleteLead,
    addLead,
    refreshLeads,
    convertToOpportunity
  };
}

export default useLeads;