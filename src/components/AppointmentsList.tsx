'use client';

import { ServiceAppointment, ConsultationAppointment } from '@/types';
import { Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

interface AppointmentsListProps {
  appointments: (ServiceAppointment | ConsultationAppointment)[];
  type: 'service' | 'consultation';
  onUpdate?: () => void;
}

export function AppointmentsList({ appointments, type, onUpdate }: AppointmentsListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    setLoading(id);
    try {
      const endpoint = type === 'service' ? 'service' : 'consultation';
      const response = await fetch(`/api/appointments/${endpoint}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    setLoading(id);
    try {
      const endpoint = type === 'service' ? 'service' : 'consultation';
      const response = await fetch(`/api/appointments/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'concluído',
        }),
      });

      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao marcar como concluído:', error);
    } finally {
      setLoading(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">Nenhum agendamento</p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    a => a.status !== 'cancelado' && new Date(`${a.appointment_date}T${a.appointment_time}`) >= new Date()
  );

  const pastAppointments = appointments.filter(
    a => a.status === 'concluído' || new Date(`${a.appointment_date}T${a.appointment_time}`) < new Date()
  );

  return (
    <div className="space-y-6">
      {upcomingAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Próximos Agendamentos</h3>
          <div className="space-y-3">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="card border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-800">
                        {new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        às {appointment.appointment_time}
                      </span>
                    </div>

                    {type === 'service' && 'service_type' in appointment && (
                      <>
                        <p className="text-sm text-gray-600 capitalize">
                          Serviço: {appointment.service_type}
                        </p>
                        {appointment.groomer_name && (
                          <p className="text-sm text-gray-600">Profissional: {appointment.groomer_name}</p>
                        )}
                      </>
                    )}

                    {type === 'consultation' && 'reason' in appointment && (
                      <>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600">Motivo: {appointment.reason}</p>
                        )}
                      </>
                    )}

                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleComplete(appointment.id)}
                      disabled={loading === appointment.id}
                      className="p-2 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                      title="Marcar como concluído"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      disabled={loading === appointment.id}
                      className="p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                      title="Cancelar agendamento"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✓ Agendamentos Anteriores</h3>
          <div className="space-y-3">
            {pastAppointments.map(appointment => (
              <div key={appointment.id} className="card border-l-4 border-l-gray-300 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-600">
                        {new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        às {appointment.appointment_time}
                      </span>
                    </div>

                    {type === 'service' && 'service_type' in appointment && (
                      <p className="text-sm text-gray-500 capitalize">
                        {appointment.service_type}
                      </p>
                    )}

                    {type === 'consultation' && 'reason' in appointment && (
                      <>
                        {appointment.reason && (
                          <p className="text-sm text-gray-500">{appointment.reason}</p>
                        )}
                      </>
                    )}
                  </div>

                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded capitalize">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
