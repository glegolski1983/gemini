
import React, { useState } from 'react';
import { 
  Search, 
  History, 
  Filter, 
  Clock, 
  User, 
  Database, 
  ChevronRight, 
  Edit3, 
  PlusCircle, 
  Trash2, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { ChangeLog } from '../types';

const mockLogs: ChangeLog[] = [
  {
    id: 'LOG-001',
    userId: 'U-3',
    userName: 'Łukasz Glegolski',
    timestamp: '2024-03-20 14:25:01',
    entityType: 'PRODUKT',
    entityName: 'Logitech MX Master 3S',
    action: 'EDYCJA',
    details: 'Zmiana wagi urządzenia',
    oldValue: '1.79 kg',
    newValue: '1.41 kg'
  },
  {
    id: 'LOG-002',
    userId: 'U-3',
    userName: 'Łukasz Glegolski',
    timestamp: '2024-03-20 14:15:22',
    entityType: 'PRODUKT',
    entityName: 'Dell Latitude 5510',
    action: 'AI_GEN',
    details: 'Wygenerowano opis marketingowy przez AI (Gemini)',
  },
  {
    id: 'LOG-003',
    userId: 'U-5',
    userName: 'Łukasz Majchrzak',
    timestamp: '2024-03-20 13:40:00',
    entityType: 'JEDNOSTKA',
    entityName: 'Pojemność danych',
    action: 'DODANIE',
    details: 'Dodano nową wariację: PB (Petabajt)',
  },
  {
    id: 'LOG-004',
    userId: 'U-1',
    userName: 'Radosław Herbuś',
    timestamp: '2024-03-20 12:10:45',
    entityType: 'FORMATKA',
    entityName: 'Notebooki',
    action: 'SYNC',
    details: 'Synchronizacja statusu formatki z PIMM',
  },
  {
    id: 'LOG-005',
    userId: 'U-3',
    userName: 'Łukasz Glegolski',
    timestamp: '2024-03-20 11:05:12',
    entityType: 'PRODUKT',
    entityName: 'Apple MagSafe Charger',
    action: 'EDYCJA',
    details: 'Zmiana nazwy Allegro',
    oldValue: 'Apple MagSafe Charger USB-C',
    newValue: 'Oryginalna Ładowarka Apple MagSafe USB-C'
  },
  {
    id: 'LOG-006',
    userId: 'U-1',
    userName: 'Radosław Herbuś',
    timestamp: '2024-03-20 10:30:00',
    entityType: 'UZYTKOWNIK',
    entityName: 'Jan Kowalski',
    action: 'DODANIE',
    details: 'Utworzenie konta użytkownika',
  }
];

const ChangeLogList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('Wszystkie');

  const filteredLogs = mockLogs.filter(log => {
    const matchesQuery = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'Wszystkie' || log.entityType === filterType;
    
    return matchesQuery && matchesType;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'EDYCJA':
        return <span className="flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase border border-blue-100"><Edit3 size={10}/> Edycja</span>;
      case 'DODANIE':
        return <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase border border-emerald-100"><PlusCircle size={10}/> Dodanie</span>;
      case 'USUNIĘCIE':
        return <span className="flex items-center gap-1 text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded uppercase border border-rose-100"><Trash2 size={10}/> Usunięcie</span>;
      case 'SYNC':
        return <span className="flex items-center gap-1 text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase border border-indigo-100"><RefreshCw size={10}/> Sync</span>;
      case 'AI_GEN':
        return <span className="flex items-center gap-1 text-[10px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded uppercase border border-purple-100"><Sparkles size={10}/> AI Gen</span>;
      default:
        return <span className="text-[10px] font-black bg-gray-50 text-gray-500 px-2 py-0.5 rounded uppercase border border-gray-100">{action}</span>;
    }
  };

  const getEntityTypeIcon = (type: string) => {
    switch (type) {
      case 'PRODUKT': return <Database size={16} className="text-blue-500" />;
      case 'FORMATKA': return <History size={16} className="text-amber-500" />;
      case 'UZYTKOWNIK': return <User size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-black pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase italic">
            <History className="text-blue-600" size={36} />
            Logowanie zmian
          </h2>
          <p className="text-gray-500 font-medium">Pełny audyt aktywności użytkowników w systemie PIMM.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Szukaj po użytkowniku, obiekcie lub szczegółach zmiany..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-12 px-6 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              <option>Wszystkie</option>
              <option>PRODUKT</option>
              <option>FORMATKA</option>
              <option>JEDNOSTKA</option>
              <option>UZYTKOWNIK</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-inner bg-gray-50/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-8 py-5">Użytkownik & Data</th>
                  <th className="px-8 py-5">Akcja</th>
                  <th className="px-8 py-5">Obiekt</th>
                  <th className="px-8 py-5">Szczegóły zmiany</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {log.userName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-1">
                          <Clock size={12} />
                          {log.timestamp}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {getEntityTypeIcon(log.entityType)}
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{log.entityType}</span>
                          <span className="text-xs font-black text-gray-700">{log.entityName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-600 leading-snug">{log.details}</p>
                        {log.oldValue && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-rose-500 line-through bg-rose-50 px-1.5 rounded">{log.oldValue}</span>
                            <ArrowRight size={10} className="text-gray-300" />
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 rounded">{log.newValue}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-blue-600 transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLogList;
