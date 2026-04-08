import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar transações
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    const month = request.nextUrl.searchParams.get('month');

    let query = supabase.from('financial_transactions').select('*');

    if (type) {
      query = query.eq('transaction_type', type);
    }

    if (month) {
      // Filtrar por mês (YYYY-MM)
      const startDate = `${month}-01`;
      const endDate = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0)
        .toISOString()
        .split('T')[0];

      query = query
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);
    }

    const { data, error } = await query.order('transaction_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 });
  }
}

// POST - Criar transação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
  }
}

// DELETE - Deletar transação
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Transação deletada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar transação' }, { status: 500 });
  }
}
