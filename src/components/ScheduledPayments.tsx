'use client';

import { ScheduledPayment } from '@/types';
import { CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ScheduledPaymentsProps {
  payments: ScheduledPayment[];
  onUpdate?: () => void;
  onDelete?: (id: string) => void;
}

export function ScheduledPayments({ payments, onUpdate, onDelete }: ScheduledPaymentsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleMarkAsPaid = async (id: string) => {
    setLoading(id);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch('/api/finances/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'pago',
          payment_date: today,
        }),
      });

      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
    } finally {
      setLoading(null);
    }
  };

  if (payments.length === 0) {
    return (
      <div className="card text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum pagamento pendente!</p>
      </div>
    );
  }

  const pendingPayments = payments.filter(p => p.status !== 'pago');
  const paidPayments = payments.filter(p => p.status === 'pago');

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = pendingPayments
    .filter(p => p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      {pendingPayments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card border-l-4 border-l-orange-500">
            <p className="text-sm text-gray-600 mb-1">Pagamentos Pendentes</p>
            <p className="text-3xl font-bold text-orange-600">
              R$ {totalPending.toFixed(2)}
            </p>
          </div>

          {overdueAmount > 0 && (
            <div className="card border-l-4 border-l-red-500">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-gray-600">Atrasados</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                R$ {overdueAmount.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagamentos Pendentes */}
      {pendingPayments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Pendentes</h3>
          <div className="space-y-3">
            {pendingPayments.map(payment => {
              const daysUntil = Math.ceil(
                (new Date(payment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isOverdue = daysUntil < 0;
              const isUrgent = daysUntil <= 3 && daysUntil >= 0;

              return (
                <div
                  key={payment.id}
                  className={`card flex items-center justify-between border-l-4 ${
                    isOverdue
                      ? 'border-l-red-500 bg-red-50'
                      : isUrgent
                        ? 'border-l-orange-500 bg-orange-50'
                        : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isOverdue ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600" />
                      )}
                      <p className="font-semibold text-gray-800">{payment.description}</p>
                      {payment.category && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded capitalize">
                          {payment.category}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">
                        {new Date(payment.due_date).toLocaleDateString('pt-BR')}
                      </span>
                      {isOverdue ? (
                        <span className="text-red-600 font-semibold">
                          Atrasado há {Math.abs(daysUntil)} dias
                        </span>
                      ) : isUrgent ? (
                        <span className="text-orange-600 font-semibold">
                          Vence em {daysUntil} dias
                        </span>
                      ) : (
                        <span className="text-gray-600">
                          Vence em {daysUntil} dias
                        </span>
                      )}
                    </div>

                    {payment.notes && (
                      <p className="text-xs text-gray-600 mt-1">{payment.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg text-gray-800">
                      R$ {payment.amount.toFixed(2)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAsPaid(payment.id)}
                        disabled={loading === payment.id}
                        className="p-2 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                        title="Marcar como pago"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </button>

                      {onDelete && (
                        <button
                          onClick={() => onDelete(payment.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition"
                          title="Deletar pagamento"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagamentos Realizados */}
      {paidPayments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✓ Pagamentos Realizados</h3>
          <div className="space-y-3">
            {paidPayments.map(payment => (
              <div
                key={payment.id}
                className="card flex items-center justify-between border-l-4 border-l-gray-300 opacity-75"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="font-semibold text-gray-600">{payment.description}</p>
                  </div>

                  <span className="text-sm text-gray-500">
                    Pago em {payment.payment_date && new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <p className="font-bold text-gray-600">R$ {payment.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
