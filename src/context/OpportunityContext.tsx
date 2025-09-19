import React, { type ReactNode } from 'react';
import { useOpportunities } from '../hooks';
import { OpportunityContext } from './OpportunityContextDefinition';

interface OpportunityProviderProps {
  children: ReactNode;
}

export const OpportunityProvider: React.FC<OpportunityProviderProps> = ({ children }) => {
  const value = useOpportunities();

  return (
    <OpportunityContext.Provider value={value}>
      {children}
    </OpportunityContext.Provider>
  );
};