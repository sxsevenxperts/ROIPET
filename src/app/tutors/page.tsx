'use client';

import { useEffect, useState } from 'react';
import { Tutor } from '@/types';
import Link from 'next/link';
import { Edit2, Trash2, Plus, Phone, Mail } from 'lucide-react';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/tutors');
      const data = await response.json();
      setTutors(data);
    } catch (error) {
      console.error('Erro ao buscar tutores:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTutor = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este tutor?')) return;

    try {
      const response = await fetch(`/api/tutors/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTutors(tutors.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar tutor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando tutores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Tutores</h1>
          <Link href="/tutors/new">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Tutor
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {tutors.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum tutor cadastrado</p>
            <Link href="/tutors/new">
              <button className="btn-primary">Cadastrar Primeiro Tutor</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{tutor.name}</h3>
                  <div className="flex gap-2">
                    <Link href={`/tutors/${tutor.id}/edit`}>
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteTutor(tutor.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {tutor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {tutor.phone}
                    </div>
                  )}
                  {tutor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {tutor.email}
                    </div>
                  )}
                  {tutor.address && <p>{tutor.address}</p>}
                  {tutor.city && (
                    <p>
                      {tutor.city}
                      {tutor.state && `, ${tutor.state}`}
                    </p>
                  )}
                </div>

                <Link href={`/tutors/${tutor.id}`}>
                  <button className="mt-4 w-full btn-secondary">Ver Detalhes</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
