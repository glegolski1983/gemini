
import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Settings2, 
  ChevronDown, 
  Search, 
  CheckCircle2, 
  X, 
  Save, 
  Database,
  Monitor,
  Layout,
  Ruler,
  Layers,
  ChevronRight,
  Info,
  ExternalLink,
  Smartphone,
  Laptop,
  Camera
} from 'lucide-react';

interface UnitVariation {
  id: string;
  symbol: string;
}

interface SearchAttribute {
  id: string;
  label: string;
  type: 'Liczba' | 'Lista' | 'Checkbox' | 'Tekst';
  activeInFilters: boolean;
  unitGroup: string | null;
  selectedUnit: string | null;
}

interface SearchSection {
  id: string;
  title: string;
  attributes: SearchAttribute[];
}

interface SearchTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  sections: SearchSection[];
}

const UNIT_GROUPS: Record<string, string[]> = {
  length: ['mm', 'cm', 'm', 'cale'],
  weight: ['g', 'kg', 'lb'],
  storage: ['MB', 'GB', 'TB'],
  frequency: ['Hz', 'kHz', 'MHz', 'GHz'],
  angle: ['°']
};

const MOCK_DATA: SearchTemplate[] = [
  {
    id: 'T1',
    name: 'Notebooki',
    icon: <Laptop size={20} />,
    sections: [
      {
        id: 'S1',
        title: 'PROCESOR',
        attributes: [
          { id: 'A1', label: 'Model procesora', type: 'Lista', activeInFilters: true, unitGroup: null, selectedUnit: null },
          { id: 'A2', label: 'Liczba rdzeni', type: 'Liczba', activeInFilters: true, unitGroup: null, selectedUnit: null },
          { id: 'A3', label: 'Taktowanie procesora', type: 'Liczba', activeInFilters: false, unitGroup: 'frequency', selectedUnit: 'GHz' },
        ]
      },
      {
        id: 'S2',
        title: 'EKRAN',
        attributes: [
          { id: 'A4', label: 'Przekątna ekranu', type: 'Liczba', activeInFilters: true, unitGroup: 'length', selectedUnit: 'cale' },
          { id: 'A5', label: 'Rozdzielczość', type: 'Lista', activeInFilters: true, unitGroup: null, selectedUnit: null },
          { id: 'A6', label: 'Typ matrycy', type: 'Lista', activeInFilters: false, unitGroup: null, selectedUnit: null },
        ]
      },
      {
        id: 'S3',
        title: 'PAMIĘĆ',
        attributes: [
          { id: 'A7', label: 'Wielkość pamięci RAM', type: 'Liczba', activeInFilters: true, unitGroup: 'storage', selectedUnit: 'GB' },
          { id: 'A8', label: 'Pojemność dysku', type: 'Liczba', activeInFilters: true, unitGroup: 'storage', selectedUnit: 'GB' },
        ]
      }
    ]
  },
  {
    id: 'T2',
    name: 'Smartfony',
    icon: <Smartphone size={20} />,
    sections: [
      {
        id: 'S4',
        title: 'APARAT',
        attributes: [
          { id: 'A9', label: 'Rozdzielczość aparatu', type: 'Liczba', activeInFilters: true, unitGroup: null, selectedUnit: 'Mpix' },
          { id: 'A10', label: 'Liczba aparatów', type: 'Liczba', activeInFilters: false, unitGroup: null, selectedUnit: null },
        ]
      },
      {
        id: 'S5',
        title: 'BATERIA',
        attributes: [
          { id: 'A11', label: 'Pojemność baterii', type: 'Liczba', activeInFilters: true, unitGroup: 'storage', selectedUnit: 'mAh' },
        ]
      }
    ]
  },
  {
    id: 'T3',
    name: 'Kamery',
    icon: <Camera size={20} />,
    sections: [
      {
        id: 'S6',
        title: 'PARAMETRY WIDEO',
        attributes: [
          { id: 'A12', label: 'Maksymalna rozdzielczość', type: 'Lista', activeInFilters: true, unitGroup: null, selectedUnit: null },
          { id: 'A13', label: 'Szybkość klatek', type: 'Liczba', activeInFilters: true, unitGroup: null, selectedUnit: 'fps' },
        ]
      }
    ]
  }
];

