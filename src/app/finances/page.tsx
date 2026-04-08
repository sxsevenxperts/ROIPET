'use client';

import { useEffect, useState } from 'react';
import { FinancialTransaction, ScheduledPayment } from '@/types';
import { FinancialTransactions } from '@/components/FinancialTransactions';
import { ScheduledPayments } from '@/components/ScheduledPayments';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'payments'>('transactions');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    fetchData();
  }, [currentMonth, activeTab]);

  const fetchData = async () => {
    try {
      const [transRes, paymentsRes] = await Promise.all([
        fetch(`/api/finances/transactions?month=${currentMonth}`),
        fetch('/api/finances/payments'),
      ]);

      setTransactions(await transRes.json());
      setPayments(await paymentsRes.json());
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;

    try {
      const response = await fetch(`/api/finances/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTransactions(transactions.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const deletePayment = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este pagamento?')) return;

    try {
      const response = await fetch(`/api/finances/payments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPayments(payments.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">💰 Finanças</h1>
          {activeTab === 'transactions' ? (
            <Link href="/finances/transaction/new">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Transação
              </button>
            </Link>
          ) : (
            <Link href="/finances/payment/new">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Pagamento
              </button>
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {(['transactions', 'payments'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'transactions' && '📊 Transações'}
              {tab === 'payments' && '📋 Pagamentos'}
            </button>
          ))}
        </div>

        {/* Transações */}
        {activeTab === 'transactions' && (
          <div>
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Mês:</label>
              <input
                type="month"
                value={currentMonth}
                onChange={e => setCurrentMonth(e.target.value)}
                className="form-input w-40"
              />
            </div>

            <FinancialTransactions
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          </div>
        )}

        {/* Pagamentos */}
        {activeTab === 'payments' && (
          <ScheduledPayments
            payments={payments}
            onUpdate={fetchData}
            onDelete={deletePayment}
          />
        )}
      </main>
    </div>
  );
}
