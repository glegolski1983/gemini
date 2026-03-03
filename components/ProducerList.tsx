
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Factory, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  MoreVertical, 
  Plus, 
  X, 
  Save, 
  MapPin, 
  Mail, 
  Globe, 
  Phone,
  CheckCircle2,
  Clock,
  History,
  Eye,
  Trash2,
  Info,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Type,
  Building2
} from 'lucide-react';

interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

interface GPSRInfo {
  manufacturerName: string;
  manufacturerAddress: Address;
  manufacturerEmail: string;
  manufacturerWeb: string;
  importerName?: string;
  importerAddress?: Address;
  importerEmail?: string;
  importerWeb?: string;
}

interface Producer {
  id: string;
  name: string;
  abbreviation: string;
  gpsrComplete: boolean;
  gpsrData: GPSRInfo;
  lastEdited: string;
  editedBy: string;
  comment?: string;
  commentEditedBy?: string;
  commentEditedAt?: string;
}

const MOCK_PRODUCERS: Producer[] = [
  {
    id: 'PR-001',
    name: 'Dell Technologies Inc.',
    abbreviation: 'Dell',
    gpsrComplete: true,
    gpsrData: {
      manufacturerName: 'Dell Inc.',
      manufacturerAddress: {
        street: 'One Dell Way',
        postalCode: '78682',
        city: 'Round Rock',
        country: 'USA'
      },
      manufacturerEmail: 'compliance@dell.com',
      manufacturerWeb: 'https://www.dell.com/compliance'
    },
    lastEdited: '2024-03-15 10:30',
    editedBy: 'Łukasz Glegolski',
    comment: 'Krótka informacja, która będzie się wyświetlać w specyfikacji technicznej we wszystkich produktach tego producenta, nie publikujemy jej dla klientów',
    commentEditedBy: 'Łukasz Glegolski',
    commentEditedAt: '2024-03-15 10:30'
  },
  {
    id: 'PR-002',
    name: 'Logitech Europe S.A.',
    abbreviation: 'Logitech',
    gpsrComplete: true,
    gpsrData: {
      manufacturerName: 'Logitech Asia Pacific Ltd',
      manufacturerAddress: {
        street: 'EPFL - Quartier de l\'Innovation',
        postalCode: '1015',
        city: 'Lausanne',
        country: 'Switzerland'
      },
      manufacturerEmail: 'support@logitech.com',
      manufacturerWeb: 'https://www.logitech.com'
    },
    lastEdited: '2024-03-12 14:15',
    editedBy: 'Łukasz Majchrzak'
  },
  {
    id: 'PR-003',
    name: 'Samsung Electronics',
    abbreviation: 'Samsung',
    gpsrComplete: false,
    gpsrData: {
      manufacturerName: 'Samsung Electronics Co., Ltd.',
      manufacturerAddress: {
        street: '129, Samsung-ro',
        postalCode: '16677',
        city: 'Suwon-si',
        country: 'Korea'
      },
      manufacturerEmail: '',
      manufacturerWeb: ''
    },
    lastEdited: '2024-03-10 09:45',
    editedBy: 'Radosław Herbuś'
  }
];

const EMPTY_ADDRESS: Address = {
  street: '',
  postalCode: '',
  city: '',
  country: ''
};

const INITIAL_GPSR: GPSRInfo = {
  manufacturerName: '',
  manufacturerAddress: { ...EMPTY_ADDRESS },
  manufacturerEmail: '',
  manufacturerWeb: '',
};

const formatAddress = (addr?: Address) => {
  if (!addr || (!addr.street && !addr.city)) return '';
  return `${addr.street}, ${addr.postalCode} ${addr.city}, ${addr.country}`;
};

