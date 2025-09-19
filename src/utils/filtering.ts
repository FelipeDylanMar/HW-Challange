import type { Lead, Opportunity, LeadFilters, OpportunityFilters } from '../types/crm';

export const filterLeads = (leads: Lead[], filters: LeadFilters, searchTerm: string = ''): Lead[] => {
  return leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status?.length || filters.status.includes(lead.status);
    const matchesSource = !filters.source?.length || filters.source.includes(lead.source);
    
    const matchesScore = !filters.scoreRange || 
      (lead.score >= filters.scoreRange[0] && lead.score <= filters.scoreRange[1]);

    const matchesDateRange = !filters.dateRange || 
      (new Date(lead.createdAt) >= new Date(filters.dateRange[0]) && 
       new Date(lead.createdAt) <= new Date(filters.dateRange[1]));

    return matchesSearch && matchesStatus && matchesSource && matchesScore && matchesDateRange;
  });
};

export const filterOpportunities = (opportunities: Opportunity[], filters: OpportunityFilters, searchTerm: string = ''): Opportunity[] => {
  return opportunities.filter(opportunity => {
    const matchesSearch = !searchTerm || 
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = !filters.stage?.length || filters.stage.includes(opportunity.stage);
    
    const matchesValue = !filters.valueRange || !opportunity.amount ||
      (opportunity.amount >= filters.valueRange[0] && opportunity.amount <= filters.valueRange[1]);

    return matchesSearch && matchesStage && matchesValue;
  });
};

export const getUniqueValues = <T>(items: T[], key: keyof T): T[keyof T][] => {
  return [...new Set(items.map(item => item[key]))];
};