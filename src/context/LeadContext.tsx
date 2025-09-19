import React, { type ReactNode } from 'react';
import { useLeads } from '../hooks';
import { LeadContext } from './LeadContextDefinition';

interface LeadProviderProps {
  children: ReactNode;
}

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const leadsHook = useLeads();

  return (
    <LeadContext.Provider value={leadsHook}>
      {children}
    </LeadContext.Provider>
  );
};