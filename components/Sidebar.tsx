
import React from 'react';
import { Home, List, ArrowUpCircle, Lock, Zap, Target } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'extrato', label: 'Extrato', icon: List },
    { id: 'entradas', label: 'Entradas', icon: ArrowUpCircle },
    { id: 'fixos', label: 'Fixos', icon: Lock },
    { id: 'variaveis', label: 'Variáveis', icon: Zap },
    { id: 'metas', label: 'Metas', icon: Target },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="text-xl font-bold text-indigo-900 tracking-tight">PoupaFácil</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-100">
          <p className="text-xs font-medium opacity-80 mb-1">PLANO ATUAL</p>
          <p className="font-bold text-sm mb-3">Versão Gratuita</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">
            Fazer Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
