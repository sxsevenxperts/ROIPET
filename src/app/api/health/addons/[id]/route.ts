import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('health_insurance_addons')
      .select(`
        *,
        health_covered_consultations(*),
        health_medication_claims(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Erro ao buscar add-on de saúde:', error);
    return Response.json({ error: 'Add-on não encontrado' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('health_insurance_addons')
      .update(body)
      .eq('id', params.id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    console.error('Erro ao atualizar add-on de saúde:', error);
    return Response.json({ error: 'Erro ao atualizar add-on' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('health_insurance_addons')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return Response.json({ message: 'Add-on de saúde deletado' });
  } catch (error) {
    console.error('Erro ao deletar add-on de saúde:', error);
    return Response.json({ error: 'Erro ao deletar add-on' }, { status: 500 });
  }
}
