
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialSummary, Transaction } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getFinancialInsights = async (summary: FinancialSummary, transactions: Transaction[]) => {
  if (!API_KEY) return "Configure sua API Key para receber dicas personalizadas.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Como um mentor financeiro, analise estes dados:
    Renda Total: R$ ${summary.totalIncome.toFixed(2)}
    Despesas Fixas: R$ ${summary.totalExpense.toFixed(2)}
    Meta de Poupança: R$ ${summary.savingsTarget.toFixed(2)}
    Sobras: R$ ${summary.remainingBalance.toFixed(2)}
    
    Lista de transações:
    ${transactions.map(t => `- ${t.description}: R$ ${t.amount.toFixed(2)} (${t.type})`).join('\n')}

    Dê 3 dicas curtas e práticas em português para melhorar a saúde financeira deste usuário. Seja direto e encorajador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Não foi possível gerar dicas no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com o mentor financeiro. Tente novamente mais tarde.";
  }
};
