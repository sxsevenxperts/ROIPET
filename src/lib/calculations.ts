import { GroomingRecord, FeedingRecord, GroomingStats, FeedingStats } from '@/types';

/**
 * Calcula estatísticas de tosa
 */
export function calculateGroomingStats(records: GroomingRecord[]): GroomingStats {
  if (records.length === 0) {
    return {
      average_days_between: 0,
      total_grooming_count: 0,
      average_daily_amount: 0,
    };
  }

  // Ordenar por data (mais recente primeiro)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.grooming_date).getTime() - new Date(a.grooming_date).getTime()
  );

  const lastGroomingDate = new Date(sortedRecords[0].grooming_date);

  // Calcular diferença de dias entre tosas
  const daysBetweenGrooming: number[] = [];
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const current = new Date(sortedRecords[i].grooming_date);
    const previous = new Date(sortedRecords[i + 1].grooming_date);
    const diffTime = current.getTime() - previous.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysBetweenGrooming.push(diffDays);
  }

  const averageDaysBetween =
    daysBetweenGrooming.length > 0
      ? Math.round(daysBetweenGrooming.reduce((a, b) => a + b) / daysBetweenGrooming.length)
      : 0;

  // Calcular próxima data de tosa
  const nextGroomingDate = new Date(lastGroomingDate);
  nextGroomingDate.setDate(nextGroomingDate.getDate() + averageDaysBetween);

  return {
    average_days_between: averageDaysBetween,
    last_grooming_date: lastGroomingDate.toISOString().split('T')[0],
    next_scheduled_date: nextGroomingDate.toISOString().split('T')[0],
    total_grooming_count: records.length,
  };
}

/**
 * Calcula estatísticas de ração
 */
export function calculateFeedingStats(records: FeedingRecord[]): FeedingStats {
  if (records.length === 0) {
    return {
      average_days_between: 0,
      total_feeding_count: 0,
      average_daily_amount: 0,
    };
  }

  // Ordenar por data (mais recente primeiro)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.feed_date).getTime() - new Date(a.feed_date).getTime()
  );

  const lastFeedingDate = new Date(sortedRecords[0].feed_date);

  // Calcular diferença de dias entre compras
  const daysBetweenFeeding: number[] = [];
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const current = new Date(sortedRecords[i].feed_date);
    const previous = new Date(sortedRecords[i + 1].feed_date);
    const diffTime = current.getTime() - previous.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysBetweenFeeding.push(diffDays);
  }

  const averageDaysBetween =
    daysBetweenFeeding.length > 0
      ? Math.round(daysBetweenFeeding.reduce((a, b) => a + b) / daysBetweenFeeding.length)
      : 0;

  // Calcular próxima data de compra
  const nextPurchaseDate = new Date(lastFeedingDate);
  nextPurchaseDate.setDate(nextPurchaseDate.getDate() + averageDaysBetween);

  // Calcular média de quantidade diária
  const totalDailyAmount = sortedRecords.reduce((acc, record) => acc + (record.daily_amount || 0), 0);
  const averageDailyAmount = Math.round(totalDailyAmount / sortedRecords.length);

  return {
    average_days_between: averageDaysBetween,
    last_feeding_date: lastFeedingDate.toISOString().split('T')[0],
    next_purchase_date: nextPurchaseDate.toISOString().split('T')[0],
    total_feeding_count: records.length,
    average_daily_amount: averageDailyAmount,
  };
}

/**
 * Formata data para exibição (dd/mm/yyyy)
 */
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Calcula dias até a próxima data
 */
export function daysUntilDate(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Verifica se lembrete deve ser criado
 */
export function shouldCreateReminder(nextDate: string, daysThreshold: number = 7): boolean {
  const daysUntil = daysUntilDate(nextDate);
  return daysUntil <= daysThreshold && daysUntil >= 0;
}
