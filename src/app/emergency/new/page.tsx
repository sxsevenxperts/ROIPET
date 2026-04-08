'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewEmergencyContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_type: 'veterinário',
    phone: '',
    secondary_phone: '',
    email: '',
    address: '',
    description: '',
    available_24h: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/emergency');
      }
    } catch (error) {
      console.error('Erro ao criar contato:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/emergency" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Novo Contato de Emergência</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Nome do Contato *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Clínica Veterinária Pet Care"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Contato *</label>
              <select
                name="contact_type"
                value={formData.contact_type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="veterinário">Veterinário</option>
                <option value="urgência">Urgência 24h</option>
                <option value="tóxico">Centro de Tóxico</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Telefone Principal *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone Secundário</label>
                <input
                  type="tel"
                  name="secondary_phone"
                  value={formData.secondary_phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="(11) 88888-8888"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="contato@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Rua, número, cidade"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição/Observações</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available_24h"
                checked={formData.available_24h}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700">
                Disponível 24 horas?
              </label>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Criando...' : 'Criar Contato'}
              </button>
              <Link href="/emergency" className="flex-1">
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
