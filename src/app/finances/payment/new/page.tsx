'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    due_date: '',
    category: '',
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
        amount: parseFloat(formData.amount),
        status: 'pendente',
      };

      const response = await fetch('/api/finances/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/finances?tab=payments');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Novo Pagamento</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Descrição do Pagamento *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Aluguel, Fornecedor X, Conta de Água"
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
                <label className="form-label">Data de Vencimento *</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecione uma categoria</option>
                <option value="fornecedor">Fornecedor</option>
                <option value="aluguel">Aluguel</option>
                <option value="utilities">Contas e Utilities</option>
                <option value="salário">Salário</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Informações adicionais sobre o pagamento..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Criando...' : 'Agendar Pagamento'}
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
