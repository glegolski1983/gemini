
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Plus, Search, Layout, Database, Edit3, 
  Trash2, ChevronRight, Info, Brain, Hash, Type, 
  List, CheckSquare, Settings2, ArrowRight, X, 
  Save, Filter, MoreVertical, Layers, CheckCircle2,
  AlertCircle, Activity, Tag, Ruler, Copy, Merge,
  ChevronDown
} from 'lucide-react';

interface DictionarySection {
  id: string;
  name: string;
  description: string;
  mappingHint: string;
  usageCount: number;
  status: 'active' | 'archived';
  mergedSynonyms: string[];
}

interface ListValue {
  id: string;
  value: string;
  addedBy: string;
  addedAt: string;
  isManual: boolean;
}

interface DictionaryAttribute {
  id: string;
  label: string;
  productType: string;
  type: 'Liczba' | 'Tekst' | 'Lista' | 'Checkbox';
  unitGroup: string | null;
  mappingHint: string;
  usageCount: number;
  status: 'active' | 'draft';
  mergedSynonyms: string[];
  listValues?: ListValue[];
}

const MOCK_SECTIONS: DictionarySection[] = [
  { 
    id: 'S-001', 
    name: 'CECHY', 
    description: 'Ogólne cechy konstrukcyjne i materiałowe.', 
    mappingHint: 'Mapuje: materiał, wykończenie, kolor, styl.', 
    usageCount: 45, 
    status: 'active',
    mergedSynonyms: ['Konstrukcja', 'Design', 'Wygląd', 'Informacje ogólne']
  },
  { 
    id: 'S-002', 
    name: 'PROCESOR', 
    description: 'Parametry jednostki obliczeniowej.', 
    mappingHint: 'Mapuje: CPU, rdzenie, taktowanie, cache.', 
    usageCount: 12, 
    status: 'active',
    mergedSynonyms: ['CPU', 'Jednostka centralna', 'Układ scalony']
  },
  { 
    id: 'S-003', 
    name: 'EKRAN', 
    description: 'Specyfikacja wyświetlacza i matrycy.', 
    mappingHint: 'Mapuje: przekątna, rozdzielczość, typ matrycy.', 
    usageCount: 8, 
    status: 'active',
    mergedSynonyms: ['Matryca', 'Wyświetlacz', 'Panel LCD', 'Ekran główny']
  },
  { 
    id: 'S-004', 
    name: 'WYMIARY I WAGA', 
    description: 'Fizyczne wymiary produktu i opakowania.', 
    mappingHint: 'Mapuje: szerokość, wysokość, głębokość, waga netto/brutto.', 
    usageCount: 52, 
    status: 'active',
    mergedSynonyms: ['Gabaryty', 'Rozmiary', 'Wielkość']
  },
  { 
    id: 'S-005', 
    name: 'KOMUNIKACJA', 
    description: 'Moduły łączności bezprzewodowej.', 
    mappingHint: 'Mapuje: Wi-Fi, Bluetooth, NFC, LTE, 5G.', 
    usageCount: 15, 
    status: 'active',
    mergedSynonyms: ['Łączność', 'Interfejsy bezprzewodowe', 'Moduły radiowe']
  },
];

