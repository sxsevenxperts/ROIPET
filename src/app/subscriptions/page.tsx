'use client';

import { useEffect, useState } from 'react';
import { Subscription, Pet } from '@/types';
import Link from 'next/link';
import { Plus, Pause, Play, Trash2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<(Subscription & { pet?: Pet })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSubscriptions(
          subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: newStatus as any } : sub
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta assinatura?')) return;

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar assinatura:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      trial: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativo',
      paused: 'Pausado',
      cancelled: 'Cancelado',
      trial: 'Teste',
    };
    return labels[status] || status;
  };

  const getPetEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      cão: '🐕',
      gato: '🐱',
      ave: '🐦',
      roedor: '🐹',
      réptil: '🦎',
      outro: '🐾',
    };
    return emojis[type] || '🐾';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando assinaturas...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">📋 Assinaturas</h1>
          <Link href="/subscriptions/plans">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Assinatura
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Nenhuma assinatura ativa</p>
            <Link href="/subscriptions/plans">
              <button className="btn-primary">
                Ver Planos de Assinatura
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total de Assinaturas</p>
                <p className="text-3xl font-bold text-green-600">{subscriptions.length}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Assinaturas Ativas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {subscriptions.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Pausadas</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {subscriptions.filter((s) => s.status === 'paused').length}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-3xl font-bold text-red-600">
                  {subscriptions.filter((s) => s.status === 'cancelled').length}
                </p>
              </div>
            </div>

            {/* Lista de Assinaturas */}
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {subscription.plan?.plan_type === 'ração'
                          ? '🍖'
                          : subscription.plan?.plan_type === 'banho'
                          ? '🛁'
                          : subscription.plan?.plan_type === 'tosa'
                          ? '✂️'
                          : subscription.plan?.plan_type === 'hidratação'
                          ? '💧'
                          : subscription.plan?.plan_type === 'combo'
                          ? '⭐'
                          : '👑'}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {subscription.plan?.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                            {getStatusLabel(subscription.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {getPetEmoji(subscription.pet?.type || 'outro')} {subscription.plan?.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        R$ {subscription.plan?.monthly_price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">/mês</p>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Próximo Faturamento</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(subscription.next_billing_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dia de Faturamento</p>
                      <p className="font-semibold text-gray-800">
                        Dia {subscription.billing_cycle_day} do mês
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Desde</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(subscription.subscription_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Link href={`/subscriptions/${subscription.id}`} className="flex-1">
                      <button className="w-full btn-secondary">Ver Detalhes</button>
                    </Link>
                    {subscription.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(subscription.id, 'paused')}
                        disabled={updating === subscription.id}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Pausar
                      </button>
                    ) : subscription.status === 'paused' ? (
                      <button
                        onClick={() => handleStatusChange(subscription.id, 'active')}
                        disabled={updating === subscription.id}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Retomar
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(subscription.id)}
                      className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
