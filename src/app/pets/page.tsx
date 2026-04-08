'use client';

import { useEffect, useState } from 'react';
import { Pet, Tutor } from '@/types';
import Link from 'next/link';
import { Edit2, Trash2, Plus, Heart } from 'lucide-react';

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [tutorsMap, setTutorsMap] = useState<Record<string, Tutor>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, tutorsRes] = await Promise.all([
        fetch('/api/pets'),
        fetch('/api/tutors'),
      ]);

      const petsData = await petsRes.json();
      const tutorsData = await tutorsRes.json();

      setPets(petsData);

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

  const deletePet = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este pet?')) return;

    try {
      const response = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPets(pets.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando pets...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Pets</h1>
          <Link href="/pets/new">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Pet
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {pets.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum pet cadastrado</p>
            <Link href="/pets/new">
              <button className="btn-primary">Cadastrar Primeiro Pet</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const tutor = tutorsMap[pet.tutor_id];
              return (
                <div key={pet.id} className="card hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">
                        {pet.type === 'cão' && '🐕'}
                        {pet.type === 'gato' && '🐱'}
                        {pet.type === 'ave' && '🦜'}
                        {pet.type === 'roedor' && '🐹'}
                        {pet.type === 'réptil' && '🦎'}
                        {pet.type !== 'cão' && pet.type !== 'gato' && pet.type !== 'ave' && pet.type !== 'roedor' && pet.type !== 'réptil' && '🐾'}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/pets/${pet.id}/edit`}>
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                      </Link>
                      <button
                        onClick={() => deletePet(pet.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <span className="font-semibold capitalize">{pet.type}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex justify-between">
                        <span>Peso:</span>
                        <span className="font-semibold">{pet.weight}kg</span>
                      </div>
                    )}
                    {pet.size && (
                      <div className="flex justify-between">
                        <span>Tamanho:</span>
                        <span className="font-semibold capitalize">{pet.size}</span>
                      </div>
                    )}
                    {pet.color && (
                      <div className="flex justify-between">
                        <span>Cor:</span>
                        <span className="font-semibold">{pet.color}</span>
                      </div>
                    )}
                  </div>

                  {tutor && (
                    <div className="border-t pt-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Tutor</p>
                      <p className="font-semibold text-gray-800">{tutor.name}</p>
                      {tutor.phone && <p className="text-xs text-gray-600">{tutor.phone}</p>}
                    </div>
                  )}

                  <Link href={`/pets/${pet.id}`}>
                    <button className="w-full btn-secondary">Ver Detalhes</button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
