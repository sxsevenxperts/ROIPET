import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createGroomingReminders } from '@/lib/reminders';

// GET - Listar tosas por pet
export async function GET(request: NextRequest) {
  try {
    const petId = request.nextUrl.searchParams.get('pet_id');

    if (!petId) {
      return NextResponse.json({ error: 'pet_id é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grooming_records')
      .select('*')
      .eq('pet_id', petId)
      .order('grooming_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar registros de tosa' }, { status: 500 });
  }
}

// POST - Criar registro de tosa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('grooming_records')
      .insert([body])
      .select();

    if (error) throw error;

    // Criar lembretes automaticamente
    const { data: allGroomings } = await supabase
      .from('grooming_records')
      .select('*')
      .eq('pet_id', body.pet_id);

    if (allGroomings) {
      await createGroomingReminders(body.pet_id, allGroomings);
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar registro de tosa' }, { status: 500 });
  }
}