const ProducerList: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>(MOCK_PRODUCERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewGPSR, setPreviewGPSR] = useState<Producer | null>(null);

  const filteredProducers = useMemo(() => {
    return producers.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [producers, searchQuery]);

  const handleEdit = (producer: Producer) => {
    setIsAddingNew(false);
    setEditingProducer(JSON.parse(JSON.stringify(producer)));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingProducer({
      id: `PR-${(producers.length + 1).toString().padStart(3, '0')}`,
      name: '',
      abbreviation: '',
      gpsrComplete: false,
      gpsrData: { 
        ...JSON.parse(JSON.stringify(INITIAL_GPSR)),
        importerAddress: { ...EMPTY_ADDRESS }
      },
      lastEdited: '-',
      editedBy: '-',
      comment: '',
      commentEditedBy: '',
      commentEditedAt: ''
    });
  };

  const handleSave = () => {
    if (!editingProducer) return;
    
    const d = editingProducer.gpsrData;
    const isComplete = !!(
      d.manufacturerName && 
      d.manufacturerAddress.street && 
      d.manufacturerAddress.city && 
      d.manufacturerEmail && 
      d.manufacturerWeb
    );
    
    const now = new Date().toLocaleString('pl-PL').slice(0, 16);
    const updatedData = { 
      ...editingProducer, 
      gpsrComplete: isComplete,
      lastEdited: now,
      editedBy: 'Łukasz Glegolski' 
    };

    if (isAddingNew) {
      setProducers([updatedData, ...producers]);
    } else {
      setProducers(producers.map(p => p.id === editingProducer.id ? updatedData : p));
    }
    
    setEditingProducer(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tego producenta?")) {
      setProducers(producers.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-black pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nazwy Producentów</h2>
          <p className="text-sm text-gray-500 mt-1">Centralna baza producentów i zarządzanie danymi zgodności GPSR.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a2b4d] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={3} />
          Nowy Producent
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Szukaj producenta po nazwie, skrócie, ID lub danych GPSR..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5 w-32">ID Systemowe</th>
                <th className="px-8 py-5">Producent (PIMM)</th>
                <th className="px-8 py-5">Nazwa w tytule</th>
                <th className="px-8 py-5">Dane Producenta (GPSR)</th>
                <th className="px-8 py-5">Status Zgodności</th>
                <th className="px-8 py-5 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducers.map((producer) => (
                <tr key={producer.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{producer.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:shadow-md transition-shadow">
                        <Factory size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 leading-tight">{producer.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Ostatnia edycja: {producer.lastEdited}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100 tracking-tight">
                      {producer.abbreviation || <span className="text-gray-300">---</span>}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="max-w-[320px] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-gray-900 truncate">
                          {producer.gpsrData.manufacturerName || <span className="text-rose-400">BRAK NAZWY GPSR</span>}
                        </span>
                      </div>
                      <div className="flex items-start gap-1 text-[9px] text-gray-400 italic">
                        <MapPin size={10} className="shrink-0 mt-0.5" /> 
                        <span className="truncate">{formatAddress(producer.gpsrData.manufacturerAddress) || 'Brak adresu siedziby'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {producer.gpsrComplete ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit shadow-sm">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Kompletny</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 w-fit shadow-sm">
                        <ShieldAlert size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Do uzupełnienia</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewGPSR(producer)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Eye size={20} /></button>
                      <button onClick={() => handleEdit(producer)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={20} /></button>
                      <button onClick={() => handleDelete(producer.id)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProducer && (
        <div className="fixed inset-0 z-[200] bg-[#1a1c23]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <Factory size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {isAddingNew ? 'Tworzenie Nowego Producenta' : 'Profil Producenta'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{editingProducer.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Katalog PIMM</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setEditingProducer(null)} className="p-3 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-xl shadow-sm border border-gray-100">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Info size={16}/></div>
                  <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">IDENTYFIKACJA W SYSTEMIE</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Nazwa Wyświetlana (PIMM)</label>
                    <input 
                      type="text" 
                      value={editingProducer.name}
                      onChange={(e) => setEditingProducer({ ...editingProducer, name: e.target.value })}
                      placeholder="np. Samsung Electronics Co., Ltd."
                      className="w-full h-12 px-5 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block flex items-center gap-2">
                      <Type size={12} /> Nazwa w nazwie (Brand)
                    </label>
                    <input 
                      type="text" 
                      value={editingProducer.abbreviation}
                      onChange={(e) => setEditingProducer({ ...editingProducer, abbreviation: e.target.value })}
                      placeholder="np. Samsung, Logitech"
                      className="w-full h-12 px-5 bg-gray-50 border border-gray-200 rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all tracking-tight"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-widest border border-rose-100">uwagi</label>
                    {editingProducer.commentEditedBy && (
                      <span className="text-[9px] text-gray-400 font-bold italic">
                        Ostatnia zmiana: {editingProducer.commentEditedBy} ({editingProducer.commentEditedAt})
                      </span>
                    )}
                  </div>
                  <textarea 
                    value={editingProducer.comment || ''}
                    onChange={(e) => {
                      const now = new Date().toLocaleString('pl-PL').slice(0, 16);
                      setEditingProducer({ 
                        ...editingProducer, 
                        comment: e.target.value,
                        commentEditedBy: "Łukasz Glegolski",
                        commentEditedAt: now
                      });
                    }}
                    placeholder="Wpisz uwagi dotyczące producenta..."
                    className="w-full h-20 p-5 bg-white border border-gray-200 rounded-2xl text-[12px] font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </section>

              {/* Manufacturer GPSR Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Building2 size={16}/></div>
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">DANE PRODUCENTA (GPSR)</h4>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Pełna nazwa prawna producenta</label>
                    <input 
                      type="text" 
                      value={editingProducer.gpsrData.manufacturerName}
                      onChange={(e) => setEditingProducer({ 
                        ...editingProducer, 
                        gpsrData: { ...editingProducer.gpsrData, manufacturerName: e.target.value } 
                      })}
                      className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Ulica i numer</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.manufacturerAddress.street}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            manufacturerAddress: { ...editingProducer.gpsrData.manufacturerAddress, street: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Kod pocztowy</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.manufacturerAddress.postalCode}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            manufacturerAddress: { ...editingProducer.gpsrData.manufacturerAddress, postalCode: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Miasto</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.manufacturerAddress.city}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            manufacturerAddress: { ...editingProducer.gpsrData.manufacturerAddress, city: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Kraj</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.manufacturerAddress.country}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            manufacturerAddress: { ...editingProducer.gpsrData.manufacturerAddress, country: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">E-mail</label>
                      <input 
                        type="email" 
                        value={editingProducer.gpsrData.manufacturerEmail}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { ...editingProducer.gpsrData, manufacturerEmail: e.target.value } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Strona WWW</label>
                      <input 
                        type="url" 
                        value={editingProducer.gpsrData.manufacturerWeb}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { ...editingProducer.gpsrData, manufacturerWeb: e.target.value } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Importer GPSR Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><Globe size={16}/></div>
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">DANE IMPORTERA</h4>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Pełna nazwa importera</label>
                    <input 
                      type="text" 
                      value={editingProducer.gpsrData.importerName || ''}
                      onChange={(e) => setEditingProducer({ 
                        ...editingProducer, 
                        gpsrData: { ...editingProducer.gpsrData, importerName: e.target.value } 
                      })}
                      className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Ulica i numer (Importer)</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.importerAddress?.street || ''}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            importerAddress: { ...(editingProducer.gpsrData.importerAddress || EMPTY_ADDRESS), street: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Kod pocztowy (Importer)</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.importerAddress?.postalCode || ''}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            importerAddress: { ...(editingProducer.gpsrData.importerAddress || EMPTY_ADDRESS), postalCode: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Miasto (Importer)</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.importerAddress?.city || ''}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            importerAddress: { ...(editingProducer.gpsrData.importerAddress || EMPTY_ADDRESS), city: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Kraj (Importer)</label>
                      <input 
                        type="text" 
                        value={editingProducer.gpsrData.importerAddress?.country || ''}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { 
                            ...editingProducer.gpsrData, 
                            importerAddress: { ...(editingProducer.gpsrData.importerAddress || EMPTY_ADDRESS), country: e.target.value } 
                          } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">E-mail (Importer)</label>
                      <input 
                        type="email" 
                        value={editingProducer.gpsrData.importerEmail || ''}
                        onChange={(e) => setEditingProducer({ 
                          ...editingProducer, 
                          gpsrData: { ...editingProducer.gpsrData, importerEmail: e.target.value } 
                        })}
                        className="w-full h-12 px-5 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-4">
                <button onClick={() => setEditingProducer(null)} className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-all text-gray-600 shadow-sm">Anuluj</button>
                <button onClick={handleSave} className="px-12 py-3 bg-[#107c41] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#0d6334] shadow-xl shadow-green-200/50 transition-all flex items-center gap-2"><Save size={18} /> {isAddingNew ? 'Dodaj Producenta' : 'Zapisz dane'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewGPSR && (
        <div className="fixed inset-0 z-[250] bg-[#1a1c23]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
              <div className="p-8 bg-[#1a2b4d] text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"><ShieldCheck size={24} className="text-emerald-400" /></div>
                    <div>
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] leading-none opacity-60">Metadane Zgodności</h3>
                       <p className="text-sm font-black mt-1.5">{previewGPSR.name}</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewGPSR(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="space-y-5">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-3 relative">
                       <div className="flex items-center justify-between">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">IDENTYFIKACJA PRODUCENTA</p>
                         <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded font-bold uppercase tracking-tight">{previewGPSR.abbreviation}</span>
                       </div>
                       <p className="text-sm font-black text-gray-800 leading-tight">{previewGPSR.gpsrData.manufacturerName || '---'}</p>
                       <div className="flex items-start gap-2.5 mt-1">
                         <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                         <p className="text-[11px] font-bold text-gray-500 leading-relaxed">{formatAddress(previewGPSR.gpsrData.manufacturerAddress) || 'Brak danych adresowych.'}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 flex flex-col gap-2">
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">E-MAIL</p>
                         <p className="text-[11px] font-black text-blue-700 truncate flex items-center gap-2"><Mail size={14} /> {previewGPSR.gpsrData.manufacturerEmail || '---'}</p>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-2">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">WITRYNA WWW</p>
                         <p className="text-[11px] font-black text-gray-800 truncate flex items-center gap-2"><Globe size={14} /> {previewGPSR.gpsrData.manufacturerWeb ? 'PRZEJDŹ DO STRONY' : '---'}</p>
                      </div>
                    </div>
                 </div>
                 {previewGPSR.gpsrData.importerName && (
                   <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Info size={16} className="text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">DANE IMPORTERA</span>
                      </div>
                      <div className="p-5 bg-indigo-50/30 rounded-3xl border border-indigo-100 flex flex-col gap-1.5">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{previewGPSR.gpsrData.importerName}</p>
                        <p className="text-[11px] font-bold text-gray-500 leading-snug flex items-center gap-2"><MapPin size={12} /> {formatAddress(previewGPSR.gpsrData.importerAddress)}</p>
                      </div>
                   </div>
                 )}
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setPreviewGPSR(null)} className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 shadow-sm">Zamknij</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProducerList;
