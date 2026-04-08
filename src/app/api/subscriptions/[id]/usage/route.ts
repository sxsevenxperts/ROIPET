import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthString = monthStart.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('subscription_usage')
      .select('*')
      .eq('subscription_id', params.id)
      .eq('month', monthString)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Se não existir, criar novo registro
    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('subscription_usage')
        .insert([
          {
            subscription_id: params.id,
            month: monthString,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return Response.json(newData);
    }

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar uso de assinatura:', error);
    return Response.json({ error: 'Erro ao buscar uso' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthString = monthStart.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('subscription_usage')
      .update(body)
      .eq('subscription_id', params.id)
      .eq('month', monthString)
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao atualizar uso:', error);
    return Response.json({ error: 'Erro ao atualizar uso' }, { status: 500 });
  }
}
