import type { Lead, Opportunity, SortConfig } from '../types/crm';

export const sortLeads = (leads: Lead[], sortConfig: SortConfig): Lead[] => {
  return [...leads].sort((a, b) => {
    const { field, direction } = sortConfig;
    let aValue = a[field as keyof Lead];
    let bValue = b[field as keyof Lead];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? -1 : 1;
    if (bValue == null) return direction === 'asc' ? 1 : -1;

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
    }
    if (typeof bValue === 'string') {
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const sortOpportunities = (opportunities: Opportunity[], sortConfig: SortConfig): Opportunity[] => {
  return [...opportunities].sort((a, b) => {
    const { field, direction } = sortConfig;
    let aValue = a[field as keyof Opportunity];
    let bValue = b[field as keyof Opportunity];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? -1 : 1;
    if (bValue == null) return direction === 'asc' ? 1 : -1;

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
    }
    if (typeof bValue === 'string') {
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const toggleSortDirection = (currentDirection: 'asc' | 'desc'): 'asc' | 'desc' => {
  return currentDirection === 'asc' ? 'desc' : 'asc';
};