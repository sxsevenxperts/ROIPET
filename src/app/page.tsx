'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('tutors').select('count', { count: 'exact' });
        if (!error) {
          setIsConnected(true);
        }
      } catch (e) {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">ROIPET</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/tutors" className="text-blue-600 hover:text-blue-800">
              Tutores
            </Link>
            <Link href="/pets" className="text-blue-600 hover:text-blue-800">
              Pets
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Bem-vindo ao ROIPET
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de gerenciamento de petshop com cartão vacinal e prontuário médico
          </p>

          {loading ? (
            <p className="text-gray-500">Verificando conexão com banco de dados...</p>
          ) : isConnected ? (
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              ✓ Banco de dados conectado
            </div>
          ) : (
            <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              ✗ Erro ao conectar banco de dados
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <Link href="/dashboard">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg transition cursor-pointer text-center">
                <span className="text-4xl mb-2 block">📋</span>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Dashboard</h3>
                <p className="text-sm text-blue-700">Lembretes e resumo</p>
              </div>
            </Link>

            <Link href="/schedule">
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-lg transition cursor-pointer text-center">
                <span className="text-4xl mb-2 block">📅</span>
                <h3 className="text-lg font-semibold text-purple-900 mb-1">Agenda</h3>
                <p className="text-sm text-purple-700">Serviços e consultas</p>
              </div>
            </Link>

            <Link href="/finances">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-lg transition cursor-pointer text-center">
                <span className="text-4xl mb-2 block">💰</span>
                <h3 className="text-lg font-semibold text-green-900 mb-1">Finanças</h3>
                <p className="text-sm text-green-700">Receita e despesas</p>
              </div>
            </Link>

            <Link href="/emergency">
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg hover:shadow-lg transition cursor-pointer text-center">
                <span className="text-4xl mb-2 block">🚨</span>
                <h3 className="text-lg font-semibold text-red-900 mb-1">Emergência</h3>
                <p className="text-sm text-red-700">Contatos rápidos</p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link href="/tutors/new">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg transition cursor-pointer">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Novo Tutor
                </h3>
                <p className="text-blue-700">Cadastre um novo dono de pet</p>
              </div>
            </Link>

            <Link href="/pets/new">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-lg transition cursor-pointer">
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Novo Pet
                </h3>
                <p className="text-green-700">Registre um novo pet no sistema</p>
              </div>
            </Link>

            <Link href="/pets">
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-lg transition cursor-pointer">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Meus Pets
                </h3>
                <p className="text-purple-700">Visualize todos os pets cadastrados</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
