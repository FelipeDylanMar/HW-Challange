import React, { useState, useEffect } from 'react';
import type { Lead, LeadStatus, LeadSource } from '../types/crm';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
  onConvertToOpportunity?: (lead: Lead) => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  isOpen,
  onClose,
  onSave,
  onConvertToOpportunity
}) => {
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead });
      setError(null);
      setEmailError(null);
    }
  }, [lead]);

  if (!lead || !editedLead) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setEditedLead({ ...editedLead, email });
    if (email && !validateEmail(email)) {
      setEmailError('Formato de email inválido');
    } else {
      setEmailError(null);
    }
  };

  const handleSave = async () => {
    setError(null);
    
    // Validação antes de salvar
    if (!validateEmail(editedLead.email)) {
      setEmailError('Formato de email inválido');
      return;
    }

    if (!editedLead.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    // Store original lead for rollback
    const originalLead = { ...lead };
    
    // Optimistic update - apply changes immediately
    onSave(editedLead);
    setIsEditing(false);
    setIsLoading(true);
    
    try {
      // Simular latência
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simular possível erro (15% de chance para demonstrar rollback)
      if (Math.random() < 0.15) {
        throw new Error('Falha na conexão. Alterações foram revertidas.');
      }
      
      // Success - optimistic update was correct
      console.log('✅ Alterações salvas com sucesso');
    } catch (err) {
      // Rollback - revert to original state
      onSave(originalLead);
      setEditedLead({ ...originalLead });
      setIsEditing(true);
      setError(err instanceof Error ? err.message : 'Erro desconhecido. Alterações foram revertidas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedLead({ ...lead });
    setIsEditing(false);
    setError(null);
    setEmailError(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      unqualified: 'bg-red-100 text-red-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 max-w-full flex z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-4 py-6 bg-gray-50 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Detalhes do Lead
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    onClick={onClose}
                    className="bg-gray-50 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Fechar painel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 sm:px-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mb-6">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Editar
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isLoading || !!emailError}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                          isLoading || emailError
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </div>
                        ) : (
                          'Salvar'
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                          isLoading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                        }`}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {lead.status === 'qualified' && !isEditing && (
                    <button
                      onClick={() => onConvertToOpportunity?.(lead)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Converter para Opportunity
                    </button>
                  )}
                </div>

                {/* Lead Information */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLead.name}
                            onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{lead.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        {isEditing ? (
                          <div>
                            <input
                              type="email"
                              value={editedLead.email}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                emailError 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder="exemplo@email.com"
                            />
                            {emailError && (
                              <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-900">{lead.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedLead.phone}
                            onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{lead.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLead.company}
                            onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{lead.company}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posição</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLead.position}
                            onChange={(e) => setEditedLead({ ...editedLead, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{lead.position}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status and Metrics */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Status e Métricas</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        {isEditing ? (
                          <select
                            value={editedLead.status}
                            onChange={(e) => setEditedLead({ ...editedLead, status: e.target.value as LeadStatus })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="qualified">Qualificado</option>
                            <option value="unqualified">Não Qualificado</option>
                            <option value="converted">Convertido</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
                        {isEditing ? (
                          <select
                            value={editedLead.source}
                            onChange={(e) => setEditedLead({ ...editedLead, source: e.target.value as LeadSource })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Website">Website</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Referral">Indicação</option>
                            <option value="Event">Evento</option>
                            <option value="Cold Call">Cold Call</option>
                            <option value="Email">Email</option>
                            <option value="Social Media">Redes Sociais</option>
                          </select>
                        ) : (
                          <p className="text-sm text-gray-900">{lead.source}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editedLead.score}
                            onChange={(e) => setEditedLead({ ...editedLead, score: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
                    {isEditing ? (
                      <textarea
                        value={editedLead.notes}
                        onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Adicione observações sobre este lead..."
                      />
                    ) : (
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{lead.notes}</p>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datas</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                        <p className="text-sm text-gray-900">{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Último contato</label>
                        <p className="text-sm text-gray-900">{new Date(lead.lastContact).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPanel;