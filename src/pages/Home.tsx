import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lead, Opportunity } from '../types/crm';
import { LeadsManager } from '../components';
import { LeadViewModal } from '../components/Leads';
import { useLeadContext, useOpportunityContext } from '../hooks';
import { Button, StatsGrid, type StatsCardProps, NewLeadModal, ConvertLeadModal } from '../components/UI';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { leads, deleteLead, addLead, isLoading, error, refreshLeads } = useLeadContext();
  const { convertLeadToOpportunity } = useOpportunityContext();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedLead(null);
  };



  const handleLeadDelete = (leadId: string) => {
    deleteLead(leadId);
    if (selectedLead?.id === leadId) {
      handleViewModalClose();
    }
  };

  const handleConvertToOpportunity = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsConvertModalOpen(true);
  };

  const handleNewLead = (leadData: Lead) => {
    addLead(leadData);
    setIsNewLeadModalOpen(false);
  };

  const handleOpenNewLeadModal = () => {
    setIsNewLeadModalOpen(true);
  };

  const handleCloseNewLeadModal = () => {
    setIsNewLeadModalOpen(false);
  };

  const handleConvertSubmit = (lead: Lead, opportunityData: Partial<Opportunity>) => {
    try {
      // Converte o lead para oportunidade usando a função correta
      convertLeadToOpportunity(lead, opportunityData);
      
      // Remove o lead da tabela após conversão
      deleteLead(lead.id);
      
      setIsConvertModalOpen(false);
      setLeadToConvert(null);
      
      // Fechar o modal se o lead convertido estava selecionado
      if (selectedLead?.id === lead.id) {
        setIsViewModalOpen(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Erro ao converter lead:', error);
    }
  };

  const handleCloseConvertModal = () => {
    setIsConvertModalOpen(false);
    setLeadToConvert(null);
  };

  const statsData: StatsCardProps[] = [
    {
      title: t('leads.totalLeads'),
      value: leads.length,
      icon: "L",
      iconColor: "blue"
    },
    {
      title: t('leads.qualifiedLeads'),
      value: leads.filter(lead => lead.status === 'qualified').length,
      icon: "Q",
      iconColor: "green"
    },
    {
      title: t('leads.convertedLeads'),
      value: leads.filter(lead => lead.status === 'converted').length,
      icon: "C",
      iconColor: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('common.crmDashboard')}</h1>
              <p className="mt-2 text-gray-600">{t('common.manageLeadsOpportunities')}</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="primary" onClick={handleOpenNewLeadModal}>
                {t('leads.newLead')}
              </Button>
            </div>
          </div>
        </div>

        <StatsGrid 
          stats={statsData} 
          columns={3} 
          className="mb-8" 
        />

        <LeadsManager
          leads={leads}
          onLeadSelect={handleLeadSelect}
          onConvertToOpportunity={handleConvertToOpportunity}
          onLeadDelete={handleLeadDelete}
          isLoading={isLoading}
          error={error}
          onRetry={refreshLeads}
        />

        <LeadViewModal
          lead={selectedLead}
          isOpen={isViewModalOpen}
          onClose={handleViewModalClose}
          onConvertToOpportunity={handleConvertToOpportunity}
        />

        <NewLeadModal
          isOpen={isNewLeadModalOpen}
          onClose={handleCloseNewLeadModal}
          onSubmit={handleNewLead}
        />

        <ConvertLeadModal
          isOpen={isConvertModalOpen}
          lead={leadToConvert}
          onClose={handleCloseConvertModal}
          onConvert={handleConvertSubmit}
        />
      </div>
    </div>
  );
};

export default Home;