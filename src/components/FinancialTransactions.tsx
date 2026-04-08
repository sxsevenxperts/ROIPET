'use client';

import { FinancialTransaction } from '@/types';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';

interface FinancialTransactionsProps {
  transactions: FinancialTransaction[];
  onDelete?: (id: string) => void;
}

const categoryIcons: Record<string, string> = {
  serviço: '💇',
  ração: '🍖',
  medicamento: '💊',
  utilities: '💡',
  consulta: '🏥',
  outro: '💰',
};

export function FinancialTransactions({ transactions, onDelete }: FinancialTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">Nenhuma transação registrada</p>
      </div>
    );
  }

  const revenues = transactions.filter(t => t.transaction_type === 'receita');
  const expenses = transactions.filter(t => t.transaction_type === 'despesa');

  const totalRevenue = revenues.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-green-500">
          <p className="text-sm text-gray-600 mb-1">Receitas</p>
          <p className="text-3xl font-bold text-green-600">
            R$ {totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="card border-l-4 border-l-red-500">
          <p className="text-sm text-gray-600 mb-1">Despesas</p>
          <p className="text-3xl font-bold text-red-600">
            R$ {totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className={`card border-l-4 ${balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <p className="text-sm text-gray-600 mb-1">Saldo</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transações */}
      <div className="space-y-3">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className={`card flex items-center justify-between p-4 border-l-4 ${
              transaction.transaction_type === 'receita'
                ? 'border-l-green-500'
                : 'border-l-red-500'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl">
                {categoryIcons[transaction.category] || '💰'}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {transaction.transaction_type === 'receita' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-red-600" />
                  )}
                  <p className="font-semibold text-gray-800">{transaction.description}</p>
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="capitalize">{transaction.category}</span>
                  <span>{new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}</span>
                </div>

                {transaction.notes && (
                  <p className="text-xs text-gray-600 mt-1">{transaction.notes}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className={`font-bold text-lg ${
                transaction.transaction_type === 'receita'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {transaction.transaction_type === 'receita' ? '+' : '-'}
                R$ {transaction.amount.toFixed(2)}
              </p>

              {onDelete && (
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
