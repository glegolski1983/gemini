
import React from 'react';
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
} from 'recharts';
import { Package, FileText, Database, Share2 } from 'lucide-react';

const statData = [
  { label: 'Produkty', value: '1,284', icon: <Package size={20} />, bgColor: 'bg-blue-600', textColor: 'text-blue-600' },
  { label: 'Opisy AI', value: '856', icon: <FileText size={20} />, bgColor: 'bg-emerald-500', textColor: 'text-emerald-500' },
  { label: 'Źródła', value: '12', icon: <Database size={20} />, bgColor: 'bg-orange-500', textColor: 'text-orange-500' },
  { label: 'Relacje Graf', value: '4,512', icon: <Share2 size={20} />, bgColor: 'bg-indigo-600', textColor: 'text-indigo-600' },
];

const barData = [
  { name: 'Pon', value: 400 },
  { name: 'Wt', value: 300 },
  { name: 'Śr', value: 200 },
  { name: 'Czw', value: 278 },
  { name: 'Pt', value: 189 },
  { name: 'Sob', value: 239 },
  { name: 'Ndz', value: 349 },
];

const pieData = [
  { name: 'Aktywne', value: 400 },
  { name: 'W trakcie', value: 300 },
  { name: 'Oczekujące', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statData.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`${stat.bgColor} p-3 rounded-xl text-white shadow-lg shadow-${stat.bgColor.split('-')[1]}/20`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Aktywność opisywania (7 dni)</h4>
            <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">TYGODNIOWY</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9ca3af' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Status katalogu</h4>
            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">REAL-TIME</div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Row Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ostatnio dodane produkty</h4>
          <button className="text-xs font-semibold text-blue-600 hover:underline">Zobacz wszystkie</button>
        </div>
        <div className="divide-y divide-gray-50">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Przykładowy Produkt {i}</p>
                  <p className="text-[10px] text-gray-400">SKU-2024-000{i} • Elektronika</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Aktywny</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
