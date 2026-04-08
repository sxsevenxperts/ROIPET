import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addonId = searchParams.get('addon_id');
    const status = searchParams.get('status');

    let query = supabase.from('health_medication_claims').select('*');

    if (addonId) {
      query = query.eq('health_addon_id', addonId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('claim_date', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar sinistros:', error);
    return Response.json({ error: 'Erro ao buscar sinistros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Calcular desconto automaticamente baseado no addon
    const { data: addon, error: addonError } = await supabase
      .from('health_insurance_addons')
      .select('medication_discount')
      .eq('id', body.health_addon_id)
      .single();

    if (addonError) throw addonError;

    const discountAmount = (body.amount * addon.medication_discount) / 100;

    const { data, error } = await supabase
      .from('health_medication_claims')
      .insert([
        {
          ...body,
          discount_applied: discountAmount,
          status: 'approved', // Aprovado automaticamente
        },
      ])
      .select();

    if (error) throw error;

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar sinistro:', error);
    return Response.json({ error: 'Erro ao criar sinistro' }, { status: 500 });
  }
}
