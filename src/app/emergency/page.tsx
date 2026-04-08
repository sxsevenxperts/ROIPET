'use client';

import { useEffect, useState } from 'react';
import { EmergencyContact } from '@/types';
import { EmergencyContacts } from '@/components/EmergencyContacts';
import Link from 'next/link';
import { Plus, Phone } from 'lucide-react';

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este contato?')) return;

    try {
      const response = await fetch(`/api/emergency-contacts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">🚨 Números de Emergência</h1>
          <Link href="/emergency/new">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Contato
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Acesso Rápido</h2>
          </div>
          <p className="text-sm text-red-800">
            Clique nos telefones para ligar imediatamente dos seus contatos
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum contato de emergência cadastrado</p>
            <Link href="/emergency/new">
              <button className="btn-primary">Cadastrar Primeiro Contato</button>
            </Link>
          </div>
        ) : (
          <EmergencyContacts contacts={contacts} onDelete={deleteContact} />
        )}
      </main>
    </div>
  );
}
