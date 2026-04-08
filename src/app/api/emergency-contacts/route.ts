import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar contatos de emergência
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('is_active', true)
      .order('contact_type', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar contatos' }, { status: 500 });
  }
}

// POST - Criar contato de emergência
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar contato' }, { status: 500 });
  }
}

// PUT - Atualizar contato
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar contato' }, { status: 500 });
  }
}

// DELETE - Deletar contato
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Contato deletado' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar contato' }, { status: 500 });
  }
}
