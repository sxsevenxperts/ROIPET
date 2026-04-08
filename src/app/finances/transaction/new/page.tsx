'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Pet } from '@/types';
import Link from 'next/link';

export default function NewTransactionPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transaction_type: 'receita',
    category: 'serviço',
    description: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    pet_id: '',
    notes: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

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
        amount: parseFloat(formData.amount),
        pet_id: formData.pet_id || null,
      };

      const response = await fetch('/api/finances/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/finances');
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/finances" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Nova Transação</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Tipo *</label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Categoria *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="serviço">Serviço</option>
                  <option value="ração">Ração</option>
                  <option value="medicamento">Medicamento</option>
                  <option value="consulta">Consulta</option>
                  <option value="utilities">Utilidades</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Tosa do Fluffy, Ração Royal Canin"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data *</label>
                <input
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pet (opcional)</label>
              <select
                name="pet_id"
                value={formData.pet_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecione um pet</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Anotações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Salvando...' : 'Registrar Transação'}
              </button>
              <Link href="/finances" className="flex-1">
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
