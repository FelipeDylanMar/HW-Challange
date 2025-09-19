import type { Opportunity } from '../types/crm';
import mockOpportunities from '../assets/data/mockOpportunities.json';
import i18n from '../i18n';

const CUSTOM_OPPORTUNITIES_KEY = 'crm_custom_opportunities';

class OpportunityStorage {
  private getCustomOpportunities(): Opportunity[] {
    try {
      const stored = localStorage.getItem(CUSTOM_OPPORTUNITIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(i18n.t('messages.errorLoadingCustomOpportunities'), error);
      return [];
    }
  }

  private saveCustomOpportunities(opportunities: Opportunity[]): void {
    try {
      localStorage.setItem(CUSTOM_OPPORTUNITIES_KEY, JSON.stringify(opportunities));
    } catch (error) {
      console.error(i18n.t('messages.errorSavingOpportunities'), error);
      throw new Error(i18n.t('messages.errorSavingOpportunity'));
    }
  }

  getAllOpportunities(): Opportunity[] {
    try {
      const mockData = mockOpportunities as Opportunity[];
      const customOpportunities = this.getCustomOpportunities();
      const deletedOpportunities = this.getDeletedOpportunities();
      
      console.log('OpportunityStorage Debug:', {
        mockDataLength: mockData.length,
        customOpportunitiesLength: customOpportunities.length,
        deletedOpportunitiesLength: deletedOpportunities.length
      });
      
      const validMockData = mockData.filter(opp => {
        const isValid = opp && typeof opp === 'object' && opp.id && typeof opp.id === 'string';
        if (!isValid) {
          console.warn(i18n.t('messages.invalidMockData'), opp);
        }
        return isValid;
      });
      
      const validCustomOpportunities = customOpportunities.filter(opp => {
        const isValid = opp && typeof opp === 'object' && opp.id && typeof opp.id === 'string';
        if (!isValid) {
          console.warn(i18n.t('messages.invalidCustomData'), opp);
        }
        return isValid;
      });
      
      const filteredMockData = validMockData.filter(opp => !deletedOpportunities.includes(opp.id));
      
      const customIds = validCustomOpportunities.map(opp => opp.id);
      const uniqueMockData = filteredMockData.filter(opp => !customIds.includes(opp.id));
      
      const result = [...uniqueMockData, ...validCustomOpportunities];
      console.log('OpportunityStorage Result:', {
        totalOpportunities: result.length,
        mockOpportunities: uniqueMockData.length,
        customOpportunities: validCustomOpportunities.length
      });
      
      return result;
    } catch (error) {
      console.error(i18n.t('messages.errorLoadingOpportunities'), error);
      return (mockOpportunities as Opportunity[]).filter(opp => 
        opp && typeof opp === 'object' && opp.id && typeof opp.id === 'string'
      );
    }
  }

  addOpportunity(opportunity: Opportunity): void {
    const customOpportunities = this.getCustomOpportunities();
    customOpportunities.push(opportunity);
    this.saveCustomOpportunities(customOpportunities);
  }

  updateOpportunity(updatedOpportunity: Opportunity): void {
    const customOpportunities = this.getCustomOpportunities();
    const index = customOpportunities.findIndex(opp => opp.id === updatedOpportunity.id);
    
    if (index !== -1) {
      customOpportunities[index] = updatedOpportunity;
      this.saveCustomOpportunities(customOpportunities);
    } else {
      this.addOpportunity(updatedOpportunity);
    }
  }

  deleteOpportunity(opportunityId: string): void {
    const customOpportunities = this.getCustomOpportunities();
    const mockData = mockOpportunities as Opportunity[];
    
    const filteredCustom = customOpportunities.filter(opp => opp.id !== opportunityId);
    
    const isMockOpportunity = mockData.some(opp => opp.id === opportunityId);
    if (isMockOpportunity) {
      const deletedOpportunities = this.getDeletedOpportunities();
      deletedOpportunities.push(opportunityId);
      this.saveDeletedOpportunities(deletedOpportunities);
    }
    
    this.saveCustomOpportunities(filteredCustom);
  }

  private getDeletedOpportunities(): string[] {
    try {
      const stored = localStorage.getItem('crm_deleted_opportunities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(i18n.t('messages.errorLoadingDeletedOpportunities'), error);
      return [];
    }
  }

  private saveDeletedOpportunities(deletedIds: string[]): void {
    try {
      localStorage.setItem('crm_deleted_opportunities', JSON.stringify(deletedIds));
    } catch (error) {
      console.error(i18n.t('messages.errorSavingDeletedOpportunities'), error);
    }
  }

  clearCustomOpportunities(): void {
    try {
      localStorage.removeItem(CUSTOM_OPPORTUNITIES_KEY);
    } catch (error) {
      console.error(i18n.t('messages.errorClearingOpportunities'), error);
    }
  }

  clearAllStorageData(): void {
    try {
      localStorage.removeItem(CUSTOM_OPPORTUNITIES_KEY);
      localStorage.removeItem('crm_deleted_opportunities');
      localStorage.removeItem('opportunities-manager');
      console.log(i18n.t('messages.allOpportunitiesCleared'));
    } catch (error) {
      console.error(i18n.t('messages.errorClearingStorage'), error);
    }
  }

  convertLeadToOpportunity(leadId: string, opportunityData: Partial<Opportunity>): Opportunity {
    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadId: leadId,
      name: opportunityData.name || i18n.t('messages.newOpportunity'),
      stage: opportunityData.stage || 'prospecting',
      amount: opportunityData.amount || undefined,
      accountName: opportunityData.accountName || '',
      expectedCloseDate: opportunityData.expectedCloseDate || undefined,
      description: opportunityData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.addOpportunity(newOpportunity);
    return newOpportunity;
  }
}

export const opportunityStorage = new OpportunityStorage();