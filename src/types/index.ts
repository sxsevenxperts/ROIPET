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

export interface EmergencyContact {
  id: string;
  name: string;
  contact_type: 'veterinário' | 'urgência' | 'tóxico' | 'outro';
  phone: string;
  secondary_phone?: string;
  email?: string;
  address?: string;
  description?: string;
  available_24h: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  transaction_type: 'receita' | 'despesa';
  category: string;
  description?: string;
  amount: number;
  transaction_date: string;
  pet_id?: string;
  appointment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPayment {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  category?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'atrasado';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyBudget {
  id: string;
  month: string;
  category: string;
  budgeted_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialStats {
  total_revenue: number;
  total_expenses: number;
  net_balance: number;
  pending_payments: number;
  overdue_amount: number;
}

export type PlanType = 'ração' | 'banho' | 'tosa' | 'hidratação' | 'combo' | 'complete+';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial';
export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  plan_type: PlanType;
  monthly_price: number;
  included_services: {
    banho?: number;
    tosa?: number;
    hidratacao?: number;
    racao?: number;
  };
  discount_percentage: number;
  max_rollover: number;
  features: {
    auto_booking?: boolean;
    groomer_preference?: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  pet_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  subscription_date: string;
  next_billing_date: string;
  billing_cycle_day?: number;
  auto_book_enabled: boolean;
  groomer_preference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  month: string;
  banho_used: number;
  tosa_used: number;
  hidratacao_used: number;
  racao_used: number;
  rollover_banho: number;
  rollover_tosa: number;
  rollover_hidratacao: number;
  rollover_racao: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscription_id: string;
  amount: number;
  billing_date: string;
  payment_date?: string;
  status: InvoiceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type HealthAddonType = 'basic' | 'premium' | 'plus';

export interface HealthInsuranceAddon {
  id: string;
  subscription_id: string;
  addon_type: HealthAddonType;
  monthly_price: number;
  status: SubscriptionStatus;
  consultations_per_month: number;
  medication_discount: number;
  exam_coverage_annual: number;
  emergency_coverage: boolean;
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

export interface HealthCoveredConsultation {
  id: string;
  health_addon_id: string;
  consultation_id: string;
  coverage_amount: number;
  payment_date?: string;
  status: 'pending' | 'covered' | 'paid';
  created_at: string;
}

export interface HealthMedicationClaim {
  id: string;
  health_addon_id: string;
  medication_name: string;
  amount: number;
  discount_applied: number;
  claim_date: string;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
  created_at: string;
}
