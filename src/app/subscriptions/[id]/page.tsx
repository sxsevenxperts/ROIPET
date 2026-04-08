'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Subscription, SubscriptionUsage, SubscriptionInvoice } from '@/types';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [subscriptionId]);

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`);
      const data = await response.json();
      setSubscription(data);
      setUsage(data.subscription_usage?.[0] || null);
      setInvoices(data.subscription_invoices || []);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Link href="/subscriptions" className="text-blue-600 hover:text-blue-800">
              ← Voltar
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-500">Assinatura não encontrada</p>
        </div>
      </div>
    );
  }

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      banho: 'Banhos',
      tosa: 'Tosas',
      hidratacao: 'Hidratações',
      racao: 'Rações',
    };
    return labels[service] || service;
  };

  const getRemainingServices = () => {
    if (!subscription.plan || !usage) return null;

    return {
      banho: (subscription.plan.included_services.banho || 0) - usage.banho_used,
      tosa: (subscription.plan.included_services.tosa || 0) - usage.tosa_used,
      hidratacao: (subscription.plan.included_services.hidratacao || 0) - usage.hidratacao_used,
      racao: (subscription.plan.included_services.racao || 0) - usage.racao_used,
    };
  };

  const remaining = getRemainingServices();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/subscriptions" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Informações Principais */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {subscription.plan?.name}
              </h1>
              <p className="text-gray-600">{subscription.plan?.description}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-800">
                R$ {subscription.plan?.monthly_price.toFixed(2)}
              </p>
              <p className="text-gray-500">/mês</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize text-gray-800">{subscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Próximo Faturamento</p>
              <p className="font-semibold text-gray-800">
                {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Desde</p>
              <p className="font-semibold text-gray-800">
                {new Date(subscription.subscription_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dia de Faturamento</p>
              <p className="font-semibold text-gray-800">Dia {subscription.billing_cycle_day}</p>
            </div>
          </div>
        </div>

        {/* Uso Mensal */}
        {remaining && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Uso do Mês Atual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(remaining).map(([service, count]) => {
                const total = subscription.plan?.included_services[service as any] || 0;
                const used = usage ? (usage[`${service}_used` as any] || 0) : 0;
                const percentage = total > 0 ? (used / total) * 100 : 0;

                if (total === 0) return null;

                return (
                  <div key={service} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      {getServiceLabel(service)}
                    </p>
                    <div className="flex items-end gap-2 mb-2">
                      <p className="text-3xl font-bold text-gray-800">{count}</p>
                      <p className="text-gray-500">de {total}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          percentage > 80
                            ? 'bg-red-500'
                            : percentage > 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}% utilizado</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferências */}
        {(subscription.groomer_preference || subscription.auto_book_enabled) && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferências</h2>
            <div className="space-y-4">
              {subscription.groomer_preference && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600">Tosador Favorito</p>
                  <p className="font-semibold text-gray-800">{subscription.groomer_preference}</p>
                </div>
              )}
              {subscription.auto_book_enabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-600">Agendamento Automático</p>
                  <p className="font-semibold text-gray-800">✓ Ativado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Histórico de Faturamento */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Faturamento</h2>
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(invoice.billing_date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{invoice.status}</p>
                  </div>
                  <p className="font-bold text-gray-800">
                    R$ {invoice.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {subscription.notes && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Observações</h2>
            <p className="text-gray-700">{subscription.notes}</p>
          </div>
        )}
      </main>
    </div>
  );
}
