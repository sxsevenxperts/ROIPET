import { GroomingStats, FeedingStats } from '@/types';
import { formatDate, daysUntilDate } from '@/lib/calculations';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PetStatsProps {
  groomingStats?: GroomingStats;
  feedingStats?: FeedingStats;
}

export function PetStats({ groomingStats, feedingStats }: PetStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Estatísticas de Tosa */}
      {groomingStats && (
        <div className="card border-l-4 border-l-purple-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Estatísticas de Tosa</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total de tosas</p>
              <p className="text-2xl font-bold text-purple-600">{groomingStats.total_grooming_count}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Média entre tosas</p>
              <p className="text-2xl font-bold text-purple-600">{groomingStats.average_days_between} dias</p>
            </div>

            {groomingStats.last_grooming_date && (
              <div>
                <p className="text-sm text-gray-600">Última tosa</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(groomingStats.last_grooming_date)}
                </p>
              </div>
            )}

            {groomingStats.next_scheduled_date && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Próxima tosa estimada</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(groomingStats.next_scheduled_date)}
                </p>
                {(() => {
                  const daysUntil = daysUntilDate(groomingStats.next_scheduled_date);
                  return (
                    <div className={`flex items-center gap-2 mt-2 ${daysUntil <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                      {daysUntil <= 7 ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {daysUntil > 0
                          ? `${daysUntil} dia${daysUntil > 1 ? 's' : ''}`
                          : 'Vencido'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estatísticas de Ração */}
      {feedingStats && (
        <div className="card border-l-4 border-l-green-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🍖 Estatísticas de Ração</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total de compras</p>
              <p className="text-2xl font-bold text-green-600">{feedingStats.total_feeding_count}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Média entre compras</p>
              <p className="text-2xl font-bold text-green-600">{feedingStats.average_days_between} dias</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Consumo diário médio</p>
              <p className="text-2xl font-bold text-green-600">{feedingStats.average_daily_amount}g</p>
            </div>

            {feedingStats.last_feeding_date && (
              <div>
                <p className="text-sm text-gray-600">Última compra</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(feedingStats.last_feeding_date)}
                </p>
              </div>
            )}

            {feedingStats.next_purchase_date && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Próxima compra estimada</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(feedingStats.next_purchase_date)}
                </p>
                {(() => {
                  const daysUntil = daysUntilDate(feedingStats.next_purchase_date);
                  return (
                    <div className={`flex items-center gap-2 mt-2 ${daysUntil <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                      {daysUntil <= 7 ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {daysUntil > 0
                          ? `${daysUntil} dia${daysUntil > 1 ? 's' : ''}`
                          : 'Vencido'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
