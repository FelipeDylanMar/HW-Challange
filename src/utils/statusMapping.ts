import type { BadgeVariant } from '../components/UI/StatusBadge';
import i18n from '../i18n';

export const getLeadStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    unqualified: 'bg-red-100 text-red-800',
    converted: 'bg-purple-100 text-purple-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getOpportunityStageColor = (stage: string): string => {
  const stageColors: Record<string, string> = {
    prospecting: 'bg-blue-100 text-blue-800',
    qualification: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-purple-100 text-purple-800',
    negotiation: 'bg-orange-100 text-orange-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800'
  };
  return stageColors[stage] || 'bg-gray-100 text-gray-800';
};

export const getStatusVariant = (status: string): BadgeVariant => {
  const statusMap: Record<string, BadgeVariant> = {
    'new': 'info',
    'contacted': 'warning',
    'qualified': 'success',
    'unqualified': 'danger',
    'converted': 'secondary',
    
    'prospecting': 'info',
    'qualification': 'warning',
    'proposal': 'secondary',
    'negotiation': 'warning',
    'closed-won': 'success',
    'closed-lost': 'danger'
  };
  return statusMap[status] || 'default';
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'new': i18n.t('status.new'),
    'contacted': i18n.t('status.contacted'),
    'qualified': i18n.t('status.qualified'),
    'unqualified': i18n.t('status.unqualified'),
    'converted': i18n.t('status.converted'),
    
    'prospecting': i18n.t('status.prospecting'),
    'qualification': i18n.t('status.qualification'),
    'proposal': i18n.t('status.proposal'),
    'negotiation': i18n.t('status.negotiation'),
    'closed-won': i18n.t('status.closedWon'),
    'closed-lost': i18n.t('status.closedLost')
  };
  return statusLabels[status] || status;
};

export const getSourceLabel = (source: string): string => {
  const sourceLabels: Record<string, string> = {
    'website': i18n.t('sources.website'),
    'social-media': i18n.t('sources.socialMedia'),
    'email-campaign': i18n.t('sources.emailCampaign'),
    'referral': i18n.t('sources.referral'),
    'cold-call': i18n.t('sources.coldCall'),
    'event': i18n.t('sources.event'),
    'organic-search': i18n.t('sources.organicSearch'),
    'paid-ads': i18n.t('sources.paidAds')
  };
  return sourceLabels[source] || source;
};