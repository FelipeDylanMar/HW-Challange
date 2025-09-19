import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LeadProvider, OpportunityProvider } from './context';
import { Home, Opportunities } from './pages';
import { LanguageSelector } from './components/UI/LanguageSelector';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                CRM System
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  location.pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {t('navigation.leads')}
              </Link>
              <Link
                to="/opportunities"
                className={`${
                  location.pathname === '/opportunities'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {t('navigation.opportunities')}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LeadProvider>
        <OpportunityProvider>
          <AppContent />
        </OpportunityProvider>
      </LeadProvider>
    </Router>
  );
}

export default App;
