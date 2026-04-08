import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar veterinários
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('veterinarians')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar veterinários' }, { status: 500 });
  }
}

// POST - Criar veterinário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('veterinarians')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar veterinário' }, { status: 500 });
  }
}
