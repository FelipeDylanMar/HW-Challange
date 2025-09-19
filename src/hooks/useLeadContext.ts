import { useContext } from 'react';
import { LeadContext, type LeadContextType } from '../context/LeadContextDefinition';

export const useLeadContext = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeadContext must be used within a LeadProvider');
  }
  return context;
};