const SearchParameters: React.FC = () => {
  const [templates, setTemplates] = useState<SearchTemplate[]>(MOCK_DATA);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MOCK_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedTemplate = useMemo(() => 
    templates.find(t => t.id === selectedTemplateId), 
    [templates, selectedTemplateId]
  );

  const handleToggleFilter = (sectionId: string, attributeId: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === selectedTemplateId) {
        return {
          ...t,
          sections: t.sections.map(s => {
            if (s.id === sectionId) {
              return {
                ...s,
                attributes: s.attributes.map(a => 
                  a.id === attributeId ? { ...a, activeInFilters: !a.activeInFilters } : a
                )
              };
            }
            return s;
          })
        };
      }
      return t;
    }));
  };

  const handleUnitChange = (sectionId: string, attributeId: string, newUnit: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === selectedTemplateId) {
        return {
          ...t,
          sections: t.sections.map(s => {
            if (s.id === sectionId) {
              return {
                ...s,
                attributes: s.attributes.map(a => 
                  a.id === attributeId ? { ...a, selectedUnit: newUnit } : a
                )
              };
            }
            return s;
          })
        };
      }
      return t;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    alert('Konfiguracja filtrów wyszukiwania została zapisana pomyślnie.');
  };

  return (
    <div className="max-w-full space-y-6 animate-in fade-in duration-500 text-black pb-20">
      {/* Header Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <Filter size={120} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Filter size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic leading-none mb-2">Parametry wyszukiwania B2B</h2>
            <p className="text-sm text-gray-500 font-medium max-w-lg">Skonfiguruj atrybuty i sekcje techniczne, które mają być dostępne jako filtry w Twoim sklepie internetowym.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-10 py-4 bg-[#107c41] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all shadow-xl shadow-green-200/50 disabled:opacity-50"
        >
          {isSaving ? <Layers className="animate-spin" size={18} /> : <Save size={18} />}
          Zapisz konfigurację filtrów
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Template List */}
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Typy Formatek</h3>
              <div className="space-y-1">
                 {templates.map(t => (
                   <button 
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${selectedTemplateId === t.id ? 'bg-[#1a2b4d] text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
                   >
                     <div className="flex items-center gap-3">
                        <span className={selectedTemplateId === t.id ? 'text-blue-300' : 'text-gray-400 group-hover:text-blue-600'}>{t.icon}</span>
                        <span className="text-sm font-black tracking-tight">{t.name}</span>
                     </div>
                     <ChevronRight size={16} className={selectedTemplateId === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                 <Info size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Wskazówka</span>
              </div>
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed">Filtry zostaną odświeżone w sklepie natychmiast po zapisaniu i synchronizacji z bazą danych PIMM.</p>
           </div>
        </div>

        {/* Main: Parameter Configuration */}
        <div className="lg:col-span-9 space-y-6">
           {selectedTemplate ? (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 border border-gray-100 shadow-inner">
                         <Layers size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Aktywna Formatka</p>
                         <h4 className="text-lg font-black text-gray-900">{selectedTemplate.name}</h4>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="relative w-64">
                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                            type="text" 
                            placeholder="Szukaj parametru..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                         />
                      </div>
                   </div>
                </div>

                {selectedTemplate.sections.map(section => (
                  <div key={section.id} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
                     <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Layout size={18} className="text-gray-400" />
                           <h5 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">{section.title}</h5>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded uppercase">{section.attributes.length} Atrybuty</span>
                     </div>
                     <div className="p-0">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                 <th className="px-8 py-4 w-12">Filtr</th>
                                 <th className="px-8 py-4">Nazwa Atrybutu</th>
                                 <th className="px-8 py-4">Typ Danych</th>
                                 <th className="px-8 py-4">Jednostka / Wariacja</th>
                                 <th className="px-8 py-4 text-right">Akcja</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {section.attributes
                                .filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(attr => (
                                 <tr key={attr.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-8 py-4">
                                       <button 
                                          onClick={() => handleToggleFilter(section.id, attr.id)}
                                          className={`w-10 h-6 rounded-full relative transition-all duration-300 border ${attr.activeInFilters ? 'bg-emerald-500 border-emerald-600 shadow-md' : 'bg-gray-200 border-gray-300'}`}
                                       >
                                          <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-300 shadow-sm flex items-center justify-center ${attr.activeInFilters ? 'translate-x-4' : 'translate-x-0'}`}>
                                            {attr.activeInFilters && <CheckCircle2 size={10} className="text-emerald-500" />}
                                          </div>
                                       </button>
                                    </td>
                                    <td className="px-8 py-4">
                                       <span className="text-sm font-black text-gray-800 tracking-tight">{attr.label}</span>
                                    </td>
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-tighter w-fit shadow-sm">
                                          {attr.type === 'Liczba' && <Ruler size={12} className="text-blue-500" />}
                                          {attr.type === 'Lista' && <Layers size={12} className="text-amber-500" />}
                                          {attr.type}
                                       </div>
                                    </td>
                                    <td className="px-8 py-4">
                                       {attr.unitGroup ? (
                                         <div className="relative w-fit">
                                            <select 
                                              value={attr.selectedUnit || ''}
                                              onChange={(e) => handleUnitChange(section.id, attr.id, e.target.value)}
                                              className="appearance-none bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none pr-8 cursor-pointer hover:bg-blue-100 transition-all"
                                            >
                                               {UNIT_GROUPS[attr.unitGroup].map(u => (
                                                 <option key={u} value={u}>{u}</option>
                                               ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                                         </div>
                                       ) : attr.selectedUnit ? (
                                          <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">{attr.selectedUnit}</span>
                                       ) : (
                                         <span className="text-[10px] font-bold text-gray-300 italic">Brak jednostki</span>
                                       )}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                       <button className="p-2 text-gray-300 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
                                          <Settings2 size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                   <Filter size={48} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Wybierz formatkę z listy</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">Wybierz odpowiednią kategorię produktów po lewej stronie, aby skonfigurować parametry wyszukiwania dla swojego sklepu.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SearchParameters;
