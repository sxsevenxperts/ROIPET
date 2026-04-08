# ROIPET - Sistema de Gerenciamento de Petshop

Sistema completo e profissional para gerenciamento de petshop com registro de pets, cartão vacinal, prontuário médico, agenda de serviços e consultas.

## 🚀 Features

### Gerenciamento Básico
- ✅ Cadastro de tutores (donos) com contatos e endereços
- ✅ Cadastro de pets (cão, gato, ave, roedor, réptil)
- ✅ Perfis detalhados com foto, raça, peso, tamanho, cor, microchip

### Saúde & Vacinação
- ✅ Cartão vacinal digital com datas e próximas doses
- ✅ Prontuário médico completo com histórico
- ✅ Gestão de consultas e diagnósticos
- ✅ Registro de medicamentos com dosagem
- ✅ Anexos de exames e documentos

### Serviços & Agendamentos
- ✅ Registro de tosa com tosador e observações
- ✅ Cálculo automático da média entre tosas
- ✅ Agenda de serviços com horários
- ✅ Agenda de consultas veterinárias com veterinários

### Alimentação
- ✅ Registro de ração com marca e tipo
- ✅ Cálculo de consumo diário médio
- ✅ Previsão automática de próximas compras
- ✅ Histórico de custos

### Lembretes & Notificações
- ✅ Geração automática de lembretes para tosa
- ✅ Lembretes para compra de ração
- ✅ Lembretes para vacinações e consultas
- ✅ Dashboard com status de lembretes (urgente, vencido)

### Contatos de Emergência
- ✅ Cadastro de contatos de emergência por tipo (veterinário, urgência 24h, tóxico, outro)
- ✅ Armazenamento de telefone principal, secundário, email e endereço
- ✅ Indicador de disponibilidade 24 horas
- ✅ Links diretos para chamadas telefônicas

### Controle Financeiro
- ✅ Registro de transações (receita e despesa) com categorização
- ✅ Cálculo automático de balança mensal
- ✅ Filtro por mês e período
- ✅ Associação de transações a pets específicos
- ✅ Agenda de pagamentos com vencimentos e status (pendente, pago, vencido)
- ✅ Marcação de pagamentos como pagos
- ✅ Previsão de fluxo de caixa

### Planos de Assinatura 💳
- ✅ 6 planos de assinatura (Ração, Banho, Tosa, Hidratação, Combo, Complete+)
- ✅ Preços com desconto de 15-25% comparado a preços normais
- ✅ Transferência automática de serviços não utilizados para o próximo mês
- ✅ Agendamento automático de serviços
- ✅ Preferência de tosador salva
- ✅ Pausa/retomar/cancelar assinaturas sem penalidade
- ✅ Histórico de faturamento e próximas renovações

### Cobertura de Saúde 🏥 (Health Insurance Add-on)
- ✅ Três tiers de planos de saúde (Basic, Premium, Plus)
- ✅ Cobertura de consultas veterinárias (2-4 por mês conforme plano)
- ✅ Desconto em medicamentos (20-40% conforme plano)
- ✅ Cobertura de exames anuais (2-6 por ano)
- ✅ Opção de cobertura de emergência 24h
- ✅ Registro automático de sinistros de medicamentos
- ✅ Cálculo automático de desconto baseado no plano
- ✅ Dashboard de economia mostrando valor salvo para cliente

## 📱 Páginas Principais

- **`/`** - Home com status do banco de dados
- **`/dashboard`** - Dashboard central com todos os lembretes
- **`/tutors`** - Lista de tutores com CRUD completo
- **`/tutors/new`** - Criar novo tutor
- **`/pets`** - Lista de pets com filtros
- **`/pets/new`** - Criar novo pet
- **`/pets/[id]`** - Detalhes do pet com abas: Visão Geral, Tosa, Ração, Lembretes
- **`/pets/[id]/grooming/new`** - Registrar nova tosa
- **`/pets/[id]/feeding/new`** - Registrar nova ração
- **`/schedule`** - Agenda unificada de serviços e consultas
- **`/schedule/service/new`** - Agendar novo serviço
- **`/schedule/consultation/new`** - Agendar nova consulta
- **`/emergency`** - Lista de contatos de emergência com links rápidos
- **`/emergency/new`** - Cadastrar novo contato de emergência
- **`/finances`** - Painel de controle financeiro (transações e pagamentos)
- **`/finances/transaction/new`** - Registrar nova transação
- **`/finances/payment/new`** - Agendar novo pagamento

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **State Management**: Zustand (pronto para usar)
- **Date Handling**: date-fns

## 📋 Estrutura do Projeto

```
ROIPET/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React reutilizáveis
│   ├── lib/             # Funções utilitárias e configurações
│   ├── types/           # TypeScript interfaces
│   └── styles/          # CSS global e Tailwind
├── public/              # Arquivos estáticos
├── schema.sql           # Schema do banco de dados
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## 🔧 Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/sxsevenxperts/ROIPET.git
cd ROIPET
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Criar tabelas no Supabase

Execute o conteúdo de `schema.sql` no SQL Editor do Supabase.

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📦 Banco de Dados

### Tabelas principais:

- **tutors**: Donos dos pets
- **pets**: Animais cadastrados
- **veterinarians**: Médicos veterinários
- **vaccination_cards**: Cartão vacinal
- **medical_records**: Prontuário médico
- **attachments**: Anexos (exames, documentos)

## 🚢 Deploy

O projeto está pronto para ser deployado no Vercel:

```bash
vercel deploy
```

## 📝 Licença

MIT

## 👨‍💻 Desenvolvedor

Criado com ❤️ por ROIPET Dev Team
