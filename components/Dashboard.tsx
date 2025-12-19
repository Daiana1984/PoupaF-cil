
import React, { useState, useEffect } from 'react';
import { UserData, FinancialSummary, Transaction, TransactionType, SavingsGoal, AppTab, TransactionCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Target, Wallet, AlertTriangle, Lightbulb, Settings2, ArrowLeftRight, CreditCard, Lock, Zap } from 'lucide-react';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  activeTab: AppTab;
  userData: UserData;
  summary: FinancialSummary;
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  activeTab,
  userData, 
  summary, 
  addTransaction, 
  deleteTransaction, 
  updateSavingsGoal,
  onReset 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [insights, setInsights] = useState<string>('Carregando dicas do mentor...');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>('EXPENSE');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('FIXED');

  useEffect(() => {
    const fetchInsights = async () => {
      const text = await getFinancialInsights(summary, userData.transactions);
      setInsights(text);
    };
    fetchInsights();
  }, [summary, userData.transactions]);

  const handleAdd = () => {
    if (!newDesc || !newAmount) return;
    addTransaction({
      id: crypto.randomUUID(),
      description: newDesc,
      amount: parseFloat(newAmount),
      type: newType,
      category: newType === 'INCOME' ? 'FIXED' : newCategory
    });
    setNewDesc('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const chartData = [
    { name: 'Fixos', value: summary.totalFixed, color: '#EF4444' },
    { name: 'Variáveis', value: summary.totalVariable, color: '#F59E0B' },
    { name: 'Poupança', value: summary.savingsTarget, color: '#6366F1' },
    { name: 'Disponível', value: Math.max(0, summary.remainingBalance), color: '#10B981' },
  ];

  const healthColor = {
    HEALTHY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200'
  }[summary.healthStatus];

  // Logic to filter transactions based on active tab
  const filteredTransactions = userData.transactions.filter(t => {
    if (activeTab === 'extrato') return true;
    if (activeTab === 'entradas') return t.type === 'INCOME';
    if (activeTab === 'fixos') return t.type === 'EXPENSE' && t.category === 'FIXED';
    if (activeTab === 'variaveis') return t.type === 'EXPENSE' && t.category === 'VARIABLE';
    return true; // For dashboard it's irrelevant or shows summary
  });

  const renderView = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <>
            {/* Health Indicator */}
            <div className={`mb-8 p-4 rounded-2xl border-2 ${healthColor} flex items-center gap-3`}>
              {summary.healthStatus === 'HEALTHY' && <TrendingUp size={24} />}
              {summary.healthStatus === 'WARNING' && <AlertTriangle size={24} />}
              {summary.healthStatus === 'CRITICAL' && <AlertTriangle size={24} />}
              <span className="font-semibold">
                {summary.healthStatus === 'HEALTHY' && "Sua saúde financeira está ótima! Tudo sob controle."}
                {summary.healthStatus === 'WARNING' && "Atenção: Sobrou pouco no mês. Cuidado com novos gastos."}
                {summary.healthStatus === 'CRITICAL' && "Alerta: Suas despesas ultrapassaram sua renda!"}
              </span>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard label="Entradas" value={summary.totalIncome} icon={<TrendingUp className="text-emerald-500" />} />
              <SummaryCard label="Saídas" value={summary.totalExpense} icon={<TrendingDown className="text-red-500" />} />
              <SummaryCard label="Poupança" value={summary.savingsTarget} icon={<Target className="text-indigo-500" />} />
              <SummaryCard label="Sobrou" value={summary.remainingBalance} icon={<Wallet className="text-gray-500" />} highlight />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Divisão de Gastos</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-4 text-indigo-700">
                  <Lightbulb size={24} />
                  <h2 className="text-lg font-bold">Dicas do Mentor IA</h2>
                </div>
                <div className="text-indigo-900 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {insights}
                </div>
              </div>
            </div>
          </>
        );

      case 'metas':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Target className="text-indigo-600" /> Meta de Poupança
            </h2>
            <div className="space-y-8">
              <div>
                <p className="text-gray-600 mb-4">Quanto da sua renda você quer poupar mensalmente?</p>
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => updateSavingsGoal({ ...userData.savingsGoal, type: 'PERCENTAGE' })}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${userData.savingsGoal.type === 'PERCENTAGE' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
                  >
                    Porcentagem (%)
                  </button>
                  <button 
                    onClick={() => updateSavingsGoal({ ...userData.savingsGoal, type: 'FIXED' })}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${userData.savingsGoal.type === 'FIXED' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
                  >
                    Valor Fixo (R$)
                  </button>
                </div>
                
                <div className="flex flex-col items-center">
                  <input 
                    type="range"
                    min="0"
                    max={userData.savingsGoal.type === 'PERCENTAGE' ? 100 : summary.totalIncome}
                    step={userData.savingsGoal.type === 'PERCENTAGE' ? 1 : 50}
                    value={userData.savingsGoal.value}
                    onChange={(e) => updateSavingsGoal({ ...userData.savingsGoal, value: parseFloat(e.target.value) })}
                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-6"
                  />
                  <span className="text-5xl font-black text-indigo-600">
                    {userData.savingsGoal.type === 'PERCENTAGE' ? `${userData.savingsGoal.value}%` : `R$ ${userData.savingsGoal.value.toFixed(0)}`}
                  </span>
                  <p className="mt-4 text-gray-400 font-medium">Equivale a R$ {summary.savingsTarget.toFixed(2)} por mês</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        const titles: Record<string, string> = {
          extrato: 'Histórico Completo',
          entradas: 'Minhas Entradas',
          fixos: 'Despesas Fixas',
          variaveis: 'Despesas Variáveis'
        };
        return (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">{titles[activeTab]}</h2>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {filteredTransactions.length} Itens
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <div className="py-20 text-center">
                  <ArrowLeftRight size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400">Nenhum registro encontrado nesta categoria.</p>
                </div>
              ) : (
                filteredTransactions.map(t => (
                  <div key={t.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${
                        t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 
                        t.category === 'FIXED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {t.type === 'INCOME' ? <TrendingUp size={20} /> : t.category === 'FIXED' ? <Lock size={20} /> : <Zap size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{t.description}</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                          {t.type === 'INCOME' ? 'Renda' : t.category === 'FIXED' ? 'Custo Fixo' : 'Custo Variável'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-lg font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-32">
      {/* Header */}
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === 'inicio' ? `Olá, ${userData.name}! 👋` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'inicio' ? 'Acompanhe seu fluxo financeiro mensal.' : 'Gerencie seus registros detalhados.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Novo
          </button>
          <button 
            onClick={onReset}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Resetar dados"
          >
            <Settings2 size={24} />
          </button>
        </div>
      </header>

      {renderView()}

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Novo Lançamento</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo de Fluxo</label>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                  <button 
                    onClick={() => setNewType('EXPENSE')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${newType === 'EXPENSE' ? 'bg-white text-red-500 shadow-md' : 'text-gray-500'}`}
                  >
                    Gasto
                  </button>
                  <button 
                    onClick={() => setNewType('INCOME')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${newType === 'INCOME' ? 'bg-white text-emerald-500 shadow-md' : 'text-gray-500'}`}
                  >
                    Renda
                  </button>
                </div>
              </div>

              {newType === 'EXPENSE' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button 
                      onClick={() => setNewCategory('FIXED')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${newCategory === 'FIXED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                      Custo Fixo
                    </button>
                    <button 
                      onClick={() => setNewCategory('VARIABLE')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${newCategory === 'VARIABLE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                      Variável
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">O que é?</label>
                <input 
                  type="text"
                  placeholder="Ex: Aluguel, Uber, Salário..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                  <input 
                    type="number"
                    placeholder="0,00"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 pl-12 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={!newDesc || !newAmount}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, highlight }) => (
  <div className={`p-5 rounded-3xl border transition-all ${highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
    <div className={`p-2 w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${highlight ? 'bg-white/20' : 'bg-gray-50'}`}>
      {icon}
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-white/70' : 'text-gray-400'}`}>{label}</p>
    <p className={`text-lg font-black truncate`}>
      R$ {value.toFixed(2)}
    </p>
  </div>
);

export default Dashboard;
