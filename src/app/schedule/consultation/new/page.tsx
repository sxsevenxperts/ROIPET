'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Veterinarian } from '@/types';
import Link from 'next/link';

export default function NewConsultationAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = searchParams.get('pet_id') || '';
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: petId,
    veterinarian_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    notes: '',
    cost: '',
  });

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      // Note: você precisará criar essa API route
      const response = await fetch('/api/veterinarians');
      const data = await response.json();
      setVeterinarians(data);
    } catch (error) {
      console.error('Erro ao buscar veterinários:', error);
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
        veterinarian_id: formData.veterinarian_id || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };

      const response = await fetch('/api/appointments/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/schedule');
      }
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Agendar Consulta Veterinária</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Data da Consulta *</label>
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
              <label className="form-label">Veterinário</label>
              <select
                name="veterinarian_id"
                value={formData.veterinarian_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecione um veterinário</option>
                {veterinarians.map(vet => (
                  <option key={vet.id} value={vet.id}>
                    {vet.name}
                    {vet.specialty && ` - ${vet.specialty}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Motivo da Consulta</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: Vacinação, Checkup, Problema de saúde"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                placeholder="Observações importantes para o veterinário..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custo da Consulta (R$)</label>
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

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Agendando...' : 'Agendar Consulta'}
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
