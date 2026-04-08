# ROIPET - Sistema de Gerenciamento de Petshop

Sistema completo para gerenciamento de petshop com registro de pets, cartão vacinal e prontuário médico.

## 🚀 Features

- ✅ Cadastro de tutores (donos)
- ✅ Cadastro de pets (cão, gato, ave, etc)
- ✅ Cartão vacinal digital
- ✅ Prontuário médico completo
- ✅ Histórico de consultas e tratamentos
- ✅ Anexos (exames, documentos)
- ✅ Gestão de veterinários

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (em desenvolvimento)

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
