import { useState, useEffect } from 'react';
import type { Lead, Opportunity } from './types/crm';
import LeadsList from './components/LeadsList';
import LeadDetailPanel from './components/LeadDetailPanel';
import OpportunitiesList from './components/OpportunitiesList';
import mockLeads from './data/mockLeads.json';
import mockOpportunities from './data/mockOpportunities.json';

function App() {
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (Math.random() < 0.05) {
          throw new Error('Falha ao carregar dados do servidor');
        }
        
        setLeads(mockLeads as Lead[]);
        setOpportunities(mockOpportunities as Opportunity[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleLeadDelete = (leadId: string) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  const handleOpportunityDelete = (opportunityId: string) => {
    setOpportunities(opportunities.filter(opportunity => opportunity.id !== opportunityId));
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedLead(null);
  };

  const handleConvertToOpportunity = async (lead: Lead) => {
    const originalLeads = [...leads];
    const originalOpportunities = [...opportunities];
    
    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      leadId: lead.id,
      name: `${lead.company} - Opportunity`,
      stage: 'prospecting',
      amount: 10000,
      accountName: lead.company,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: `Opportunity convertida do lead ${lead.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOpportunities([...opportunities, newOpportunity]);
    const updatedLead = { ...lead, status: 'converted' as const };
    handleLeadUpdate(updatedLead);
    setIsPanelOpen(false);
    setActiveTab('opportunities');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() < 0.20) {
        throw new Error('Falha na conversão. Operação foi revertida.');
      }
      
      alert(`✅ Lead ${lead.name} convertido para Opportunity com sucesso!`);
      console.log('✅ Conversão realizada com sucesso');
    } catch (error) {
      setLeads(originalLeads);
      setOpportunities(originalOpportunities);
      setActiveTab('leads');
      alert(error instanceof Error ? error.message : 'Erro ao converter lead. Alterações foram revertidas.');
    }
  };

  const handleRetry = () => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (Math.random() < 0.05) {
          throw new Error('Falha ao carregar dados do servidor');
        }
        
        setLeads(mockLeads as Lead[]);
        setOpportunities(mockOpportunities as Opportunity[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 sm:py-8">
            <div className="text-center w-full">
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
                Mini Seller Console
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-500 font-light">
                Gerencie seus leads e opportunities com elegância
              </p>
            </div>
          </div>
        </div>
      </header>

        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-1 shadow-sm border border-gray-200/50">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Leads
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {leads.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'opportunities'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Opportunities
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {opportunities.length}
                </span>
              </button>
            </div>
          </div>
        </div>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'leads' && (
          leads.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="mx-auto h-20 w-20 text-gray-300 mb-8">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-light text-gray-900 mb-4">Nenhum lead disponível</h3>
                <p className="text-gray-500 font-light leading-relaxed mb-8">
                  Comece a capturar leads para impulsionar suas vendas. Seus primeiros contatos aparecerão aqui.
                </p>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Dica:</span>
                    <span className="font-light">Integre formulários de contato para capturar leads automaticamente</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LeadsList
              leads={leads}
              onLeadUpdate={handleLeadUpdate}
              onLeadDelete={handleLeadDelete}
              onLeadSelect={handleLeadSelect}
              onConvertToOpportunity={handleConvertToOpportunity}
            />
          )
        )}
        
        {activeTab === 'opportunities' && (
          <OpportunitiesList 
            opportunities={opportunities} 
            onOpportunityDelete={handleOpportunityDelete}
          />
        )}
      </main>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onSave={handleLeadUpdate}
        onConvertToOpportunity={handleConvertToOpportunity}
      />
    </div>
  );
}

export default App;
