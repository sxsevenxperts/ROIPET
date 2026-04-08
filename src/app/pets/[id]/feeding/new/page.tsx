'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewFeedingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: params.id,
    feed_date: new Date().toISOString().split('T')[0],
    feed_brand: '',
    feed_type: 'seca',
    quantity: '',
    daily_amount: '',
    cost: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        daily_amount: formData.daily_amount ? parseFloat(formData.daily_amount) : null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };

      const response = await fetch('/api/feeding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push(`/pets/${params.id}`);
      }
    } catch (error) {
      console.error('Erro ao registrar ração:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href={`/pets/${params.id}`} className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Registrar Ração</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Data da Compra *</label>
              <input
                type="date"
                name="feed_date"
                value={formData.feed_date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Marca da Ração *</label>
              <input
                type="text"
                name="feed_brand"
                value={formData.feed_brand}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Royal Canin, Pedigree, etc"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Ração</label>
              <select
                name="feed_type"
                value={formData.feed_type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="seca">Ração Seca</option>
                <option value="umida">Ração Úmida</option>
                <option value="natural">Alimentação Natural</option>
                <option value="premium">Premium</option>
                <option value="super_premium">Super Premium</option>
                <option value="outra">Outra</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Quantidade (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: 15.5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consumo Diário (g)</label>
                <input
                  type="number"
                  step="1"
                  name="daily_amount"
                  value={formData.daily_amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: 300"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: 150.00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Observações sobre a ração, aceitação do pet, etc..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Registrando...' : 'Registrar Ração'}
              </button>
              <Link href={`/pets/${params.id}`} className="flex-1">
                <button type="button" className="btn-secondary w-full">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
