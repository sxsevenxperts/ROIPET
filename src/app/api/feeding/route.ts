import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createFeedingReminders } from '@/lib/reminders';

// GET - Listar ração por pet
export async function GET(request: NextRequest) {
  try {
    const petId = request.nextUrl.searchParams.get('pet_id');

    if (!petId) {
      return NextResponse.json({ error: 'pet_id é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('pet_id', petId)
      .order('feed_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar registros de ração' }, { status: 500 });
  }
}

// POST - Criar registro de ração
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('feeding_records')
      .insert([body])
      .select();

    if (error) throw error;

    // Criar lembretes automaticamente
    const { data: allFeedings } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('pet_id', body.pet_id);

    if (allFeedings) {
      await createFeedingReminders(body.pet_id, allFeedings);
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar registro de ração' }, { status: 500 });
  }
}