const MOCK_ATTRIBUTES: DictionaryAttribute[] = [
  { 
    id: 'A-001', 
    label: 'Długość kabla', 
    productType: 'Myszki',
    type: 'Liczba', 
    unitGroup: 'length', 
    mappingHint: 'Szuka wartości długości (m, cm, mm) dla myszek.', 
    usageCount: 5, 
    status: 'active',
    mergedSynonyms: ['Długość przewodu', 'Kabel długość', 'Długość']
  },
  { 
    id: 'A-002', 
    label: 'Długość kabla', 
    productType: 'Klawiatury',
    type: 'Liczba', 
    unitGroup: 'length', 
    mappingHint: 'Szuka wartości długości (m, cm, mm) dla klawiatur.', 
    usageCount: 3, 
    status: 'active',
    mergedSynonyms: ['Długość przewodu', 'Kabel długość', 'Długość']
  },
  { 
    id: 'A-003', 
    label: 'Model procesora', 
    productType: 'Laptopy',
    type: 'Tekst', 
    unitGroup: null, 
    mappingHint: 'Identyfikuje nazwy handlowe procesorów w laptopach.', 
    usageCount: 12, 
    status: 'active',
    mergedSynonyms: ['Typ procesora', 'CPU Model', 'Nazwa procesora']
  },
  { 
    id: 'A-004', 
    label: 'Liczba rdzeni', 
    productType: 'Laptopy',
    type: 'Liczba', 
    unitGroup: null, 
    mappingHint: 'Szuka cyfr przy słowie "cores" lub "rdzeni".', 
    usageCount: 12, 
    status: 'active',
    mergedSynonyms: ['Ilość rdzeni', 'Rdzenie', 'Cores count']
  },
  { 
    id: 'A-005', 
    label: 'Typ złącza', 
    productType: 'Kable',
    type: 'Lista', 
    unitGroup: null, 
    mappingHint: 'Wybiera ze słownika standardów (USB-C, HDMI, etc).', 
    usageCount: 22, 
    status: 'active',
    mergedSynonyms: ['Rodzaj portu', 'Interfejs', 'Złącze', 'Port HDMI', 'HDMI Port'],
    listValues: [
      { id: 'V1', value: 'USB-C', addedBy: 'system@pimm.pl', addedAt: '2024-01-01', isManual: false },
      { id: 'V2', value: 'HDMI 2.1', addedBy: 'system@pimm.pl', addedAt: '2024-01-01', isManual: false },
      { id: 'V3', value: 'DisplayPort', addedBy: 'admin@pimm.pl', addedAt: '2024-02-15', isManual: true },
    ]
  },
  { 
    id: 'A-006', 
    label: 'Pojemność akumulatora', 
    productType: 'Smartfony',
    type: 'Liczba', 
    unitGroup: 'storage', 
    mappingHint: 'Szuka wartości mAh lub Wh.', 
    usageCount: 18, 
    status: 'active',
    mergedSynonyms: ['Bateria pojemność', 'Akumulator', 'Pojemność ogniwa']
  },
];

const UNIT_GROUPS = ['Szerokosc', 'Wysokosc', 'Waga', 'Czestotliwosc', 'Pojemność', 'Test'];

