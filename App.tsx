
import React, { useState, useEffect, useMemo } from 'react';
import { UserData, Transaction, SavingsGoal, FinancialSummary, AppTab } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

const STORAGE_KEY = 'poupa-facil-data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      onboarded: false,
      name: '',
      transactions: [],
      savingsGoal: { type: 'PERCENTAGE', value: 10 }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const summary = useMemo((): FinancialSummary => {
    const totalIncome = userData.transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpense = userData.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalFixed = userData.transactions
      .filter(t => t.type === 'EXPENSE' && t.category === 'FIXED')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalVariable = userData.transactions
      .filter(t => t.type === 'EXPENSE' && t.category === 'VARIABLE')
      .reduce((acc, t) => acc + t.amount, 0);

    const savingsTarget = userData.savingsGoal.type === 'PERCENTAGE'
      ? (totalIncome * userData.savingsGoal.value) / 100
      : userData.savingsGoal.value;

    const remainingBalance = totalIncome - totalExpense - savingsTarget;
    
    let healthStatus: FinancialSummary['healthStatus'] = 'HEALTHY';
    if (totalExpense > totalIncome) {
      healthStatus = 'CRITICAL';
    } else if (remainingBalance < 0) {
      healthStatus = 'WARNING';
    }

    return { totalIncome, totalExpense, totalFixed, totalVariable, savingsTarget, remainingBalance, healthStatus };
  }, [userData.transactions, userData.savingsGoal]);

  const handleOnboardingComplete = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data, onboarded: true }));
  };

  const addTransaction = (transaction: Transaction) => {
    setUserData(prev => ({
      ...prev,
      transactions: [...prev.transactions, transaction]
    }));
  };

  const deleteTransaction = (id: string) => {
    setUserData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    setUserData(prev => ({ ...prev, savingsGoal: goal }));
  };

  const resetData = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os dados?')) {
      setUserData({
        onboarded: false,
        name: '',
        transactions: [],
        savingsGoal: { type: 'PERCENTAGE', value: 10 }
      });
      setActiveTab('inicio');
    }
  };

  if (!userData.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <Dashboard 
          activeTab={activeTab}
          userData={userData} 
          summary={summary} 
          addTransaction={addTransaction} 
          deleteTransaction={deleteTransaction}
          updateSavingsGoal={updateSavingsGoal}
          onReset={resetData}
        />
      </main>
    </div>
  );
};

export default App;
