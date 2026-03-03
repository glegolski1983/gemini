
import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  Package, 
  Users, 
  Share2, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  ChevronDown,
  ClipboardList,
  Ruler,
  History,
  Factory,
  Lock,
  Filter,
  Palette
} from 'lucide-react';
import { MenuSection } from '../types';

interface SidebarProps {
  activeSection: MenuSection;
  onSectionChange: (section: MenuSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  // Define menu items with disabled state and new order
  const menuItems = [
    { id: MenuSection.DASHBOARD, label: 'DASHBOARD', icon: <LayoutDashboard size={18} />, hasSub: true, disabled: false },
    { id: MenuSection.PRODUCTS, label: 'PRODUKTY', icon: <Package size={18} />, hasSub: true, disabled: false },
    { id: MenuSection.MARKETING_DESCRIPTIONS, label: 'OPISY MARKETINGOWE', icon: <Palette size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.PRODUCERS, label: 'NAZWY PRODUCENTÓW', icon: <Factory size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.FORMATKI, label: 'FORMATKI', icon: <ClipboardList size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.DICTIONARIES, label: 'SEKCJE I ATRYBUTY', icon: <BookOpen size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.FILTERS, label: 'FILTRY', icon: <Filter size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.UNITS, label: 'JEDNOSTKI MIARY', icon: <Ruler size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.USERS, label: 'UŻYTKOWNICY', icon: <Users size={18} />, hasSub: false, disabled: false },
    { id: MenuSection.CHANGE_LOGS, label: 'LOGOWANIE ZMIAN', icon: <History size={18} />, hasSub: false, disabled: false },
    // Advanced / Future sections moved to bottom and disabled
    { id: MenuSection.IMPORTER, label: 'IMPORTER OPISÓW', icon: <FileUp size={18} />, hasSub: false, disabled: true },
    { id: MenuSection.GRAPH_DB, label: 'BAZA GRAFOWA', icon: <Share2 size={18} />, hasSub: false, disabled: true },
    { id: MenuSection.COMPATIBILITY, label: 'KOMPATYBILNOŚCI', icon: <CheckCircle2 size={18} />, hasSub: false, disabled: true },
    { id: MenuSection.SEMANTIC_SEARCH, label: 'SZUKANIE SEMANTYCZNE', icon: <Search size={18} />, hasSub: false, disabled: true },
  ];

  return (
    <aside className="w-64 bg-[#1a1c23] text-gray-400 flex flex-col h-full border-r border-gray-800 shrink-0">
      <div className="p-4 bg-white mb-6">
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-12 flex items-center justify-center">
             <div className="absolute inset-0 bg-blue-50 rounded-lg flex items-center justify-center">
               <BookOpen className="text-blue-600" size={24} />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-white border border-blue-100 rounded px-1 flex items-center gap-0.5">
               <span className="text-[8px] font-bold text-blue-800">AI</span>
             </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#1a2b4d] font-bold text-sm leading-tight tracking-tighter">
              PANEL OPISOWY
            </h1>
            <span className="text-[10px] text-green-600 font-bold tracking-widest uppercase">
              Katalog Produktów
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 custom-scrollbar overflow-y-auto pt-2">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isDisabled = item.disabled;
            const isActive = activeSection === item.id;
            
            // Render a divider before the disabled block for better UX
            const showDivider = item.id === MenuSection.IMPORTER;

            return (
              <li key={item.id}>
                {showDivider && <div className="mx-3 my-4 border-t border-gray-800/40" />}
                <button
                  onClick={() => !isDisabled && onSectionChange(item.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all text-xs font-semibold tracking-wider ${
                    isDisabled 
                      ? 'opacity-30 cursor-not-allowed' 
                      : isActive 
                        ? 'text-white bg-blue-600 shadow-lg shadow-blue-900/20' 
                        : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive && !isDisabled ? 'text-white' : 'text-gray-500 group-hover:text-white'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {isDisabled && <Lock size={12} className="text-gray-600 ml-2" />}
                    {item.hasSub && !isDisabled && (
                      <ChevronDown size={14} className={isActive ? 'rotate-0' : '-rotate-90'} />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest text-center">
        v2.4.0 Stable
      </div>
    </aside>
  );
};

export default Sidebar;
