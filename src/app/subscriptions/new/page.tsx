'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Pet, SubscriptionPlan } from '@/types';
import Link from 'next/link';

export default function NewSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  const [pets, setPets] = useState<Pet[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: '',
    plan_id: planId || '',
    subscription_date: new Date().toISOString().split('T')[0],
    billing_cycle_day: new Date().getDate(),
    auto_book_enabled: false,
    groomer_preference: '',
    notes: '',
  });

  useEffect(() => {
    fetchPetsAndPlans();
  }, []);

  const fetchPetsAndPlans = async () => {
    try {
      const [petsRes, plansRes] = await Promise.all([
        fetch('/api/pets'),
        fetch('/api/subscriptions/plans'),
      ]);

      const petsData = await petsRes.json();
      const plansData = await plansRes.json();

      setPets(petsData);
      setPlans(plansData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        pet_id: formData.pet_id,
        plan_id: formData.plan_id,
        next_billing_date: formData.subscription_date,
        status: 'active',
      };

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/subscriptions');
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === formData.plan_id);
  const selectedPet = pets.find((p) => p.id === formData.pet_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/subscriptions/plans" className="text-blue-600 hover:text-blue-800">
            ← Voltar aos Planos
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Ativar Assinatura</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Pet */}
            <div className="form-group">
              <label className="form-label">Selecione o Pet *</label>
              <select
                name="pet_id"
                value={formData.pet_id}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Escolha um pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção de Plano */}
            <div className="form-group">
              <label className="form-label">Plano de Assinatura *</label>
              <select
                name="plan_id"
                value={formData.plan_id}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Escolha um plano</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.monthly_price.toFixed(2)}/mês
                  </option>
                ))}
              </select>
            </div>

            {/* Resumo do Plano */}
            {selectedPlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Resumo do Plano:</p>
                <p className="text-gray-800 font-bold mb-2">{selectedPlan.name}</p>
                <div className="text-sm text-gray-700 space-y-1">
                  {selectedPlan.included_services.banho && (
                    <p>• {selectedPlan.included_services.banho} Banho(s) por mês</p>
                  )}
                  {selectedPlan.included_services.tosa && (
                    <p>• {selectedPlan.included_services.tosa} Tosa(s) por mês</p>
                  )}
                  {selectedPlan.included_services.hidratacao && (
                    <p>• {selectedPlan.included_services.hidratacao} Hidratação(ões) por mês</p>
                  )}
                  {selectedPlan.included_services.racao && (
                    <p>• {selectedPlan.included_services.racao} Ração(ões) por mês</p>
                  )}
                  <p className="font-semibold text-blue-600 mt-2">
                    R$ {selectedPlan.monthly_price.toFixed(2)}/mês
                  </p>
                </div>
              </div>
            )}

            {/* Data de Início */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Data de Início *</label>
                <input
                  type="date"
                  name="subscription_date"
                  value={formData.subscription_date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dia de Faturamento *</label>
                <select
                  name="billing_cycle_day"
                  value={formData.billing_cycle_day}
                  onChange={handleChange}
                  className="form-input"
                >
                  {[1, 8, 15, 22, 30].map((day) => (
                    <option key={day} value={day}>
                      Dia {day} do mês
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferências de Tosador */}
            {selectedPlan?.features.groomer_preference && (
              <div className="form-group">
                <label className="form-label">Tosador Favorito (opcional)</label>
                <input
                  type="text"
                  name="groomer_preference"
                  value={formData.groomer_preference}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nome do tosador de preferência"
                />
              </div>
            )}

            {/* Auto-booking */}
            {selectedPlan?.features.auto_booking && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="auto_book_enabled"
                  checked={formData.auto_book_enabled}
                  onChange={handleChange}
                  className="w-4 h-4"
                  id="auto_book"
                />
                <label htmlFor="auto_book" className="text-sm text-gray-700">
                  Agendar automaticamente os serviços no início de cada mês
                </label>
              </div>
            )}

            {/* Notas */}
            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Ativando...' : 'Ativar Assinatura'}
              </button>
              <Link href="/subscriptions/plans" className="flex-1">
                <button type="button" className="btn-secondary w-full">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>

          {/* Informações */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-2">ℹ️ Informações importantes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Você pode pausar ou cancelar sua assinatura a qualquer momento</li>
              <li>Serviços não utilizados transferem para o próximo mês</li>
              <li>O faturamento será realizado automaticamente no dia escolhido</li>
              <li>Você terá acesso ao dashboard de sua assinatura imediatamente após ativação</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
