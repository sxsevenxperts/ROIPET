'use client';

import { useState } from 'react';
import { Reminder } from '@/types';
import { completeReminder, deleteReminder } from '@/lib/reminders';
import { formatDate, daysUntilDate } from '@/lib/calculations';
import { AlertCircle, CheckCircle2, Trash2, Clock } from 'lucide-react';

interface RemindersListProps {
  reminders: Reminder[];
  onUpdate?: () => void;
}

const reminderIcons = {
  grooming: '💇',
  feeding: '🍖',
  vaccination: '💉',
  medical: '🏥',
};

const reminderLabels = {
  grooming: 'Tosa',
  feeding: 'Ração',
  vaccination: 'Vacinação',
  medical: 'Consulta Médica',
};

export function RemindersList({ reminders, onUpdate }: RemindersListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleComplete = async (reminderId: string) => {
    setLoading(reminderId);
    const success = await completeReminder(reminderId);
    if (success && onUpdate) {
      onUpdate();
    }
    setLoading(null);
  };

  const handleDelete = async (reminderId: string) => {
    if (confirm('Tem certeza que deseja deletar este lembrete?')) {
      setLoading(reminderId);
      const success = await deleteReminder(reminderId);
      if (success && onUpdate) {
        onUpdate();
      }
      setLoading(null);
    }
  };

  if (reminders.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">Nenhum lembrete ativo</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => {
        const daysUntil = daysUntilDate(reminder.reminder_date);
        const isUrgent = daysUntil <= 3;
        const isOverdue = daysUntil < 0;

        return (
          <div
            key={reminder.id}
            className={`card flex items-start gap-4 ${
              isUrgent ? 'border-l-4 border-l-red-500 bg-red-50' : 'border-l-4 border-l-blue-500'
            }`}
          >
            <div className="text-3xl flex-shrink-0">
              {reminderIcons[reminder.reminder_type as keyof typeof reminderIcons]}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">{reminder.title}</h4>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {reminderLabels[reminder.reminder_type as keyof typeof reminderLabels]}
                </span>
              </div>

              {reminder.description && (
                <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDate(reminder.reminder_date)}</span>
                {isOverdue ? (
                  <span className="text-red-600 font-semibold">Vencido</span>
                ) : (
                  <span className={isUrgent ? 'text-red-600 font-semibold' : ''}>
                    {daysUntil === 0 ? 'Hoje' : `Em ${daysUntil} dia${daysUntil !== 1 ? 's' : ''}`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleComplete(reminder.id)}
                disabled={loading === reminder.id}
                className="p-2 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                title="Marcar como concluído"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={() => handleDelete(reminder.id)}
                disabled={loading === reminder.id}
                className="p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                title="Deletar lembrete"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
