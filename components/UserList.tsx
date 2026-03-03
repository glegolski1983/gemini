
import React, { useState } from 'react';
import { Search, MoreVertical, Plus, UserPlus, UserCircle, X, ChevronDown, Check } from 'lucide-react';
import { User } from '../types';

const mockUsersData: User[] = [
  {
    id: '1',
    name: 'Radosław Herbuś',
    role: 'SUPER ADMINISTRATOR',
    group: 'Użytkownicy Action',
    lang: 'pl',
    email: 'Radoslaw.Herbus@action.pl',
    phone: 'Brak danych',
    type: 'ACTION',
    status: 'AKTYWNY',
    approval: 'ZAAKCEPTOWANY',
    mfa: true,
    method: 'Active Directory',
    lastLogin: '2026-01-26 12:27:14',
    createdDate: '2025-12-01 12:33:59',
    editDate: '2026-01-30 14:30:00'
  },
  {
    id: '3',
    name: 'Łukasz Glegolski',
    role: 'SUPER ADMINISTRATOR',
    group: 'Użytkownicy Action',
    lang: 'pl',
    email: 'lukasz.glegolski@action.pl',
    phone: 'Brak danych',
    type: 'ACTION',
    status: 'AKTYWNY',
    approval: 'ZAAKCEPTOWANY',
    mfa: true,
    method: 'Active Directory',
    lastLogin: '2026-02-09 09:44:13',
    createdDate: '2025-12-01 13:25:24',
    editDate: '2026-02-09 09:44:14'
  },
  {
    id: '4',
    name: 'Jarosław Dobrowolski',
    role: 'SUPER ADMINISTRATOR',
    group: 'Użytkownicy Action',
    lang: 'pl',
    email: 'jaroslaw.dobrowolski@action.pl',
    phone: 'Brak danych',
    type: 'ACTION',
    status: 'AKTYWNY',
    approval: 'ZAAKCEPTOWANY',
    mfa: true,
    method: 'Active Directory',
    lastLogin: '2025-12-01 13:38:11',
    createdDate: '2025-12-01 13:28:26',
    editDate: '2026-01-30 14:30:00'
  },
  {
    id: '5',
    name: 'Łukasz Majchrzak',
    role: 'SUPER ADMINISTRATOR',
    group: 'Użytkownicy Action',
    lang: 'pl',
    email: 'lukasz.majchrzak@action.pl',
    phone: '+48 502 787 040',
    type: 'ACTION',
    status: 'AKTYWNY',
    approval: 'ZAAKCEPTOWANY',
    mfa: true,
    method: 'Active Directory',
    lastLogin: '2026-02-09 09:07:46',
    createdDate: '2025-12-01 13:35:46',
    editDate: '2026-02-09 09:07:46'
  }
];

