'use client';

import { useEffect, useState } from 'react';
import { Reminder, Pet, Tutor } from '@/types';
import { RemindersList } from '@/components/RemindersList';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [petsMap, setPetsMap] = useState<Record<string, Pet>>({});
  const [tutorsMap, setTutorsMap] = useState<Record<string, Tutor>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [remindersRes, petsRes, tutorsRes] = await Promise.all([
        fetch('/api/reminders?completed=false'),
        fetch('/api/pets'),
        fetch('/api/tutors'),
      ]);

      const remindersData = await remindersRes.json();
      const petsData = await petsRes.json();
      const tutorsData = await tutorsRes.json();

      setReminders(remindersData);

      const petMap: Record<string, Pet> = {};
      petsData.forEach((pet: Pet) => {
        petMap[pet.id] = pet;
      });
      setPetsMap(petMap);

      const tutorMap: Record<string, Tutor> = {};
      tutorsData.forEach((tutor: Tutor) => {
        tutorMap[tutor.id] = tutor;
      });
      setTutorsMap(tutorMap);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const urgentCount = reminders.filter(r => {
    const daysUntil = Math.ceil(
      (new Date(r.reminder_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 3 && daysUntil >= 0;
  }).length;

  const overdueCount = reminders.filter(r => {
    const daysUntil = Math.ceil(
      (new Date(r.reminder_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil < 0;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="text-sm text-gray-600">
            {reminders.length} lembrete{reminders.length !== 1 ? 's' : ''}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-600 mb-2">Total de Lembretes</p>
            <p className="text-3xl font-bold text-blue-600">{reminders.length}</p>
          </div>

          {overdueCount > 0 && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-red-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-gray-600">Vencidos</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
            </div>
          )}

          {urgentCount > 0 && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-orange-500">
              <p className="text-sm text-gray-600 mb-2">Próximos 3 dias</p>
              <p className="text-3xl font-bold text-orange-600">{urgentCount}</p>
            </div>
          )}
        </div>

        {/* Lembretes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Lembretes</h2>

          {reminders.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum lembrete ativo!</p>
              <p className="text-sm text-gray-400">Continue registrando dados dos seus pets</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => {
                const pet = petsMap[reminder.pet_id];
                const tutor = pet ? tutorsMap[pet.tutor_id] : null;

                return (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
                        {pet && tutor && (
                          <p className="text-sm text-gray-600">
                            {pet.name} - {tutor.name}
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded capitalize">
                        {reminder.reminder_type}
                      </span>
                    </div>

                    {reminder.description && (
                      <p className="text-sm text-gray-600 mb-3">{reminder.description}</p>
                    )}

                    <p className="text-xs text-gray-500">
                      Data: {new Date(reminder.reminder_date).toLocaleDateString('pt-BR')}
                    </p>

                    {pet && (
                      <Link href={`/pets/${pet.id}`}>
                        <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold">
                          Ver pet →
                        </button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Link href="/pets">
            <div className="card text-center p-6 hover:shadow-lg transition cursor-pointer">
              <span className="text-4xl mb-2">🐾</span>
              <h3 className="font-semibold text-gray-800">Meus Pets</h3>
              <p className="text-sm text-gray-600">Gerenciar pets</p>
            </div>
          </Link>

          <Link href="/tutors">
            <div className="card text-center p-6 hover:shadow-lg transition cursor-pointer">
              <span className="text-4xl mb-2">👥</span>
              <h3 className="font-semibold text-gray-800">Tutores</h3>
              <p className="text-sm text-gray-600">Gerenciar tutores</p>
            </div>
          </Link>

          <Link href="/">
            <div className="card text-center p-6 hover:shadow-lg transition cursor-pointer">
              <span className="text-4xl mb-2">🏠</span>
              <h3 className="font-semibold text-gray-800">Home</h3>
              <p className="text-sm text-gray-600">Voltar ao início</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
