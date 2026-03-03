
/**
 * APPLICATION VERSION: 1.0.0 (VER 1)
 * STATUS: STABLE SNAPSHOT
 * DATE: 2024-05-22
 */
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import MarketingDescriptions from './components/MarketingDescriptions';
import DescriptionImporter from './components/DescriptionImporter';
import SemanticSearch from './components/SemanticSearch';
import UserList from './components/UserList';
import Templates from './components/Templates';
import UnitsOfMeasure from './components/UnitsOfMeasure';
import ChangeLogList from './components/ChangeLogList';
import ProducerList from './components/ProducerList';
import Dictionaries from './components/Dictionaries';
import Filters from './components/Filters';
import { MenuSection } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<MenuSection>(MenuSection.DASHBOARD);
  const [initialMarketingActionId, setInitialMarketingActionId] = useState<string | null>(null);

  const handleNavigateToMarketing = (actionId: string) => {
    setInitialMarketingActionId(actionId);
    setActiveSection(MenuSection.MARKETING_DESCRIPTIONS);
  };

  const handleSectionChange = (section: MenuSection) => {
    // Reset initial ID when switching sections manually via sidebar
    if (section !== MenuSection.MARKETING_DESCRIPTIONS) {
      setInitialMarketingActionId(null);
    }
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case MenuSection.DASHBOARD:
        return <Dashboard />;
      case MenuSection.USERS:
        return <UserList />;
      case MenuSection.PRODUCTS:
        return <ProductList onNavigateToMarketing={handleNavigateToMarketing} />;
      case MenuSection.MARKETING_DESCRIPTIONS:
        return <MarketingDescriptions initialActionId={initialMarketingActionId} />;
      case MenuSection.PRODUCERS:
        return <ProducerList />;
      case MenuSection.IMPORTER:
        return <DescriptionImporter />;
      case MenuSection.FORMATKI:
        return <Templates />;
      case MenuSection.DICTIONARIES:
        return <Dictionaries />;
      case MenuSection.FILTERS:
        return <Filters />;
      case MenuSection.SEMANTIC_SEARCH:
        return <SemanticSearch />;
      case MenuSection.UNITS:
        return <UnitsOfMeasure />;
      case MenuSection.CHANGE_LOGS:
        return <ChangeLogList />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{activeSection}</h2>
              <p>Sekcja w przygotowaniu...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
