
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'FIXED' | 'VARIABLE';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface SavingsGoal {
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
}

export interface UserData {
  onboarded: boolean;
  name: string;
  transactions: Transaction[];
  savingsGoal: SavingsGoal;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalFixed: number;
  totalVariable: number;
  savingsTarget: number;
  remainingBalance: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export type AppTab = 'inicio' | 'extrato' | 'entradas' | 'fixos' | 'variaveis' | 'metas';
