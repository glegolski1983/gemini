
import React, { useState } from 'react';
import { 
  Search, 
  BrainCircuit, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Package,
  Sparkles,
  Zap,
  ChevronRight,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  TrendingUp,
  Activity,
  ArrowLeft,
  MoreVertical,
  Layers,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { semanticSearchProducts } from '../services/geminiService';
import ProductDetails from './ProductDetails';

const PRODUCT_IMG = "https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2025/7/pr_2025_7_16_8_18_16_480_00.jpg";

const MOCK_RESULTS = [
  { 
    id: '1', 
    actionId: 'PERLOGMYS0001', 
    ean: '5099206085816', 
    partNumber: '910-005647', 
    name: 'Logitech MX Master 3S Wireless Mouse - Graphite', 
    category: 'Myszki', 
    producer: 'Logitech',
    productManager: 'Jan Kowalski',
    status: 'Active',
    image: PRODUCT_IMG,
    group: 'Myszki bezprzewodowe',
    subgroup: 'Akcesoria'
  },
  { 
    id: '2', 
    actionId: 'PERASUKLA0003', 
    ean: '4711081512394', 
    partNumber: '90MB18Q0-M0EAY0', 
    name: 'ASUS ROG Strix Scope RX Wireless Deluxe', 
    category: 'Klawiatury', 
    producer: 'ASUS',
    productManager: 'Sebastian Osytek',
    status: 'Active',
    image: PRODUCT_IMG,
    group: 'Klawiatury mechaniczne',
    subgroup: 'Akcesoria'
  },
  { 
    id: '3', 
    actionId: 'PERRAZKLA0004', 
    ean: '8806094511512', 
    partNumber: 'MZ-V8P2T0BW', 
    name: 'Razer BlackWidow V4 Pro Mechanical', 
    category: 'Klawiatury', 
    producer: 'Razer',
    productManager: 'Anna Nowak',
    status: 'Active',
    image: PRODUCT_IMG,
    group: 'Klawiatury mechaniczne',
    subgroup: 'Akcesoria'
  },
  { 
    id: '4', 
    actionId: 'PERLOGKLA0915', 
    ean: '5099206065002', 
    partNumber: '920-008910', 
    name: 'Logitech G915 LIGHTSPEED Wireless RGB', 
    category: 'Klawiatury', 
    producer: 'Logitech',
    productManager: 'Piotr Wiśniewski',
    status: 'Active',
    image: PRODUCT_IMG,
    group: 'Klawiatury mechaniczne',
    subgroup: 'Akcesoria'
  },
];

const SOURCES = [
  { id: 'is3', name: 'i-serwis3', color: '#3b82f6' },
  { id: 'krakvet', name: 'krakvet', color: '#10b981' },
  { id: 'sferis', name: 'Sferis', color: '#f59e0b' },
  { id: 'pds', name: 'PDS', color: '#6366f1' }
];

const FREQUENT_QUERIES_DATA = [
  { query: 'laptop gamingowy 17 cali', count: 1240 },
  { query: 'karma dla psa bez zbóż', count: 980 },
  { query: 'myszka bezprzewodowa logitech', count: 850 },
  { query: 'iphone 15 pro 256gb', count: 720 },
  { query: 'klawiatura mechaniczna cicha', count: 640 },
  { query: 'kabel hdmi 2.1 5m', count: 590 },
  { query: 'monitor 4k do grafiki', count: 430 },
];

const SOURCE_DISTRIBUTION_DATA = [
  { name: 'i-serwis3', value: 45 },
  { name: 'krakvet', value: 25 },
  { name: 'Sferis', value: 20 },
  { name: 'PDS', value: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const SemanticSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'analysis'>('search');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await semanticSearchProducts(query);
      setResult(data);
    } catch (error) {
      alert("Błąd podczas analizy semantycznej.");
    } finally {
      setIsLoading(false);
    }
  };

  if (viewingProduct) {
    // Pass identified search parameters to ProductDetails
    const highlightedAttributes = result?.params?.requiredProperties?.map((p: any) => p.name) || [];
    return (
      <ProductDetails 
        product={viewingProduct} 
        onBack={() => setViewingProduct(null)} 
        highlightedAttributes={highlightedAttributes}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-black pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
            <BrainCircuit className="text-blue-600" size={36} />
            Inteligentne Szukanie
          </h2>
          <p className="text-gray-500 font-medium">Mapowanie intencji klienta na strukturę danych PIMM.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-[#1a2b4d] text-white shadow-lg shadow-blue-900/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <Search size={16} />
            Wyszukiwarka AI
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'bg-[#1a2b4d] text-white shadow-lg shadow-blue-900/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 size={16} />
            Analiza wyszukiwań klientów
          </button>
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden p-2 flex items-center gap-2">
               <div className="pl-6 text-blue-600 shrink-0">
                 <BrainCircuit size={28} />
               </div>
               <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="np. Klawiatura z podświetleniem bezprzewodowa do 500zł..."
                  className="flex-1 px-4 py-5 bg-transparent text-lg font-bold outline-none placeholder:text-gray-300"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !query}
                  className="bg-[#1a2b4d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-900 disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                  ANALIZUJ
                </button>
            </div>
          </form>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <RefreshCw className="animate-spin" size={32} />
               </div>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Mapowanie logiczne PIMM...</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Technical Mapping Results */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                 <div className="p-6 bg-indigo-50/50 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={16} /> Rozpoznane parametry techniczne
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase">Deep Analysis</span>
                       <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">Match: 100%</span>
                    </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <th className="px-6 py-4">Atrybut PIMM</th>
                          <th className="px-6 py-4">Warunek</th>
                          <th className="px-6 py-4">Wartość</th>
                          <th className="px-6 py-4">Relacje (OR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {result.params.requiredProperties?.map((prop: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                             <td className="px-6 py-4 font-black text-[13px] text-gray-900">{prop.name}</td>
                             <td className="px-6 py-4 text-center">
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-mono font-bold text-xs">{prop.condition}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(prop.value) ? prop.value.map((v: string) => (
                                    <span key={v} className="text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{v}</span>
                                  )) : <span className="text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{prop.value}</span>}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {prop.or_with?.map((or: string) => (
                                    <span key={or} className="text-[9px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">{or}</span>
                                  ))}
                                </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
              </div>

              {/* Product Matches Section (Analogous to ProductList) */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                     <Package size={20} className="text-blue-600" /> DOPASOWANE PRODUKTY W KATALOGU
                   </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <th className="px-6 py-4 w-40">KOD ACTIONID</th>
                        <th className="px-6 py-4">Nazwa Produktu</th>
                        <th className="px-6 py-4">EAN</th>
                        <th className="px-6 py-4">Producent</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_RESULTS.map((p) => (
                        <tr 
                          key={p.id} 
                          className="hover:bg-blue-50/30 transition-colors group cursor-pointer" 
                          onClick={() => setViewingProduct(p)}
                        >
                          <td className="px-6 py-4 text-[13px] font-bold text-[#1a2b4d] tracking-tight whitespace-nowrap">{p.actionId}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                              </div>
                              <span className="text-sm font-semibold text-gray-800 leading-tight">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[12px] text-gray-500 font-medium">{p.ean}</td>
                          <td className="px-6 py-4"><span className="text-[12px] font-bold text-gray-600">{p.producer}</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                              p.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CUSTOMER SEARCH ANALYSIS TAB */
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {SOURCES.map(source => (
               <div key={source.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Globe size={64} className="text-gray-900" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: source.color }}>
                       <Globe size={20} />
                    </div>
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{source.name}</span>
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Dzienne zapytania</p>
                     <div className="flex items-end gap-2">
                        <h4 className="text-2xl font-black text-gray-900">{(Math.random() * 5000 + 1000).toFixed(0)}</h4>
                        <span className="text-[10px] font-black text-emerald-500 mb-1.5 flex items-center gap-0.5"><TrendingUp size={10} /> +12%</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                     <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                        <Activity size={20} className="text-blue-600" /> Najczęstsze Zapytania
                     </h3>
                     <p className="text-xs text-gray-400 font-medium">Wolumen wyszukiwań z ostatnich 30 dni</p>
                  </div>
               </div>
               
               <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FREQUENT_QUERIES_DATA} layout="vertical" margin={{ left: 50, right: 30 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <XAxis type="number" hide />
                       <YAxis 
                          dataKey="query" 
                          type="category" 
                          width={150} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                        />
                       <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                       />
                       <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                     <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                        <PieChartIcon size={20} className="text-indigo-600" /> Rozkład Ruchu per Kanał
                     </h3>
                     <p className="text-xs text-gray-400 font-medium">Procentowy udział zapytań semantycznych</p>
                  </div>
               </div>
               
               <div className="flex-1 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={SOURCE_DISTRIBUTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {SOURCE_DISTRIBUTION_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                       />
                       <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          formatter={(value) => <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{value}</span>}
                        />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
