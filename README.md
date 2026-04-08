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
