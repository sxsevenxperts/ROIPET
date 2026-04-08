'use client';

import { useEffect, useState } from 'react';
import { Pet, Tutor, GroomingRecord, FeedingRecord, Reminder } from '@/types';
import { calculateGroomingStats, calculateFeedingStats } from '@/lib/calculations';
import { PetStats } from '@/components/PetStats';
import { RemindersList } from '@/components/RemindersList';
import Link from 'next/link';
import { Plus, Edit2 } from 'lucide-react';

export default function PetDetailPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [groomingRecords, setGroomingRecords] = useState<GroomingRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'grooming' | 'feeding' | 'reminders'>('overview');

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [petRes, groomingRes, feedingRes, remindersRes] = await Promise.all([
        fetch(`/api/pets/${params.id}`),
        fetch(`/api/grooming?pet_id=${params.id}`),
        fetch(`/api/feeding?pet_id=${params.id}`),
        fetch(`/api/reminders?pet_id=${params.id}&completed=false`),
      ]);

      const petData = await petRes.json();
      setPet(petData);

      // Buscar tutor
      const tutorRes = await fetch(`/api/tutors/${petData.tutor_id}`);
      const tutorData = await tutorRes.json();
      setTutor(tutorData);

      setGroomingRecords(await groomingRes.json());
      setFeedingRecords(await feedingRes.json());
      setReminders(await remindersRes.json());
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const groomingStats = calculateGroomingStats(groomingRecords);
  const feedingStats = calculateFeedingStats(feedingRecords);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/pets" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {pet.name}
            {pet.type === 'cão' && '🐕'}
            {pet.type === 'gato' && '🐱'}
            {pet.type === 'ave' && '🦜'}
            {pet.type === 'roedor' && '🐹'}
            {pet.type === 'réptil' && '🦎'}
          </h1>
          <Link href={`/pets/${pet.id}/edit`}>
            <button className="btn-primary flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info do Pet */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Pet</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold text-gray-800 capitalize">{pet.type}</p>
                </div>
                {pet.breed && (
                  <div>
                    <p className="text-sm text-gray-600">Raça</p>
                    <p className="font-semibold text-gray-800">{pet.breed}</p>
                  </div>
                )}
                {pet.birth_date && (
                  <div>
                    <p className="text-sm text-gray-600">Data de Nascimento</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(pet.birth_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {pet.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Peso</p>
                    <p className="font-semibold text-gray-800">{pet.weight}kg</p>
                  </div>
                )}
                {pet.color && (
                  <div>
                    <p className="text-sm text-gray-600">Cor</p>
                    <p className="font-semibold text-gray-800">{pet.color}</p>
                  </div>
                )}
              </div>
            </div>

            {tutor && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tutor</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-semibold text-gray-800">{tutor.name}</p>
                  </div>
                  {tutor.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-semibold text-gray-800">{tutor.phone}</p>
                    </div>
                  )}
                  {tutor.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{tutor.email}</p>
                    </div>
                  )}
                  {tutor.address && (
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-semibold text-gray-800">{tutor.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {(['overview', 'grooming', 'feeding', 'reminders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'grooming' && 'Tosa'}
              {tab === 'feeding' && 'Ração'}
              {tab === 'reminders' && 'Lembretes'}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <PetStats groomingStats={groomingStats} feedingStats={feedingStats} />
        )}

        {/* Tosa */}
        {activeTab === 'grooming' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Registros de Tosa</h2>
              <Link href={`/pets/${pet.id}/grooming/new`}>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Tosa
                </button>
              </Link>
            </div>

            {groomingRecords.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500">Nenhum registro de tosa</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groomingRecords.map(record => (
                  <div key={record.id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">
                          {new Date(record.grooming_date).toLocaleDateString('pt-BR')}
                        </p>
                        {record.service_type && (
                          <p className="font-semibold text-gray-800 capitalize">{record.service_type}</p>
                        )}
                        {record.groomer_name && (
                          <p className="text-sm text-gray-600">Tosador: {record.groomer_name}</p>
                        )}
                        {record.notes && (
                          <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                        )}
                      </div>
                      {record.cost && (
                        <p className="font-semibold text-gray-800">R$ {record.cost.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ração */}
        {activeTab === 'feeding' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Registros de Ração</h2>
              <Link href={`/pets/${pet.id}/feeding/new`}>
                <button className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Ração
                </button>
              </Link>
            </div>

            {feedingRecords.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500">Nenhum registro de ração</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedingRecords.map(record => (
                  <div key={record.id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {new Date(record.feed_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="font-semibold text-gray-800">{record.feed_brand}</p>
                        {record.feed_type && (
                          <p className="text-sm text-gray-600 capitalize">{record.feed_type}</p>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          {record.quantity && (
                            <p className="text-gray-600">Quantidade: {record.quantity}kg</p>
                          )}
                          {record.daily_amount && (
                            <p className="text-gray-600">Diário: {record.daily_amount}g</p>
                          )}
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                        )}
                      </div>
                      {record.cost && (
                        <p className="font-semibold text-gray-800 ml-4">R$ {record.cost.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lembretes */}
        {activeTab === 'reminders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lembretes</h2>
            <RemindersList reminders={reminders} onUpdate={fetchData} />
          </div>
        )}
      </main>
    </div>
  );
}
