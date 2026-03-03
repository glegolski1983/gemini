
import React from 'react';
import { Tablet, Mail, Bell, RotateCcw, Monitor } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 text-gray-400">
        <span className="text-xs font-medium text-gray-500 hidden md:inline">Panel Opisowy - Katalog Produktów</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r pr-6 border-gray-100">
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <Monitor size={18} />
          </button>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <Mail size={18} />
          </button>
          <div className="relative">
            <button className="text-gray-500 hover:text-blue-600 transition-colors">
              <Bell size={18} />
            </button>
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
              4
            </span>
          </div>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Łukasz Glegolski</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Administrator Systemu</p>
          </div>
          <img 
            src="https://picsum.photos/seed/lukasz/100/100" 
            alt="Avatar" 
            className="w-9 h-9 rounded-full border border-gray-200 group-hover:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
