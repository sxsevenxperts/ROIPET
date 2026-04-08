export type PetType = 'cão' | 'gato' | 'ave' | 'roedor' | 'réptil' | 'outro';
export type PetSize = 'pequeno' | 'médio' | 'grande';

export interface Tutor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  tutor_id: string;
  name: string;
  type: PetType;
  breed?: string;
  birth_date?: string;
  weight?: number;
  size?: PetSize;
  color?: string;
  photo_url?: string;
  microchip?: string;
  created_at: string;
  updated_at: string;
}

export interface Veterinarian {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  crmv?: string;
  specialty?: string;
  created_at: string;
  updated_at: string;
}

export interface VaccinationCard {
  id: string;
  pet_id: string;
  vaccine_name: string;
  vaccine_date: string;
  next_dose_date?: string;
  veterinarian_id?: string;
  batch_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  days: number;
}

export interface MedicalRecord {
  id: string;
  pet_id: string;
  visit_date: string;
  veterinarian_id?: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: Medication[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  medical_record_id?: string;
  pet_id: string;
  file_name: string;
  file_url: string;
  file_type: 'exam' | 'document' | 'photo';
  created_at: string;
}

export interface GroomingRecord {
  id: string;
  pet_id: string;
  grooming_date: string;
  groomer_name?: string;
  service_type?: string; // banho, tosa, unhas, etc
  notes?: string;
  next_grooming_date?: string;
  cost?: number;
  created_at: string;
  updated_at: string;
}

export interface FeedingRecord {
  id: string;
  pet_id: string;
  feed_date: string;
  feed_brand: string;
  feed_type?: string; // ração seca, úmida, natural, etc
  quantity?: number; // kg
  daily_amount?: number; // gramas
  cost?: number;
  notes?: string;
  next_purchase_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  pet_id: string;
  reminder_type: 'vaccination' | 'grooming' | 'feeding' | 'medical';
  reminder_date: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroomingStats {
  average_days_between: number;
  last_grooming_date?: string;
  next_scheduled_date?: string;
  total_grooming_count: number;
}

export interface FeedingStats {
  average_days_between: number;
  last_feeding_date?: string;
  next_purchase_date?: string;
  total_feeding_count: number;
  average_daily_amount: number;
}

export interface ServiceAppointment {
  id: string;
  pet_id: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  groomer_name?: string;
  notes?: string;
  status: 'agendado' | 'concluído' | 'cancelado';
  created_at: string;
  updated_at: string;
}

export interface ConsultationAppointment {
  id: string;
  pet_id: string;
  veterinarian_id?: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  notes?: string;
  status: 'agendado' | 'concluído' | 'cancelado';
  cost?: number;
  created_at: string;
  updated_at: string;
}
