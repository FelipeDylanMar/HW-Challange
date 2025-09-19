import { createContext } from 'react';
import type { Opportunity, Lead } from '../types/crm';

interface OpportunityContextType {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
  deleteOpportunity: (opportunityId: string) => void;
  addOpportunity: (newOpportunity: Opportunity) => void;
  convertLeadToOpportunity: (lead: Lead, opportunityData: Partial<Opportunity>) => Opportunity;
  refreshOpportunities: () => void;
}

export const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);
export type { OpportunityContextType };