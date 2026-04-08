'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewServiceAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = searchParams.get('pet_id') || '';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: petId,
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    groomer_name: '',
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
      const response = await fetch('/api/appointments/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/schedule');
      }
    } catch (error) {
      console.error('Erro ao agendar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/schedule" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Agendar Serviço</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Data do Agendamento *</label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário *</label>
              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Serviço *</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
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
              <label className="form-label">Profissional</label>
              <input
                type="text"
                name="groomer_name"
                value={formData.groomer_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Nome do tosador ou profissional"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Observações especiais, preferências, alergias, etc..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Agendando...' : 'Agendar Serviço'}
              </button>
              <Link href="/schedule" className="flex-1">
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
