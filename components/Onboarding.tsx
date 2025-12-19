
import React, { useState } from 'react';
import { UserData, Transaction } from '../types';

interface OnboardingProps {
  onComplete: (data: Partial<UserData>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [income, setIncome] = useState<string>('');
  const [savingsPercent, setSavingsPercent] = useState<number>(10);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const incomeValue = parseFloat(income) || 0;
      const initialTransaction: Transaction = {
        id: crypto.randomUUID(),
        description: 'Salário Principal',
        amount: incomeValue,
        type: 'INCOME',
        category: 'FIXED'
      };

      onComplete({
        name,
        transactions: incomeValue > 0 ? [initialTransaction] : [],
        savingsGoal: { type: 'PERCENTAGE', value: savingsPercent }
      });
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10">
        <div className="flex justify-between mb-10">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 flex-1 mx-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-indigo-500' : 'bg-gray-100'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Boas-vindas! <span className="text-indigo-600">👋</span></h1>
            <p className="text-gray-500 font-medium">Vamos simplificar sua vida financeira. Qual o seu primeiro nome?</p>
            <input 
              type="text"
              placeholder="Ex: Maria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all font-semibold"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Sua Renda <span className="text-emerald-500">💰</span></h1>
            <p className="text-gray-500 font-medium">Qual o valor total que você recebe fixo por mês?</p>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">R$</span>
              <input 
                type="number"
                placeholder="0,00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl p-5 pl-14 focus:border-indigo-500 outline-none transition-all text-xl font-bold"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Meta de Poupança <span className="text-indigo-600">🎯</span></h1>
            <p className="text-gray-500 font-medium">Qual porcentagem da sua renda você deseja guardar todos os meses?</p>
            <div className="space-y-8 py-4">
              <div className="text-center text-6xl font-black text-indigo-600">
                {savingsPercent}%
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-sm text-gray-400 text-center font-medium px-4">
                {savingsPercent >= 20 ? "🚀 Meta ambiciosa! Liberdade financeira à vista." : 
                 savingsPercent >= 10 ? "✨ Excelente começo. O segredo é a constância." : 
                 "🌱 Começar pequeno é melhor que não começar."}
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={(step === 1 && !name) || (step === 2 && !income)}
          className={`w-full mt-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
            ((step === 1 && !name) || (step === 2 && !income)) 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-100'
          }`}
        >
          {step === 3 ? 'Vamos Começar!' : 'Próximo Passo'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
