import { useContext } from 'react';
import { OpportunityContext, type OpportunityContextType } from '../context/OpportunityContextDefinition';

export const useOpportunityContext = (): OpportunityContextType => {
  const context = useContext(OpportunityContext);
  if (context === undefined) {
    throw new Error('useOpportunityContext must be used within an OpportunityProvider');
  }
  return context;
};