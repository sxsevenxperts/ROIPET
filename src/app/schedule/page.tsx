'use client';

import { useEffect, useState } from 'react';
import { Pet, Tutor, ServiceAppointment, ConsultationAppointment } from '@/types';
import { AppointmentsList } from '@/components/AppointmentsList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function SchedulePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [serviceAppointments, setServiceAppointments] = useState<ServiceAppointment[]>([]);
  const [consultationAppointments, setConsultationAppointments] = useState<ConsultationAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'service' | 'consultation'>('service');

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchAppointments();
    }
  }, [selectedPet]);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      const data = await response.json();
      setPets(data);
      if (data.length > 0) {
        setSelectedPet(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const [serviceRes, consultationRes] = await Promise.all([
        fetch(`/api/appointments/service?pet_id=${selectedPet}`),
        fetch(`/api/appointments/consultation?pet_id=${selectedPet}`),
      ]);

      setServiceAppointments(await serviceRes.json());
      setConsultationAppointments(await consultationRes.json());
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Home
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum pet cadastrado</p>
            <Link href="/pets/new">
              <button className="btn-primary">Cadastrar Pet</button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const selectedPetData = pets.find(p => p.id === selectedPet);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">📅 Agenda</h1>
          <div />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Seletor de Pet */}
        <div className="card mb-8">
          <label className="form-label">Selecione o Pet</label>
          <select
            value={selectedPet}
            onChange={e => setSelectedPet(e.target.value)}
            className="form-input"
          >
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {(['service', 'consultation'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'service' && '💇 Serviços'}
              {tab === 'consultation' && '🏥 Consultas'}
            </button>
          ))}
        </div>

        {/* Serviços */}
        {activeTab === 'service' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Agendamentos de Serviço</h2>
              <Link href={`/schedule/service/new?pet_id=${selectedPet}`}>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agendar Serviço
                </button>
              </Link>
            </div>
            <AppointmentsList
              appointments={serviceAppointments}
              type="service"
              onUpdate={fetchAppointments}
            />
          </div>
        )}

        {/* Consultas */}
        {activeTab === 'consultation' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Agendamentos de Consulta</h2>
              <Link href={`/schedule/consultation/new?pet_id=${selectedPet}`}>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agendar Consulta
                </button>
              </Link>
            </div>
            <AppointmentsList
              appointments={consultationAppointments}
              type="consultation"
              onUpdate={fetchAppointments}
            />
          </div>
        )}
      </main>
    </div>
  );
}
