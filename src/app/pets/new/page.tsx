'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tutor, PetType, PetSize } from '@/types';
import Link from 'next/link';

const PET_TYPES: PetType[] = ['cão', 'gato', 'ave', 'roedor', 'réptil', 'outro'];
const PET_SIZES: PetSize[] = ['pequeno', 'médio', 'grande'];

export default function NewPetPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tutor_id: '',
    name: '',
    type: 'cão' as PetType,
    breed: '',
    birth_date: '',
    weight: '',
    size: 'médio' as PetSize,
    color: '',
    microchip: '',
  });

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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        router.push('/pets');
      }
    } catch (error) {
      console.error('Erro ao criar pet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/pets" className="text-blue-600 hover:text-blue-800">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Novo Pet</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Tutor *</label>
              <select
                name="tutor_id"
                value={formData.tutor_id}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Selecione um tutor</option>
                {tutors.map(tutor => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nome do pet"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Tipo *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-input"
                >
                  {PET_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Raça</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: Poodle, Siamês"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: 5.5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tamanho</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="form-input"
                >
                  {PET_SIZES.map(size => (
                    <option key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Cor</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ex: Branco, Preto e branco"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Microchip</label>
                <input
                  type="text"
                  name="microchip"
                  value={formData.microchip}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Código do microchip"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Criando...' : 'Criar Pet'}
              </button>
              <Link href="/pets" className="flex-1">
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
