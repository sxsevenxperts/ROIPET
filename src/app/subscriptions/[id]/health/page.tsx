'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HealthInsuranceAddon, HealthMedicationClaim } from '@/types';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';

export default function HealthAddonPage() {
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.id as string;

  const [addon, setAddon] = useState<HealthInsuranceAddon | null>(null);
  const [claims, setClaims] = useState<HealthMedicationClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: '',
    amount: '',
  });

  useEffect(() => {
    fetchData();
  }, [subscriptionId]);

  const fetchData = async () => {
    try {
      const [addonRes, claimsRes] = await Promise.all([
        fetch(`/api/health/addons?subscription_id=${subscriptionId}`),
        fetch(`/api/health/claims?addon_id=${subscriptionId}`),
      ]);

      const addonData = await addonRes.json();
      const claimsData = await claimsRes.json();

      if (addonData.length > 0) {
        setAddon(addonData[0]);
      }
      setClaims(claimsData);
    } catch (error) {
      console.error('Erro ao buscar dados de saúde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addon) return;

    try {
      const response = await fetch('/api/health/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          health_addon_id: addon.id,
          medication_name: formData.medication_name,
          amount: parseFloat(formData.amount),
          claim_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const newClaim = await response.json();
        setClaims([newClaim, ...claims]);
        setFormData({ medication_name: '', amount: '' });
        setShowClaimForm(false);
      }
    } catch (error) {
      console.error('Erro ao criar sinistro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!addon) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href={`/subscriptions/${subscriptionId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Voltar
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              Esta assinatura não possui cobertura de saúde ativa.
            </p>
            <button className="btn-primary">Adicionar Cobertura de Saúde</button>
          </div>
        </div>
      </div>
    );
  }

  const getAddonLabel = (type: string) => {
    const labels: Record<string, { name: string; icon: string }> = {
      basic: { name: 'Saúde Básica', icon: '🏥' },
      premium: { name: 'Saúde Premium', icon: '⭐' },
      plus: { name: 'Saúde Plus', icon: '👑' },
    };
    return labels[type] || { name: 'Saúde', icon: '🏥' };
  };

  const addonInfo = getAddonLabel(addon.addon_type);
  const totalClaimsValue = claims.reduce((sum, claim) => sum + claim.discount_applied, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/subscriptions/${subscriptionId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Voltar para Assinatura
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Informações do Add-on */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                {addonInfo.icon} {addonInfo.name}
              </h1>
              <p className="text-gray-600">
                Cobertura de saúde para seu pet com benefícios completos
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-800">
                R$ {addon.monthly_price.toFixed(2)}
              </p>
              <p className="text-gray-500">/mês</p>
            </div>
          </div>

          {/* Status e Próxima Renovação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize text-gray-800">{addon.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Próxima Renovação</p>
              <p className="font-semibold text-gray-800">
                {new Date(addon.next_billing_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Você Economizou</p>
              <p className="font-semibold text-green-600">R$ {totalClaimsValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seus Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addon.consultations_per_month > 0 && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="font-semibold text-gray-800">Consultas Veterinárias</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {addon.consultations_per_month}/mês
                </p>
              </div>
            )}

            {addon.medication_discount > 0 && (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <p className="font-semibold text-gray-800">Desconto em Medicamentos</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {addon.medication_discount}%
                </p>
              </div>
            )}

            {addon.exam_coverage_annual > 0 && (
              <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                <p className="font-semibold text-gray-800">Exames Anuais</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {addon.exam_coverage_annual}
                </p>
              </div>
            )}

            {addon.emergency_coverage && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-800">Cobertura de Emergência</p>
                <p className="text-2xl font-bold text-red-600 mt-1">24h</p>
              </div>
            )}
          </div>
        </div>

        {/* Sinistros de Medicamentos */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Medicamentos Cobertos
            </h2>
            <button
              onClick={() => setShowClaimForm(!showClaimForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Registrar Medicamento
            </button>
          </div>

          {/* Formulário de Novo Sinistro */}
          {showClaimForm && (
            <form onSubmit={handleSubmitClaim} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nome do Medicamento *</label>
                  <input
                    type="text"
                    name="medication_name"
                    value={formData.medication_name}
                    onChange={handleClaimChange}
                    required
                    className="form-input"
                    placeholder="Ex: Amoxicilina 500mg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleClaimChange}
                    required
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn-primary flex-1">
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Você receberá {addon.medication_discount}% de desconto neste medicamento.
                </p>
              </div>
            </form>
          )}

          {/* Lista de Medicamentos */}
          {claims.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
              Nenhum medicamento registrado ainda
            </div>
          ) : (
            <div className="space-y-2">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{claim.medication_name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(claim.claim_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      R$ {claim.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      -R$ {claim.discount_applied.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo de Economia */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Seu Resumo de Economia</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total em Medicamentos</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {claims.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Descontos</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalClaimsValue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Você Pagou</p>
              <p className="text-2xl font-bold text-gray-800">
                R${' '}
                {(claims.reduce((sum, c) => sum + c.amount, 0) - totalClaimsValue).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