const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDirectory, setActiveDirectory] = useState(true);

  return (
    <div className="space-y-6">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-[680px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-10 pt-10 pb-6 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Dodaj użytkownika</h3>
              <p className="text-[13px] text-gray-400 mt-1">Wypełnij poniższy formularz aby utworzyć użytkownika Action</p>
            </div>

            {/* Modal Form Content */}
            <div className="px-10 pb-10 space-y-5">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-gray-700">Wybierz rolę</label>
                <div className="relative">
                  <select className="w-full h-11 px-4 appearance-none bg-white border border-gray-200 rounded-lg text-[13px] text-gray-400 focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all">
                    <option>Wybierz rolę</option>
                    <option>Super Administrator</option>
                    <option>Administrator</option>
                    <option>Użytkownik</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Grid 2 Columns: Language & Name */}
              <div className="grid grid-cols-2 gap-x-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Język</label>
                  <div className="relative">
                    <select className="w-full h-11 px-4 appearance-none bg-white border border-gray-200 rounded-lg text-[13px] text-gray-400 focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all">
                      <option>Wybierz język</option>
                      <option>Polski</option>
                      <option>Angielski</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Imię</label>
                  <input 
                    type="text" 
                    placeholder="Imię" 
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all placeholder:text-gray-300" 
                  />
                </div>
              </div>

              {/* Grid 2 Columns: Surname & Email */}
              <div className="grid grid-cols-2 gap-x-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Nazwisko</label>
                  <input 
                    type="text" 
                    placeholder="Nazwisko" 
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all placeholder:text-gray-300" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all placeholder:text-gray-300" 
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-gray-700">Telefon</label>
                <div className="flex gap-x-3">
                  <div className="w-[110px] relative shrink-0">
                    <select className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all">
                      <option>+48</option>
                      <option>+44</option>
                      <option>+49</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Numer telefonu" 
                    className="flex-1 h-11 px-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] outline-none transition-all placeholder:text-gray-300" 
                  />
                </div>
              </div>

              {/* Active Directory Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => setActiveDirectory(!activeDirectory)}
                    className={`w-[18px] h-[18px] rounded border transition-all flex items-center justify-center shrink-0 mt-0.5 ${
                      activeDirectory ? 'bg-[#107c41] border-[#107c41]' : 'bg-white border-gray-300'
                    }`}
                  >
                    {activeDirectory && <Check size={12} strokeWidth={4} className="text-white" />}
                  </button>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-bold text-gray-900 leading-none">Logowanie przez Active Directory</p>
                    <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">Pozostaw zaznaczone dla kont firmowych. Odznacz, aby utworzyć logowanie na hasło.</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-x-3 mt-10">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-[10px] bg-white border border-gray-200 text-gray-700 text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button 
                  className="px-8 py-[10px] bg-[#107c41] text-white text-[13px] font-bold rounded-lg hover:bg-[#0d6334] transition-colors shadow-sm"
                >
                  Dodaj użytkownika
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] text-gray-400">
        <span>Strona Główna</span>
        <span>/</span>
        <span className="text-gray-600">Użytkownicy</span>
      </div>

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Użytkownicy</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#107c41] text-white rounded-lg text-sm font-semibold hover:bg-[#0d6334] transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Dodaj użytkownika Action
          </button>
        </div>
      </div>

      {/* Search Bar only */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Szukaj użytkowników..." 
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#107c41]/20 focus:border-[#107c41] focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 w-24">ID <span className="inline-block text-gray-300 ml-1">↓</span></th>
                <th className="px-6 py-4">Podgląd użytkownika <span className="inline-block text-gray-300 ml-1">↑</span></th>
                <th className="px-6 py-4">Kontakt</th>
                <th className="px-6 py-4">Konto i dostęp</th>
                <th className="px-6 py-4">Aktywność <span className="inline-block text-gray-300 ml-1">↑</span></th>
                <th className="px-4 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group align-top">
                  <td className="px-6 py-6">
                    <div className="bg-[#e9f0fe] text-[#2b64e3] px-3 py-2 rounded text-[10px] font-bold leading-tight uppercase text-center mb-1">
                      UŻYTKOWNICY<br/>ACTION
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium px-1">#{user.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                        <UserCircle size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{user.name}</span>
                          <span className="text-[9px] font-bold bg-[#f1e6ff] text-[#8e44ad] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          <span className="text-gray-400">Grupa:</span> {user.group} 
                          <span className="ml-3 text-gray-400">Język:</span> {user.lang}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Email</p>
                        <p className="text-[11px] font-bold text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Telefon</p>
                        <p className="text-[11px] text-gray-500 font-medium">{user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <span className="bg-[#e7f7e9] text-[#2d8a39] text-[9px] font-black px-1.5 py-1 rounded uppercase tracking-tighter shadow-sm">
                          {user.status}
                        </span>
                        <span className="bg-[#e7f7e9] text-[#2d8a39] text-[9px] font-black px-1.5 py-1 rounded uppercase tracking-tighter shadow-sm">
                          {user.approval}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        <p>Uwierzytelnianie dwuskładnikowe: <span className="font-bold text-gray-700">{user.mfa ? 'Włączone' : 'Wyłączone'}</span></p>
                        <p>Metoda logowania: <span className="font-bold text-gray-700">{user.method}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-[11px] text-gray-500 space-y-1.5">
                      <p>Ostatnie logowanie: <span className="font-bold text-gray-800">{user.lastLogin}</span></p>
                      <p>Data utworzenia: <span className="text-gray-600">{user.createdDate}</span></p>
                      <p>Data edycji: <span className="text-gray-600">{user.editDate}</span></p>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
