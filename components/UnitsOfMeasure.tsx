
import React, { useState } from 'react';
import { 
  Ruler, 
  Plus, 
  Search, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight,
  Settings2, 
  Trash2, 
  Edit3, 
  Globe,
  Database,
  ArrowRight,
  Sparkles,
  Zap,
  Tag,
  Info,
  Check,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Undo2,
  Save,
  Loader2,
  Star,
  Layers
} from 'lucide-react';

interface UnitVariation {
  id: string;
  symbol: string;
  isMain: boolean;
}

interface Unit {
  id: string;
  name: string;
  type: string;
  variations: UnitVariation[];
  modifiedBy?: string;
  modifiedAt?: string;
}

const CURRENT_USER = "Łukasz Glegolski";

const INITIAL_UNITS: Unit[] = [
  { 
    id: '1', 
    name: 'Szerokosc', 
    type: 'Liczba', 
    variations: [
      { id: 'v1', symbol: 'cm', isMain: true },
      { id: 'v2', symbol: 'mm', isMain: false },
      { id: 'v3', symbol: 'm', isMain: false }
    ]
  },
  { 
    id: '2', 
    name: 'Wysokosc', 
    type: 'Liczba', 
    variations: [
      { id: 'v4', symbol: 'cm', isMain: true },
      { id: 'v5', symbol: 'mm', isMain: false }
    ]
  },
  { 
    id: '3', 
    name: 'Waga', 
    type: 'Liczba', 
    variations: [
      { id: 'v6', symbol: 'kg', isMain: true },
      { id: 'v7', symbol: 'g', isMain: false },
      { id: 'v8', symbol: 'lb', isMain: false }
    ]
  },
  { 
    id: '4', 
    name: 'Czestotliwosc', 
    type: 'Lista jednokrotnego wyboru', 
    variations: [
      { id: 'v9', symbol: 'kHz', isMain: true },
      { id: 'v10', symbol: 'MHz', isMain: false },
      { id: 'v11', symbol: 'GHz', isMain: false }
    ]
  },
  { 
    id: '5', 
    name: 'Test', 
    type: 'Lista jednokrotnego wyboru', 
    variations: [{ id: 'v12', symbol: 'dB', isMain: true }] 
  },
  { 
    id: '6', 
    name: 'Pojemność', 
    type: 'Liczba', 
    variations: [
      { id: 'v13', symbol: 'GB', isMain: true },
      { id: 'v14', symbol: 'MB', isMain: false },
      { id: 'v15', symbol: 'TB', isMain: false }
    ]
  }
];

