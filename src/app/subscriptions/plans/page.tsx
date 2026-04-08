'use client';

import { useEffect, useState } from 'react';
import { SubscriptionPlan } from '@/types';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscriptions/plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando planos...</p>
      </div>
    );
  }

  const getEmoji = (planType: string) => {
    const emojis: Record<string, string> = {
      ração: '🍖',
      banho: '🛁',
      tosa: '✂️',
      hidratação: '💧',
      combo: '⭐',
      'complete+': '👑',
    };
    return emojis[planType] || '📦';
  };

  const getDescription = (planType: string) => {
    const descriptions: Record<string, string[]> = {
      ração: ['4 entregas mensais', 'Marca de escolha', 'Frete grátis'],
      banho: ['1 banho/mês', 'Tosador favorito', 'Desconto em extras'],
      tosa: ['1 tosa/mês', 'Tosador favorito', 'Desconto em extras'],
      hidratação: ['1 tratamento/mês', 'Produtos premium', 'Desconto em extras'],
      combo: ['1 banho/mês', '1 tosa/mês', '1 hidratação/mês', 'Tosador favorito', 'Melhor custo-benefício'],
      'complete+': ['1 banho/mês', '1 tosa/mês', '1 hidratação/mês', '4 rações/mês', 'Máximo de benefícios'],
    };
    return descriptions[planType] || [];
  };

  const getSavings = (planType: string) => {
    const savings: Record<string, number> = {
      ração: 15,
      banho: 15,
      tosa: 15,
      hidratação: 15,
      combo: 20,
      'complete+': 25,
    };
    return savings[planType] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Planos de Assinatura</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Escolha o Plano Perfeito para Seu Pet
          </h2>
          <p className="text-xl text-gray-600">
            Economize até 25% com assinaturas mensais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.plan_type === 'complete+'
                  ? 'ring-4 ring-yellow-400 lg:col-span-1'
                  : ''
              }`}
            >
              {/* Cabeçalho */}
              <div
                className={`p-6 text-white text-center ${
                  plan.plan_type === 'complete+'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    : 'bg-blue-600'
                }`}
              >
                <div className="text-5xl mb-2">{getEmoji(plan.plan_type)}</div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.plan_type === 'complete+' && (
                  <div className="mt-2 text-yellow-200 font-semibold">✨ MAIS POPULAR</div>
                )}
              </div>

              {/* Preço */}
              <div className="bg-white px-6 py-6 text-center border-b">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  R$ {plan.monthly_price.toFixed(2)}
                </div>
                <div className="text-green-600 font-semibold">
                  Economia de {getSavings(plan.plan_type)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">/mês</div>
              </div>

              {/* Características */}
              <div className="bg-white px-6 py-6">
                <ul className="space-y-3 mb-6">
                  {getDescription(plan.plan_type).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/subscriptions/new?plan=${plan.id}`}>
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      plan.plan_type === 'complete+'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Assinar Agora
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Benefícios Gerais */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Benefícios de Qualquer Assinatura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📅</div>
              <div>
                <p className="font-semibold text-gray-800">Agendamento Automático</p>
                <p className="text-sm text-gray-600">Marque suas consultas com antecedência</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="font-semibold text-gray-800">Economize Até 25%</p>
                <p className="text-sm text-gray-600">Comparado aos preços normais</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔄</div>
              <div>
                <p className="font-semibold text-gray-800">Transferências</p>
                <p className="text-sm text-gray-600">Serviços não usados transferem para o mês</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⏸️</div>
              <div>
                <p className="font-semibold text-gray-800">Pause Quando Quiser</p>
                <p className="text-sm text-gray-600">Sem penalidades ou compromissos</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
