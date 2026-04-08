-- Tabela de Tutores (Donos)
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pets
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- cão, gato, ave, etc
  breed VARCHAR(100),
  birth_date DATE,
  weight DECIMAL(5, 2), -- kg
  size VARCHAR(50), -- pequeno, médio, grande
  color VARCHAR(100),
  photo_url TEXT,
  microchip VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Veterinários
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  crmv VARCHAR(50) UNIQUE, -- Conselho Regional de Medicina Veterinária
  specialty VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Cartão Vacinal
CREATE TABLE vaccination_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_date DATE NOT NULL,
  next_dose_date DATE,
  veterinarian_id UUID REFERENCES veterinarians(id),
  batch_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Prontuário Médico
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES veterinarians(id),
  reason VARCHAR(255),
  diagnosis TEXT,
  treatment TEXT,
  medications JSONB, -- [{name, dosage, frequency, days}]
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Anexos (fotos de exames, documentos)
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID REFERENCES medical_records(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50), -- exam, document, photo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_pets_tutor_id ON pets(tutor_id);
CREATE INDEX idx_vaccination_cards_pet_id ON vaccination_cards(pet_id);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_attachments_medical_record_id ON attachments(medical_record_id);
CREATE INDEX idx_attachments_pet_id ON attachments(pet_id);

-- Tabela de Registro de Tosa
CREATE TABLE grooming_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  grooming_date DATE NOT NULL,
  groomer_name VARCHAR(255),
  service_type VARCHAR(100), -- banho, tosa, unhas, etc
  notes TEXT,
  next_grooming_date DATE,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Registro de Ração
CREATE TABLE feeding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  feed_date DATE NOT NULL,
  feed_brand VARCHAR(255) NOT NULL,
  feed_type VARCHAR(100), -- ração seca, úmida, natural, etc
  quantity DECIMAL(5, 2), -- kg
  daily_amount DECIMAL(5, 2), -- quantidade diária em gramas
  cost DECIMAL(10, 2),
  notes TEXT,
  next_purchase_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lembretes
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL, -- vaccination, grooming, feeding, medical
  reminder_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_grooming_records_pet_id ON grooming_records(pet_id);
CREATE INDEX idx_grooming_records_grooming_date ON grooming_records(grooming_date);
CREATE INDEX idx_feeding_records_pet_id ON feeding_records(pet_id);
CREATE INDEX idx_feeding_records_feed_date ON feeding_records(feed_date);
CREATE INDEX idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX idx_reminders_is_completed ON reminders(is_completed);

-- Tabela de Agendamento de Serviços (Tosa, Banho, etc)
CREATE TABLE service_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(100) NOT NULL, -- banho, tosa, unhas, etc
  groomer_name VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'agendado', -- agendado, concluído, cancelado
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamento de Consultas Veterinárias
CREATE TABLE consultation_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  veterinarian_id UUID REFERENCES veterinarians(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'agendado', -- agendado, concluído, cancelado
  cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_service_appointments_pet_id ON service_appointments(pet_id);
CREATE INDEX idx_service_appointments_appointment_date ON service_appointments(appointment_date);
CREATE INDEX idx_service_appointments_status ON service_appointments(status);
CREATE INDEX idx_consultation_appointments_pet_id ON consultation_appointments(pet_id);
CREATE INDEX idx_consultation_appointments_appointment_date ON consultation_appointments(appointment_date);
CREATE INDEX idx_consultation_appointments_status ON consultation_appointments(status);

-- Tabela de Números de Emergência
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_type VARCHAR(100) NOT NULL, -- veterinário, urgência, tóxico, outro
  phone VARCHAR(20) NOT NULL,
  secondary_phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  description TEXT,
  available_24h BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Transações Financeiras
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type VARCHAR(50) NOT NULL, -- receita, despesa
  category VARCHAR(100) NOT NULL, -- serviço, ração, medicamento, utilities, outro
  description VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_date DATE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  appointment_id UUID, -- referência para agendamento completo
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pagamentos Agendados
CREATE TABLE scheduled_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  category VARCHAR(100), -- fornecedor, aluguel, utilities, etc
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, pago, vencido, atrasado
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Orçamento Mensal
CREATE TABLE monthly_budget (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL, -- primeiro dia do mês
  category VARCHAR(100) NOT NULL,
  budgeted_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month, category)
);

-- Índices
CREATE INDEX idx_emergency_contacts_type ON emergency_contacts(contact_type);
CREATE INDEX idx_emergency_contacts_active ON emergency_contacts(is_active);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX idx_financial_transactions_pet_id ON financial_transactions(pet_id);
CREATE INDEX idx_scheduled_payments_due_date ON scheduled_payments(due_date);
CREATE INDEX idx_scheduled_payments_status ON scheduled_payments(status);
CREATE INDEX idx_monthly_budget_month ON monthly_budget(month);
CREATE INDEX idx_monthly_budget_category ON monthly_budget(category);

-- Row Level Security (RLS)
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budget ENABLE ROW LEVEL SECURITY;
