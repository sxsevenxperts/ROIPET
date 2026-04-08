import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    return Response.json({ error: 'Erro ao buscar assinaturas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([body])
      .select();

    if (error) throw error;

    // Criar registro de uso para o mês atual
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthString = monthStart.toISOString().split('T')[0];

    await supabase
      .from('subscription_usage')
      .insert([
        {
          subscription_id: data[0].id,
          month: monthString,
        },
      ]);

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    return Response.json({ error: 'Erro ao criar assinatura' }, { status: 500 });
  }
}
