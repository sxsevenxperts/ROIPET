import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar pets
export async function GET(request: NextRequest) {
  try {
    const tutorId = request.nextUrl.searchParams.get('tutor_id');

    let query = supabase.from('pets').select('*');

    if (tutorId) {
      query = query.eq('tutor_id', tutorId);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pets' }, { status: 500 });
  }
}

// POST - Criar pet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('pets')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar pet' }, { status: 500 });
  }
}
