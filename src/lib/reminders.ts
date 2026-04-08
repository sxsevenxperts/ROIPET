import { supabase } from './supabase';
import { GroomingRecord, FeedingRecord, Reminder } from '@/types';
import { calculateGroomingStats, calculateFeedingStats, shouldCreateReminder } from './calculations';

/**
 * Cria lembretes para tosa automaticamente
 */
export async function createGroomingReminders(petId: string, groomingRecords: GroomingRecord[]) {
  const stats = calculateGroomingStats(groomingRecords);

  if (!stats.next_scheduled_date) return;

  // Verificar se já existe lembrete para essa data
  const { data: existingReminders } = await supabase
    .from('reminders')
    .select('id')
    .eq('pet_id', petId)
    .eq('reminder_type', 'grooming')
    .eq('reminder_date', stats.next_scheduled_date)
    .eq('is_completed', false);

  // Se já existe, não criar duplicado
  if (existingReminders && existingReminders.length > 0) {
    return;
  }

  // Verificar se deve criar lembrete (7 dias antes)
  if (shouldCreateReminder(stats.next_scheduled_date, 7)) {
    const { error } = await supabase.from('reminders').insert({
      pet_id: petId,
      reminder_type: 'grooming',
      reminder_date: stats.next_scheduled_date,
      title: `Lembrete de Tosa`,
      description: `Está na hora de agendar a tosa do seu pet. Média entre tosas: ${stats.average_days_between} dias.`,
      is_completed: false,
    });

    if (error) console.error('Erro ao criar lembrete de tosa:', error);
  }
}

/**
 * Cria lembretes para ração automaticamente
 */
export async function createFeedingReminders(petId: string, feedingRecords: FeedingRecord[]) {
  const stats = calculateFeedingStats(feedingRecords);

  if (!stats.next_purchase_date) return;

  // Verificar se já existe lembrete para essa data
  const { data: existingReminders } = await supabase
    .from('reminders')
    .select('id')
    .eq('pet_id', petId)
    .eq('reminder_type', 'feeding')
    .eq('reminder_date', stats.next_purchase_date)
    .eq('is_completed', false);

  // Se já existe, não criar duplicado
  if (existingReminders && existingReminders.length > 0) {
    return;
  }

  // Verificar se deve criar lembrete (7 dias antes)
  if (shouldCreateReminder(stats.next_purchase_date, 7)) {
    const { error } = await supabase.from('reminders').insert({
      pet_id: petId,
      reminder_type: 'feeding',
      reminder_date: stats.next_purchase_date,
      title: `Lembrete de Compra de Ração`,
      description: `Está na hora de comprar ração. Consumo diário médio: ${stats.average_daily_amount}g. Média entre compras: ${stats.average_days_between} dias.`,
      is_completed: false,
    });

    if (error) console.error('Erro ao criar lembrete de ração:', error);
  }
}

/**
 * Busca todos os lembretes ativos de um pet
 */
export async function getPetReminders(petId: string) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('pet_id', petId)
    .eq('is_completed', false)
    .order('reminder_date', { ascending: true });

  if (error) {
    console.error('Erro ao buscar lembretes:', error);
    return [];
  }

  return (data as Reminder[]) || [];
}

/**
 * Marca um lembrete como completo
 */
export async function completeReminder(reminderId: string) {
  const { error } = await supabase
    .from('reminders')
    .update({ is_completed: true })
    .eq('id', reminderId);

  if (error) {
    console.error('Erro ao marcar lembrete como completo:', error);
    return false;
  }

  return true;
}

/**
 * Deleta um lembrete
 */
export async function deleteReminder(reminderId: string) {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);

  if (error) {
    console.error('Erro ao deletar lembrete:', error);
    return false;
  }

  return true;
}
