import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');

    let query = supabase.from('health_insurance_addons').select('*');

    if (subscriptionId) {
      query = query.eq('subscription_id', subscriptionId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar add-ons de saúde:', error);
    return Response.json({ error: 'Erro ao buscar add-ons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('health_insurance_addons')
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar add-on de saúde:', error);
    return Response.json({ error: 'Erro ao criar add-on' }, { status: 500 });
  }
}
