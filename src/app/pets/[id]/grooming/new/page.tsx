'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewGroomingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: params.id,
    grooming_date: new Date().toISOString().split('T')[0],
    groomer_name: '',
    service_type: '',
    notes: '',
    cost: '',
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
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };

      const response = await fetch('/api/grooming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push(`/pets/${params.id}`);
      }
    } catch (error) {
      console.error('Erro ao registrar tosa:', error);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Registrar Tosa</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Data da Tosa *</label>
              <input
                type="date"
                name="grooming_date"
                value={formData.grooming_date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Serviço</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecione um serviço</option>
                <option value="banho">Banho</option>
                <option value="tosa">Tosa</option>
                <option value="hidratação">Hidratação</option>
                <option value="unhas">Corte de Unhas</option>
                <option value="limpeza_ouvido">Limpeza de Ouvido</option>
                <option value="combo">Combo (Banho + Tosa)</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nome do Tosador</label>
              <input
                type="text"
                name="groomer_name"
                value={formData.groomer_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Nome do profissional"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Observações sobre a tosa, comportamento do pet, etc..."
                rows={4}
              />
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
                placeholder="Ex: 50.00"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Registrando...' : 'Registrar Tosa'}
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
