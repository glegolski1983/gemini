
import React, { useState } from 'react';
import { 
  Tags, 
  Plus, 
  Search, 
  MoreVertical, 
  ChevronRight, 
  Layers, 
  Database,
  ArrowRight,
  Info,
  Edit3,
  Trash2
} from 'lucide-react';

const ProductTypes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockTypes = [
    { id: 'T1', name: 'Notebooki', category: 'Elektronika', fieldsCount: 45, products: 692 },
    { id: 'T2', name: 'Smartfony', category: 'Telekomunikacja', fieldsCount: 38, products: 1240 },
    { id: 'T3', name: 'Klawiatury', category: 'Akcesoria', fieldsCount: 22, products: 421 },
    { id: 'T4', name: 'Myszy', category: 'Akcesoria', fieldsCount: 18, products: 570 },
    { id: 'T5', name: 'Monitory', category: 'Elektronika', fieldsCount: 32, products: 843 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-black">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Typy Produktów</h2>
          <p className="text-sm text-gray-500 mt-1">Definiowanie szablonów technicznych dla konkretnych grup asortymentowych.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1a2b4d] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 whitespace-nowrap">
          <Plus size={18} strokeWidth={3} />
          Nowy Typ Produktu
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 sticky top-0 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Szukaj typów produktów..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col">
            <div className="p-6 border-b border-gray-50 bg-gray-50/20">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                  <Tags size={22} />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3 className="text-base font-black text-gray-900 leading-tight mb-1">{type.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{type.category}</p>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Pola Techniczne</span>
                   <span className="text-sm font-black text-gray-700 mt-1">{type.fieldsCount}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Liczba Produktów</span>
                   <span className="text-sm font-black text-blue-600 mt-1">{type.products}</span>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-50 border-t border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
              Zarządzaj strukturą
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTypes;
