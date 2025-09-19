import type { Lead } from '../types/crm';
import mockLeads from '../assets/data/mockLeads.json';
import i18n from '../i18n';

const STORAGE_KEY = 'crm-leads';

export const leadStorage = {
  getAllLeads: (): Lead[] => {
    try {
      const storedLeads = localStorage.getItem(STORAGE_KEY);
      const customLeads = storedLeads ? JSON.parse(storedLeads) : [];
      return [...(mockLeads as Lead[]), ...customLeads];
    } catch (error) {
      console.error('Erro ao carregar leads do localStorage:', error);
      return mockLeads as Lead[];
    }
  },

  addLead: (newLead: Lead): void => {
    try {
      const storedLeads = localStorage.getItem(STORAGE_KEY);
      const customLeads = storedLeads ? JSON.parse(storedLeads) : [];
      
      const existingLead = customLeads.find((lead: Lead) => lead.id === newLead.id);
      if (existingLead) {
        throw new Error(i18n.t('messages.leadAlreadyExists'));
      }
      
      customLeads.push(newLead);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customLeads));
    } catch (error) {
      console.error(i18n.t('messages.errorAddingLead'), error);
      throw error;
    }
  },

  updateLead: (updatedLead: Lead): void => {
    try {
      const storedLeads = localStorage.getItem(STORAGE_KEY);
      const customLeads = storedLeads ? JSON.parse(storedLeads) : [];
      
      const leadIndex = customLeads.findIndex((lead: Lead) => lead.id === updatedLead.id);
      if (leadIndex !== -1) {
        customLeads[leadIndex] = updatedLead;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customLeads));
      }
    } catch (error) {
      console.error(i18n.t('messages.errorUpdatingLead'), error);
      throw error;
    }
  },

  deleteLead: (leadId: string): void => {
    try {
      const storedLeads = localStorage.getItem(STORAGE_KEY);
      const customLeads = storedLeads ? JSON.parse(storedLeads) : [];
      
      const filteredLeads = customLeads.filter((lead: Lead) => lead.id !== leadId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLeads));
    } catch (error) {
      console.error(i18n.t('messages.errorDeletingLead'), error);
      throw error;
    }
  },

  clearCustomLeads: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(i18n.t('messages.errorClearingLeads'), error);
    }
  }
};