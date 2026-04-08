import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar lembretes
export async function GET(request: NextRequest) {
  try {
    const petId = request.nextUrl.searchParams.get('pet_id');
    const completed = request.nextUrl.searchParams.get('completed') === 'true';

    let query = supabase.from('reminders').select('*');

    if (petId) {
      query = query.eq('pet_id', petId);
    }

    query = query.eq('is_completed', completed);

    const { data, error } = await query.order('reminder_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar lembretes' }, { status: 500 });
  }
}
