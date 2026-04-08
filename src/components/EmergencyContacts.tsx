'use client';

import { EmergencyContact } from '@/types';
import { Phone, Mail, MapPin, Clock, Trash2, Edit2 } from 'lucide-react';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onDelete?: (id: string) => void;
}

const contactTypeIcons = {
  veterinário: '🐾',
  urgência: '🚨',
  tóxico: '☠️',
  outro: '📞',
};

const contactTypeLabels = {
  veterinário: 'Veterinário',
  urgência: 'Urgência 24h',
  tóxico: 'Centro de Tóxico',
  outro: 'Outro',
};

export function EmergencyContacts({ contacts, onDelete }: EmergencyContactsProps) {
  if (contacts.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">Nenhum contato de emergência cadastrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className="card border-l-4 border-l-red-500 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {contactTypeIcons[contact.contact_type as keyof typeof contactTypeIcons]}
              </span>
              <div>
                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                <p className="text-xs text-gray-500">
                  {contactTypeLabels[contact.contact_type as keyof typeof contactTypeLabels]}
                </p>
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(contact.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-red-600" />
              <a href={`tel:${contact.phone}`} className="hover:underline font-semibold">
                {contact.phone}
              </a>
              {contact.available_24h && (
                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  24h
                </span>
              )}
            </div>

            {contact.secondary_phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <a href={`tel:${contact.secondary_phone}`} className="hover:underline">
                  {contact.secondary_phone}
                </a>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
            )}

            {contact.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">{contact.address}</span>
              </div>
            )}

            {contact.description && (
              <p className="text-gray-600 text-xs mt-2 italic">{contact.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
