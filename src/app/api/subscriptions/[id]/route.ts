import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(*),
        subscription_usage(*),
        subscription_invoices(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return Response.json({ error: 'Assinatura não encontrada' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('subscriptions')
      .update(body)
      .eq('id', params.id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    return Response.json({ error: 'Erro ao atualizar assinatura' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return Response.json({ message: 'Assinatura deletada' });
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error);
    return Response.json({ error: 'Erro ao deletar assinatura' }, { status: 500 });
  }
}