const Dictionaries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sections' | 'attributes'>('sections');
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<DictionarySection[]>(MOCK_SECTIONS);
  const [attributes, setAttributes] = useState<DictionaryAttribute[]>(MOCK_ATTRIBUTES);
  
  const [editingSection, setEditingSection] = useState<DictionarySection | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<DictionaryAttribute | null>(null);
  
  // New Filter State
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [isLabelFilterOpen, setIsLabelFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  // AI Deduplication simulation state
  const [isAiChecking, setIsAiChecking] = useState(false);

  const filteredSections = useMemo(() => 
    sections.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.mergedSynonyms.some(syn => syn.toLowerCase().includes(searchQuery.toLowerCase()))),
    [sections, searchQuery]
  );

  // Cross-filtering logic
  const availableLabels = useMemo(() => {
    let base = attributes;
    if (selectedProductTypes.length > 0) {
      base = base.filter(a => selectedProductTypes.includes(a.productType));
    }
    return Array.from(new Set(base.map(a => a.label))).sort();
  }, [attributes, selectedProductTypes]);

  const availableProductTypes = useMemo(() => {
    let base = attributes;
    if (selectedLabels.length > 0) {
      base = base.filter(a => selectedLabels.includes(a.label));
    }
    return Array.from(new Set(base.map(a => a.productType || 'Ogólny'))).sort();
  }, [attributes, selectedLabels]);

  const filteredAttributes = useMemo(() => {
    return attributes.filter(a => {
      const matchesSearch = a.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.mergedSynonyms.some(syn => syn.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLabel = selectedLabels.length === 0 || selectedLabels.includes(a.label);
      const matchesType = selectedProductTypes.length === 0 || selectedProductTypes.includes(a.productType);
      
      return matchesSearch && matchesLabel && matchesType;
    });
  }, [attributes, searchQuery, selectedLabels, selectedProductTypes]);

  const handleSaveSection = () => {
    if (!editingSection) return;
    if (sections.find(s => s.id === editingSection.id)) {
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
    } else {
      setSections([{ ...editingSection, usageCount: 0, status: 'active' }, ...sections]);
    }
    setEditingSection(null);
  };

  const handleAddListValue = (value: string, isManual: boolean) => {
    if (!editingAttribute || !value) return;
    
    const newValue: ListValue = {
      id: `V-${Date.now()}`,
      value: value.trim(),
      addedBy: 'glegolski.lukasz@gmail.com', // User from context
      addedAt: new Date().toISOString().split('T')[0],
      isManual: isManual
    };

    setEditingAttribute({
      ...editingAttribute,
      listValues: [...(editingAttribute.listValues || []), newValue]
    });
  };

  const handleAiDeduplicate = async () => {
    const val = prompt("Wpisz nową wartość do sprawdzenia przez AI:");
    if (!val || !editingAttribute) return;

    setIsAiChecking(true);
    // Simulate AI check
    await new Promise(r => setTimeout(r, 1500));
    
    const exists = (editingAttribute.listValues || []).some(v => 
      v.value.toLowerCase() === val.toLowerCase()
    );

    if (exists) {
      alert(`AI: Wartość "${val}" już istnieje w słowniku lub ma bardzo bliski odpowiednik.`);
    } else {
      handleAddListValue(val, false);
      alert(`AI: Wartość "${val}" jest unikalna. Została dodana do słownika.`);
    }
    setIsAiChecking(false);
  };

  const handleRemoveListValue = (id: string) => {
    if (!editingAttribute) return;
    setEditingAttribute({
      ...editingAttribute,
      listValues: (editingAttribute.listValues || []).filter(v => v.id !== id)
    });
  };

  const handleSaveAttribute = () => {
    if (!editingAttribute) return;
    if (attributes.find(a => a.id === editingAttribute.id)) {
      setAttributes(attributes.map(a => a.id === editingAttribute.id ? editingAttribute : a));
    } else {
      setAttributes([{ ...editingAttribute, usageCount: 0, status: 'active' }, ...attributes]);
    }
    setEditingAttribute(null);
  };

  const getAttributeIcon = (type: string) => {
    switch (type) {
      case 'Liczba': return <Hash size={14} className="text-blue-500" />;
      case 'Tekst': return <Type size={14} className="text-emerald-500" />;
      case 'Lista': return <List size={14} className="text-amber-500" />;
      case 'Checkbox': return <CheckSquare size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  const handleAddSynonym = (type: 'sec' | 'attr', val: string) => {
    if (type === 'sec' && editingSection && val) {
      setEditingSection({...editingSection, mergedSynonyms: [...editingSection.mergedSynonyms, val]});
    } else if (type === 'attr' && editingAttribute && val) {
      setEditingAttribute({...editingAttribute, mergedSynonyms: [...editingAttribute.mergedSynonyms, val]});
    }
  };

  const handleRemoveSynonym = (type: 'sec' | 'attr', index: number) => {
    if (type === 'sec' && editingSection) {
      setEditingSection({...editingSection, mergedSynonyms: editingSection.mergedSynonyms.filter((_, i) => i !== index)});
    } else if (type === 'attr' && editingAttribute) {
      setEditingAttribute({...editingAttribute, mergedSynonyms: editingAttribute.mergedSynonyms.filter((_, i) => i !== index)});
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 text-black pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase italic">
            <BookOpen className="text-blue-600" size={36} />
            Słowniki Struktury
          </h2>
          <p className="text-gray-500 font-medium">Zarządzaj definicjami sekcji i atrybutów oraz ich inteligentnym mapowaniem synonimów.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
          <button 
            onClick={() => { setActiveTab('sections'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sections' ? 'bg-[#1a2b4d] text-white shadow-lg shadow-blue-900/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Layout size={16} />
            Sekcje
          </button>
          <button 
            onClick={() => { setActiveTab('attributes'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'attributes' ? 'bg-[#1a2b4d] text-white shadow-lg shadow-blue-900/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Database size={16} />
            Atrybuty
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Definicje sekcji</p>
            <h4 className="text-2xl font-black text-gray-900">{sections.length}</h4>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Definicje atrybutów</p>
            <h4 className="text-2xl font-black text-blue-600">{attributes.length}</h4>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Wykryte Synonimy</p>
            <h4 className="text-2xl font-black text-emerald-600">
              {activeTab === 'sections' 
                ? sections.reduce((acc, s) => acc + s.mergedSynonyms.length, 0)
                : attributes.reduce((acc, a) => acc + a.mergedSynonyms.length, 0)}
            </h4>
         </div>
         <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Merge size={12} /> Auto-Deduplikacja
            </p>
            <h4 className="text-2xl font-black text-indigo-900">Aktywna</h4>
         </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={activeTab === 'sections' ? "Szukaj sekcji lub synonimu (np. Matryca)..." : "Szukaj atrybutu lub synonimu (np. Złącze)..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        {activeTab === 'attributes' && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Label Multi-select */}
            <div className="relative">
              <button 
                onClick={() => { setIsLabelFilterOpen(!isLabelFilterOpen); setIsTypeFilterOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedLabels.length > 0 ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <Tag size={14} />
                Atrybut {selectedLabels.length > 0 && `(${selectedLabels.length})`}
                <ChevronDown size={14} className={`transition-transform ${isLabelFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLabelFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                    {availableLabels.map(label => (
                      <button 
                        key={label}
                        onClick={() => setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedLabels.includes(label) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {label}
                        {selectedLabels.includes(label) && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                  {selectedLabels.length > 0 && (
                    <button 
                      onClick={() => setSelectedLabels([])}
                      className="w-full mt-2 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-all"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Type Multi-select */}
            <div className="relative">
              <button 
                onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsLabelFilterOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedProductTypes.length > 0 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <Layers size={14} />
                Typ {selectedProductTypes.length > 0 && `(${selectedProductTypes.length})`}
                <ChevronDown size={14} className={`transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTypeFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                    {availableProductTypes.map(type => (
                      <button 
                        key={type}
                        onClick={() => setSelectedProductTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedProductTypes.includes(type) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {type}
                        {selectedProductTypes.includes(type) && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                  {selectedProductTypes.length > 0 && (
                    <button 
                      onClick={() => setSelectedProductTypes([])}
                      className="w-full mt-2 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-all"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => activeTab === 'sections' 
            ? setEditingSection({ id: `S-${Date.now()}`, name: '', description: '', mappingHint: '', usageCount: 0, status: 'active', mergedSynonyms: [] })
            : setEditingAttribute({ id: `A-${Date.now()}`, label: '', productType: '', type: 'Tekst', unitGroup: null, mappingHint: '', usageCount: 0, status: 'active', mergedSynonyms: [], listValues: [] })
          }
          className="flex items-center gap-2 px-6 py-3 bg-[#107c41] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all shadow-xl shadow-green-900/10 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus size={18} strokeWidth={3} />
          {activeTab === 'sections' ? 'Nowa Sekcja' : 'Nowy Atrybut'}
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Etykieta Atrybutu</th>
                <th className="px-8 py-5">Typ Produktu</th>
                <th className="px-8 py-5">Logika i Zdeduplikowane Synonimy</th>
                <th className="px-8 py-5 text-center">Użycie</th>
                {activeTab === 'attributes' && <th className="px-8 py-5">Typ / Jednostki</th>}
                <th className="px-8 py-5 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'sections' ? (
                filteredSections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-8 py-5">
                       <span className="text-[11px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">{section.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">{section.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{section.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2 max-w-sm">
                        <div className="flex items-center gap-2">
                          <Brain size={14} className="text-indigo-500 shrink-0" />
                          <span className="text-[11px] font-bold text-gray-600 italic leading-snug">{section.mappingHint}</span>
                        </div>
                        {section.mergedSynonyms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter self-center mr-1">Synonimy:</span>
                             {section.mergedSynonyms.map((syn, idx) => (
                               <span key={idx} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-black border border-indigo-100">{syn}</span>
                             ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex flex-col items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
                        <span className="text-xs font-black leading-none">{section.usageCount}</span>
                        <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">formatki</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingSection(section)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredAttributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-8 py-5">
                       <span className="text-[11px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">{attr.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-gray-900">{attr.label}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-blue-500" />
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-tight">
                          {attr.productType || 'Ogólny'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2 max-w-sm">
                        <div className="flex items-center gap-2">
                          <Brain size={14} className="text-indigo-500 shrink-0" />
                          <span className="text-[11px] font-bold text-gray-600 italic leading-snug">{attr.mappingHint}</span>
                        </div>
                        {attr.mergedSynonyms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter self-center mr-1">Zdeduplikowane:</span>
                             {attr.mergedSynonyms.map((syn, idx) => (
                               <span key={idx} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black border border-emerald-100">{syn}</span>
                             ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-black text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{attr.usageCount}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                           {getAttributeIcon(attr.type)}
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{attr.type}</span>
                        </div>
                        {attr.unitGroup && (
                          <div className="flex items-center gap-1.5 text-blue-600">
                             <Ruler size={10} />
                             <span className="text-[9px] font-black uppercase tracking-tighter">Grupa: {attr.unitGroup}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingAttribute(attr)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-[250] bg-[#1a1c23]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
              <div className="p-8 bg-[#1a2b4d] text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                       <Layout size={24} />
                    </div>
                    <div>
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 leading-none">Definicja Sekcji</h3>
                       <p className="text-sm font-black mt-1.5">{editingSection.name || 'Nowa Sekcja'}</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingSection(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
              </div>
              <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nazwa Sekcji (Klucz)</label>
                    <input 
                      value={editingSection.name}
                      onChange={e => setEditingSection({...editingSection, name: e.target.value.toUpperCase()})}
                      className="w-full h-12 px-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                      placeholder="np. PARAMETRY TECHNICZNE..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Opis Funkcjonalny</label>
                    <textarea 
                      rows={2}
                      value={editingSection.description}
                      onChange={e => setEditingSection({...editingSection, description: e.target.value})}
                      className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
                      placeholder="Do czego służy ta sekcja..."
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Brain size={14} className="text-indigo-500" />
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Sugerowane Mapowanie AI</label>
                    </div>
                    <textarea 
                      rows={2}
                      value={editingSection.mappingHint}
                      onChange={e => setEditingSection({...editingSection, mappingHint: e.target.value})}
                      className="w-full p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-bold italic text-indigo-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
                      placeholder="Słowa kluczowe dla AI przy rozpoznawaniu sekcji..."
                    />
                 </div>

                 {/* Synonyms section */}
                 <div className="space-y-3 pt-4 border-t border-gray-100">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Merge size={12} className="text-indigo-500" /> Zdeduplikowane nazwy alternatywne (Synonimy)
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {editingSection.mergedSynonyms.map((syn, idx) => (
                         <div key={idx} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 text-xs font-bold animate-in zoom-in-95">
                            {syn}
                            <button onClick={() => handleRemoveSynonym('sec', idx)} className="hover:text-rose-500"><X size={14}/></button>
                         </div>
                       ))}
                       <button 
                        onClick={() => {
                          const val = prompt("Dodaj nazwę alternatywną, która ma być mapowana na tę sekcję:");
                          if (val) handleAddSynonym('sec', val);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed border-indigo-200 text-indigo-400 rounded-xl text-xs font-black uppercase hover:bg-indigo-50 transition-all"
                       >
                          <Plus size={14}/> Dodaj synonim
                       </button>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Podczas analizy importu, te nazwy sekcji zostaną automatycznie połączone w jedną wspólną sekcję "{editingSection.name}".</p>
                 </div>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setEditingSection(null)} className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Anuluj</button>
                 <button onClick={handleSaveSection} className="px-10 py-3 bg-[#107c41] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all flex items-center gap-2 shadow-lg shadow-green-200">
                    <Save size={16}/> Zapisz sekcję
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ATTRIBUTE MODAL */}
      {editingAttribute && (
        <div className="fixed inset-0 z-[250] bg-[#1a1c23]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
              <div className="p-8 bg-[#1a2b4d] text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                       <Database size={24} />
                    </div>
                    <div>
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 leading-none">Definicja Atrybutu</h3>
                       <p className="text-sm font-black mt-1.5">{editingAttribute.label || 'Nowy Atrybut (Test)'}</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingAttribute(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
              </div>
              <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Etykieta Wyświetlana</label>
                      <input 
                        value={editingAttribute.label}
                        onChange={e => setEditingAttribute({...editingAttribute, label: e.target.value})}
                        className="w-full h-12 px-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                        placeholder="np. Port HDMI..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Typ Produktu (Zastosowanie)</label>
                      <input 
                        value={editingAttribute.productType}
                        onChange={e => setEditingAttribute({...editingAttribute, productType: e.target.value})}
                        className="w-full h-12 px-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm font-black text-blue-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                        placeholder="np. Myszki..."
                      />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Typ Danych</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Liczba', 'Tekst', 'Lista', 'Checkbox'] as const).map(type => (
                          <button 
                            key={type}
                            onClick={() => setEditingAttribute({...editingAttribute, type, listValues: type === 'Lista' ? (editingAttribute.listValues || []) : undefined})}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${editingAttribute.type === type ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                          >
                            {getAttributeIcon(type)}
                            {type}
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>

                 {editingAttribute.type === 'Lista' && (
                   <div className="space-y-4 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <List size={16} className="text-amber-500" />
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wartości Słownikowe (Lista)</label>
                       </div>
                       <div className="flex gap-2">
                         <button 
                           onClick={handleAiDeduplicate}
                           disabled={isAiChecking}
                           className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 disabled:opacity-50"
                         >
                           {isAiChecking ? <Activity size={12} className="animate-spin" /> : <Brain size={12} />}
                           AI Deduplikacja
                         </button>
                         <button 
                           onClick={() => {
                             const val = prompt("Wpisz nową wartość:");
                             if (val) handleAddListValue(val, true);
                           }}
                           className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                         >
                           <Plus size={12} />
                           Ręczne Dodanie
                         </button>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 gap-2">
                       {(editingAttribute.listValues || []).length === 0 ? (
                         <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                           <p className="text-xs text-gray-400 font-bold italic">Brak zdefiniowanych wartości dla tej listy.</p>
                         </div>
                       ) : (
                         <div className="grid grid-cols-2 gap-3">
                           {(editingAttribute.listValues || []).map(val => (
                             <div 
                               key={val.id} 
                               className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${val.isManual ? 'bg-amber-50/30 border-amber-100' : 'bg-gray-50/50 border-gray-100'}`}
                             >
                               <div className="flex flex-col">
                                 <span className={`text-sm font-black ${val.isManual ? 'text-amber-700' : 'text-gray-900'}`}>{val.value}</span>
                                 <div className="flex items-center gap-2 mt-1">
                                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                                     <Activity size={8} /> {val.addedBy.split('@')[0]}
                                   </span>
                                   <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">{val.addedAt}</span>
                                   {val.isManual && (
                                     <span className="text-[8px] font-black text-amber-500 bg-amber-100 px-1 rounded uppercase tracking-tighter">Ręczny</span>
                                   )}
                                 </div>
                               </div>
                               <button 
                                 onClick={() => handleRemoveListValue(val.id)}
                                 className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                               >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Ruler size={14} className="text-blue-500" />
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grupa Jednostek</label>
                      </div>
                      <select 
                        disabled={editingAttribute.type !== 'Liczba'}
                        value={editingAttribute.unitGroup || ''}
                        onChange={e => setEditingAttribute({...editingAttribute, unitGroup: e.target.value || null})}
                        className="w-full h-12 px-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none disabled:opacity-30"
                      >
                        <option value="">Brak (Jednostka stała/Tekst)</option>
                        {UNIT_GROUPS.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Activity size={14} className="text-emerald-500" />
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Słownikowy</label>
                      </div>
                      <div className="h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center px-4">
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">AKTYWNY W SYSTEMIE</span>
                      </div>
                   </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Brain size={14} className="text-indigo-500" />
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Logika Wyciągania Danych (AI Mapping)</label>
                    </div>
                    <textarea 
                      rows={3}
                      value={editingAttribute.mappingHint}
                      onChange={e => setEditingAttribute({...editingAttribute, mappingHint: e.target.value})}
                      className="w-full p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm font-bold italic text-indigo-900 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
                      placeholder="Opisz jak model powinien wyciągać dane z tekstu..."
                    />
                 </div>

                 {/* Synonyms section for Attribute */}
                 <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Merge size={12} className="text-emerald-500" /> Zdeduplikowane etykiety źródłowe
                       </label>
                       <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Deduplikacja aktywna</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {editingAttribute.mergedSynonyms.map((syn, idx) => (
                         <div key={idx} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-bold animate-in zoom-in-95">
                            {syn}
                            <button onClick={() => handleRemoveSynonym('attr', idx)} className="hover:text-rose-500"><X size={14}/></button>
                         </div>
                       ))}
                       <button 
                        onClick={() => {
                          const val = prompt("Dodaj frazę (np. Port HDMI), która w procesie analizy ma być mapowana na ten atrybut:");
                          if (val) handleAddSynonym('attr', val);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed border-emerald-200 text-emerald-400 rounded-xl text-xs font-black uppercase hover:bg-emerald-50 transition-all"
                       >
                          <Plus size={14}/> Dodaj etykietę
                       </button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex gap-3 items-start border border-gray-100">
                       <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                       <p className="text-[10px] text-gray-500 leading-relaxed">System automatycznie identyfikuje powyższe frazy w nazwach kolumn plików importu lub w surowym tekście technicznym i scala je do wspólnej wartości pod etykietą: <span className="font-black text-gray-800">"{editingAttribute.label}"</span>.</p>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setEditingAttribute(null)} className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Anuluj</button>
                 <button onClick={handleSaveAttribute} className="px-10 py-3 bg-[#2b64e3] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                    <Save size={16}/> Zapisz atrybut
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dictionaries;
