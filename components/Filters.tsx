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
  Camera,
  GripVertical,
  Globe,
  ShoppingBag,
  Zap
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const SALES_CHANNELS = [
  { id: 'C1', name: 'Sklep Internetowy (B2C)', icon: <Globe size={14} /> },
  { id: 'C2', name: 'Platforma B2B', icon: <ShoppingBag size={14} /> },
  { id: 'C3', name: 'Allegro / Marketplace', icon: <Zap size={14} /> },
];

interface SortableRowProps {
  attr: SearchAttribute;
  sectionId: string;
  index: number;
  handleToggleFilter: (sectionId: string, attributeId: string) => void;
  handleUnitChange: (sectionId: string, attributeId: string, newUnit: string) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({ attr, sectionId, index, handleToggleFilter, handleUnitChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: attr.id,
    data: {
      type: 'attribute',
      sectionId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
    backgroundColor: isDragging ? 'white' : 'transparent',
    boxShadow: isDragging ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-gray-50/30 transition-all group ${isDragging ? 'opacity-50' : ''}`}>
      <td className="px-8 py-4 text-center">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 -ml-2 text-gray-300 hover:text-gray-500 transition-colors inline-block">
          <GripVertical size={18} />
        </div>
      </td>
      <td className="px-8 py-4 text-center">
        <span className="text-[10px] font-black text-gray-400">{index + 1}</span>
      </td>
      <td className="px-8 py-4">
        <button 
          onClick={() => handleToggleFilter(sectionId, attr.id)}
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
              onChange={(e) => handleUnitChange(sectionId, attr.id, e.target.value)}
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
  );
};

interface SortableSectionProps {
  section: SearchSection;
  searchQuery: string;
  handleToggleFilter: (sectionId: string, attributeId: string) => void;
  handleUnitChange: (sectionId: string, attributeId: string, newUnit: string) => void;
}

const SortableFilterSection: React.FC<SortableSectionProps> = ({ section, searchQuery, handleToggleFilter, handleUnitChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 40 : 'auto',
    position: 'relative' as const,
  };

  const filteredAttributes = section.attributes.filter(a => 
    a.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-8">
       <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 -ml-2 text-gray-300 hover:text-blue-600 transition-colors">
                <GripVertical size={20} />
             </div>
             <Layout size={18} className="text-gray-400" />
             <h5 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">{section.title}</h5>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded uppercase">{section.attributes.length} Atrybuty</span>
            <div className="flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
               <Settings2 size={10} /> Konfiguracja sekcji
            </div>
          </div>
       </div>
       <div className="p-0">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                   <th className="px-8 py-4 w-12 text-center">Grip</th>
                   <th className="px-8 py-4 w-12 text-center">Poz.</th>
                   <th className="px-8 py-4 w-12">Filtr</th>
                   <th className="px-8 py-4">Nazwa Atrybutu</th>
                   <th className="px-8 py-4">Typ Danych</th>
                   <th className="px-8 py-4">Jednostka / Wariacja</th>
                   <th className="px-8 py-4 text-right">Akcja</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                <SortableContext 
                  items={section.attributes.map(a => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredAttributes.map((attr, index) => (
                    <SortableRow 
                      key={attr.id} 
                      attr={attr} 
                      index={index}
                      sectionId={section.id} 
                      handleToggleFilter={handleToggleFilter}
                      handleUnitChange={handleUnitChange}
                    />
                  ))}
                </SortableContext>
             </tbody>
          </table>
       </div>
    </div>
  );
};

const Filters: React.FC = () => {
  const [templates, setTemplates] = useState<SearchTemplate[]>(MOCK_DATA);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MOCK_DATA[0].id);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(SALES_CHANNELS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedTemplate = useMemo(() => 
    templates.find(t => t.id === selectedTemplateId), 
    [templates, selectedTemplateId]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeData = active.data.current;

    setTemplates((prev) => prev.map(t => {
      if (t.id === selectedTemplateId) {
        if (activeData?.type === 'section') {
          // Reorder sections
          const oldIndex = t.sections.findIndex(s => s.id === activeId);
          const newIndex = t.sections.findIndex(s => s.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return {
              ...t,
              sections: arrayMove(t.sections, oldIndex, newIndex)
            };
          }
        } else if (activeData?.type === 'attribute') {
          // Reorder attributes (possibly across sections)
          let activeSectionIdx = -1;
          let overSectionIdx = -1;
          let activeAttrIdx = -1;
          let overAttrIdx = -1;

          t.sections.forEach((s, sIdx) => {
            const aIdx = s.attributes.findIndex(a => a.id === activeId);
            if (aIdx !== -1) {
              activeSectionIdx = sIdx;
              activeAttrIdx = aIdx;
            }
            const oIdx = s.attributes.findIndex(a => a.id === overId);
            if (oIdx !== -1) {
              overSectionIdx = sIdx;
              overAttrIdx = oIdx;
            }
          });

          // If dropped over a section header, move to the end of that section
          if (overSectionIdx === -1 && overId.startsWith('S')) {
            overSectionIdx = t.sections.findIndex(s => s.id === overId);
            overAttrIdx = t.sections[overSectionIdx].attributes.length;
          }

          if (activeSectionIdx !== -1 && overSectionIdx !== -1) {
            const newSections = [...t.sections];
            const [movedAttr] = newSections[activeSectionIdx].attributes.splice(activeAttrIdx, 1);
            
            // If overAttrIdx is still -1, it means we dropped over a section header
            const targetIdx = overAttrIdx === -1 ? newSections[overSectionIdx].attributes.length : overAttrIdx;
            newSections[overSectionIdx].attributes.splice(targetIdx, 0, movedAttr);
            
            return { ...t, sections: newSections };
          }
        }
      }
      return t;
    }));
  };

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
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic leading-none mb-2">Filtry B2B</h2>
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

      {/* Dropdown Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Template Selector */}
        <div className="relative">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-4 block">Typ Formatki</label>
          <button 
            onClick={() => {
              setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
              setIsChannelDropdownOpen(false);
            }}
            className="w-full h-14 flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] shadow-sm hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-blue-600">{selectedTemplate?.icon}</span>
              <span className="text-sm font-black text-gray-900">{selectedTemplate?.name}</span>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isTemplateDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-50">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Szukaj formatki..." 
                    className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {templates.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplateId(t.id);
                      setIsTemplateDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-all ${selectedTemplateId === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    <span className={selectedTemplateId === t.id ? 'text-blue-600' : 'text-gray-400'}>{t.icon}</span>
                    <span className="text-sm font-black">{t.name}</span>
                    {selectedTemplateId === t.id && <CheckCircle2 size={16} className="ml-auto text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sales Channel Selector */}
        <div className="relative">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-4 block">Kanał Sprzedaży</label>
          <button 
            onClick={() => {
              setIsChannelDropdownOpen(!isChannelDropdownOpen);
              setIsTemplateDropdownOpen(false);
            }}
            className="w-full h-14 flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] shadow-sm hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-emerald-600">{SALES_CHANNELS.find(c => c.id === selectedChannelId)?.icon}</span>
              <span className="text-sm font-black text-gray-900">{SALES_CHANNELS.find(c => c.id === selectedChannelId)?.name}</span>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${isChannelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isChannelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {SALES_CHANNELS.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => {
                      setSelectedChannelId(c.id);
                      setIsChannelDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-all ${selectedChannelId === c.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'}`}
                  >
                    <span className={selectedChannelId === c.id ? 'text-emerald-600' : 'text-gray-400'}>{c.icon}</span>
                    <span className="text-sm font-black">{c.name}</span>
                    {selectedChannelId === c.id && <CheckCircle2 size={16} className="ml-auto text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Main: Filter Configuration */}
        <div className="space-y-6">
           {selectedTemplate ? (
             <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 border border-gray-100 shadow-inner">
                         <Layers size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Konfiguracja Filtrów</p>
                         <h4 className="text-lg font-black text-gray-900">{selectedTemplate.name} — {SALES_CHANNELS.find(c => c.id === selectedChannelId)?.name}</h4>
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
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded uppercase">{section.attributes.length} Atrybuty</span>
                          <div className="flex items-center gap-1 text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                             <GripVertical size={10} /> Kolejność aktywna
                          </div>
                        </div>
                     </div>
                     <div className="p-0">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                 <th className="px-8 py-4 w-12 text-center">Poz.</th>
                                 <th className="px-8 py-4 w-12">Filtr</th>
                                 <th className="px-8 py-4">Nazwa Atrybutu</th>
                                 <th className="px-8 py-4">Typ Danych</th>
                                 <th className="px-8 py-4">Jednostka / Wariacja</th>
                                 <th className="px-8 py-4 text-right">Akcja</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              <DndContext 
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(e) => handleDragEnd(e, section.id)}
                              >
                                <SortableContext 
                                  items={section.attributes.map(a => a.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {section.attributes
                                    .filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(attr => (
                                      <SortableRow 
                                        key={attr.id} 
                                        attr={attr} 
                                        sectionId={section.id} 
                                        handleToggleFilter={handleToggleFilter}
                                        handleUnitChange={handleUnitChange}
                                      />
                                    ))}
                                </SortableContext>
                              </DndContext>
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
                <h3 className="text-xl font-black text-gray-900 uppercase">Wybierz formatkę</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">Wybierz odpowiednią kategorię produktów z listy powyżej, aby skonfigurować filtry.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
