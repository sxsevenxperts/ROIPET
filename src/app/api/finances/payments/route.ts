import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar pagamentos
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');

    let query = supabase.from('scheduled_payments').select('*');

    if (status) {
      query = query.eq('status', status);
    } else {
      // Default: mostrar pendentes e atrasados
      query = query.or("status.eq.pendente,status.eq.atrasado");
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 });
  }
}

// POST - Criar pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('scheduled_payments')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
  }
}

// PUT - Marcar como pago
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('scheduled_payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pagamento' }, { status: 500 });
  }
}

// DELETE - Deletar pagamento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('scheduled_payments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Pagamento deletado' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar pagamento' }, { status: 500 });
  }
}
