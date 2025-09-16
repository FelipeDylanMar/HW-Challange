export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
export type LeadSource = 'Website' | 'LinkedIn' | 'Referral' | 'Event' | 'Cold Call' | 'Email' | 'Social Media';
export type OpportunityStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
export type Priority = 'low' | 'medium' | 'high';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0-100
  notes: string;
  createdAt: string;
  lastContact: string;
  tags?: string[];
  assignedTo?: string;
}

export interface Opportunity {
  id: string;
  leadId?: string;
  name: string;
  stage: OpportunityStage;
  amount?: number; // Optional as per requirements
  accountName: string;
  expectedCloseDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  scoreRange?: [number, number];
  dateRange?: [string, string];
  search?: string;
}

export interface OpportunityFilters {
  stage?: OpportunityStage[];
  priority?: Priority[];
  valueRange?: [number, number];
  probabilityRange?: [number, number];
  search?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}