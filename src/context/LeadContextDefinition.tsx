import { createContext } from 'react';
import type { Lead, Opportunity } from '../types/crm';

interface LeadContextType {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  updateLead: (updatedLead: Lead) => void;
  deleteLead: (leadId: string) => void;
  addLead: (newLead: Lead) => void;
  refreshLeads: () => void;
  convertToOpportunity: (lead: Lead, opportunityData: Partial<Opportunity>) => { lead: Lead; opportunityData: Partial<Opportunity> };
}

export const LeadContext = createContext<LeadContextType | undefined>(undefined);
export type { LeadContextType };