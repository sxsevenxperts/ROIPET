import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('monthly_price', { ascending: true });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    return Response.json({ error: 'Erro ao buscar planos' }, { status: 500 });
  }
}