const UnitsOfMeasure: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [tempUnits, setTempUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredUnits = tempUnits.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.variations.some(v => v.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleInputChange = (id: string, field: keyof Unit, value: any) => {
    const updated = tempUnits.map(u => u.id === id ? { ...u, [field]: value } : u);
    setTempUnits(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(units));
  };

  const setMainVariation = (unitId: string, variationId: string) => {
    const updated = tempUnits.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          variations: u.variations.map(v => ({
            ...v,
            isMain: v.id === variationId
          }))
        };
      }
      return u;
    });
    setTempUnits(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(units));
  };

  const addVariation = (unitId: string) => {
    const symbol = prompt("Podaj symbol nowej wariacji:");
    if (!symbol) return;
    
    const updated = tempUnits.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          variations: [...u.variations, { id: `v-${Date.now()}`, symbol, isMain: u.variations.length === 0 }]
        };
      }
      return u;
    });
    setTempUnits(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(units));
  };

  const deleteVariation = (unitId: string, variationId: string) => {
    const updated = tempUnits.map(u => {
      if (u.id === unitId) {
        const remaining = u.variations.filter(v => v.id !== variationId);
        // If we deleted the main, pick the first one as new main
        if (u.variations.find(v => v.id === variationId)?.isMain && remaining.length > 0) {
          remaining[0].isMain = true;
        }
        return { ...u, variations: remaining };
      }
      return u;
    });
    setTempUnits(updated);
    setIsDirty(JSON.stringify(updated) !== JSON.stringify(units));
  };

  const cancelChanges = () => {
    setTempUnits(units);
    setIsDirty(false);
    setEditingId(null);
  };

  const startSync = () => {
    setShowSyncConfirm(true);
  };

  const handleSyncToPimm = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const now = new Date().toLocaleString('pl-PL');
    const finalized = tempUnits.map(u => {
      const original = units.find(orig => orig.id === u.id);
      if (JSON.stringify(u) !== JSON.stringify(original)) {
        return { ...u, modifiedBy: CURRENT_USER, modifiedAt: now };
      }
      return u;
    });
    setUnits(finalized);
    setTempUnits(finalized);
    setIsDirty(false);
    setEditingId(null);
    setIsSyncing(false);
    setShowSyncConfirm(false);
    alert("Zsynchronizowano pomyślnie z systemem PIMM.");
  };

  const handleLocalSave = () => {
    const now = new Date().toLocaleString('pl-PL');
    const finalized = tempUnits.map(u => {
      const original = units.find(orig => orig.id === u.id);
      if (JSON.stringify(u) !== JSON.stringify(original)) {
        return { ...u, modifiedBy: CURRENT_USER, modifiedAt: now };
      }
      return u;
    });
    setUnits(finalized);
    setTempUnits(finalized);
    setIsDirty(false);
    setEditingId(null);
    setShowSyncConfirm(false);
  };

  const AuditBadge = ({ modifiedBy, modifiedAt }: { modifiedBy?: string, modifiedAt?: string }) => {
    if (!modifiedBy) return null;
    return (
      <div className="flex items-center gap-1.5 ml-2 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-[8px] font-black text-amber-700 uppercase tracking-tighter group/audit relative cursor-help shadow-sm shrink-0">
        <User size={8} /> EDYCJA
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/audit:block w-48 p-3 bg-gray-900 text-white rounded-xl shadow-2xl z-[100] normal-case tracking-normal border border-gray-700 animate-in fade-in slide-in-from-bottom-2 text-left">
          <p className="text-[10px] font-black uppercase text-amber-400 mb-1 flex items-center gap-2 border-b border-gray-800 pb-1"><Clock size={12}/> AUDYT</p>
          <p className="text-[10px] font-bold">Autor: {modifiedBy}</p>
          <p className="text-[10px] font-bold">Data: {modifiedAt}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 text-black">
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-inner">
             <Ruler size={24} />
          </div>
          <div>
            <h2 className="text-xs font-black text-gray-400 tracking-widest uppercase leading-none mb-1">Konfiguracja Systemu</h2>
            <p className="text-sm font-black text-black">Jednostki Miary i Atrybuty</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
               <button onClick={cancelChanges} className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
                 <X size={14} /> Anuluj
               </button>
               <button onClick={startSync} className="px-6 py-2.5 bg-[#107c41] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all shadow-lg shadow-green-200 flex items-center gap-2">
                 <Save size={14} /> Zapisz zmiany
               </button>
            </div>
          )}
          {!isDirty && (
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1a2b4d] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10">
              <Plus size={18} strokeWidth={3} />
              Dodaj Atrybut
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-gray-100 bg-gray-50/20">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Wyszukaj po nazwie lub symbolu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[11px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5 w-12"></th>
                <th className="px-8 py-5">Nazwa Parametru</th>
                <th className="px-8 py-5">Rodzaj Danych</th>
                <th className="px-8 py-5">Jednostka Główna</th>
                <th className="px-8 py-5 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUnits.map((unit) => {
                const isEditing = editingId === unit.id;
                const isExpanded = expandedIds.has(unit.id);
                const mainVariation = unit.variations.find(v => v.isMain);

                return (
                  <React.Fragment key={unit.id}>
                    <tr className={`group transition-all ${isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-8 py-4">
                        <button onClick={() => toggleExpand(unit.id)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center">
                          {isEditing ? (
                            <input autoFocus value={unit.name} onChange={(e) => handleInputChange(unit.id, 'name', e.target.value)} className="bg-white border-2 border-blue-400 rounded-lg px-3 py-1.5 text-sm font-bold text-black w-full outline-none shadow-sm" />
                          ) : (
                            <span className="text-sm font-bold text-gray-900 flex items-center">
                              {unit.name}
                              <AuditBadge modifiedBy={unit.modifiedBy} modifiedAt={unit.modifiedAt} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        {isEditing ? (
                          <select value={unit.type} onChange={(e) => handleInputChange(unit.id, 'type', e.target.value)} className="bg-white border-2 border-blue-400 rounded-lg px-3 py-1.5 text-sm font-bold text-black w-full outline-none shadow-sm">
                            <option>Liczba</option>
                            <option>Lista jednokrotnego wyboru</option>
                            <option>Lista wielokrotnego wyboru</option>
                            <option>Data</option>
                            <option>Checkbox</option>
                          </select>
                        ) : (
                          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{unit.type}</span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm">
                            {mainVariation?.symbol || '---'}
                          </span>
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <button onClick={() => setEditingId(null)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all">Zatwierdź</button>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(unit.id)} className="bg-[#2b64e3] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-blue-700 transition-all flex items-center gap-1.5"><Edit3 size={12} /> Edytuj</button>
                              <button className="bg-[#f84c5a] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-600 transition-all flex items-center gap-1.5"><Trash2 size={12} /> Usun</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={5} className="px-20 py-6 border-b border-gray-100">
                          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layers size={14} className="text-blue-500" /> Wszystkie wariacje jednostek dla: {unit.name}
                              </h4>
                              <button onClick={() => addVariation(unit.id)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all">
                                <Plus size={14} /> Dodaj wariację
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {unit.variations.map((v) => (
                                <div key={v.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all group/var ${v.isMain ? 'bg-white border-blue-400 shadow-lg shadow-blue-500/5 ring-1 ring-blue-400' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-mono font-black px-2 py-0.5 rounded ${v.isMain ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-100'}`}>
                                      {v.symbol}
                                    </span>
                                    {v.isMain && (
                                      <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                        <Star size={10} className="fill-amber-400" /> Jednostka Główna
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 opacity-0 group-hover/var:opacity-100 transition-opacity">
                                    {!v.isMain && (
                                      <button onClick={() => setMainVariation(unit.id, v.id)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Ustaw jako główną">
                                        <Star size={16} />
                                      </button>
                                    )}
                                    <button onClick={() => deleteVariation(unit.id, v.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUnits.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                 <Info size={32} />
              </div>
              <h3 className="text-base font-black text-gray-800 uppercase italic">Brak wyników</h3>
              <p className="text-xs text-gray-500 font-medium">Spróbuj zmienić parametry wyszukiwania.</p>
           </div>
        )}
      </div>

      {showSyncConfirm && (
        <div className="fixed inset-0 z-[250] bg-[#1a1c23]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10 flex flex-col items-center text-center border border-gray-100">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-8 border-4 border-white shadow-inner">
                 <RefreshCw size={40} className={isSyncing ? "animate-spin" : ""} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-3">Synchronizacja Zmian</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                Wprowadzone modyfikacje w definicjach atrybutów i ich wariacjach jednostek mogą wpłynąć na mapowanie danych technicznych. Czy chcesz dodatkowo <span className="text-emerald-600 font-black uppercase tracking-wider">wysłać zmiany do PIMM</span>?
              </p>
              <div className="grid grid-cols-1 w-full gap-4">
                 <button disabled={isSyncing} onClick={handleSyncToPimm} className="w-full py-5 bg-[#107c41] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#0d6334] transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-3 disabled:opacity-50">
                   {isSyncing ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                   TAK, SYNCHRONIZUJ Z PIMM
                 </button>
                 <button disabled={isSyncing} onClick={handleLocalSave} className="w-full py-5 bg-gray-100 text-gray-600 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                   TYLKO ZAPISZ LOKALNIE
                 </button>
                 <button disabled={isSyncing} onClick={() => setShowSyncConfirm(false)} className="w-full py-2 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-all">
                   Wróć do edycji
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UnitsOfMeasure;
