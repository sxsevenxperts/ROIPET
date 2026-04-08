-- Inserts para planos de saúde (Health Insurance Add-ons)
-- Estes são ADD-ONS que podem ser adicionados a qualquer assinatura existente

-- Exemplos de como poderiam ser ligados a assinaturas (após inserir):
-- INSERT INTO health_insurance_addons (subscription_id, addon_type, monthly_price, ...)
-- SELECT id, 'basic', 149.90, ... FROM subscriptions WHERE ...

-- Referência para implementação no app:
-- 1. Criar página /subscriptions/[id]/health/add-addon para selecionar plano
-- 2. Criar seletor de planos durante criação de assinatura
-- 3. Adicionar ícone/badge de saúde na página principal de assinatura

-- Descrição dos planos:
-- BASIC: Para pets com boa saúde, cobertura preventiva
-- PREMIUM: Para pets mais velhos ou com problemas crônicos leves
-- PLUS: Para pets com múltiplas condições ou idosos

-- Exemplo de estrutura para selecionar:
-- 1. Usuário clica "Adicionar Cobertura de Saúde" na assinatura
-- 2. Escolhe: BASIC (R$ 149,90), PREMIUM (R$ 249,90) ou PLUS (R$ 399,90)
-- 3. Sistema cria registro em health_insurance_addons
-- 4. Próximas consultas vet e medicamentos são automaticamente cobertos

-- IMPORTANTE: Os valores de monthly_price abaixo são exemplos
-- Ajuste conforme a margem de lucro do seu petshop:
-- - Consulta vet normalmente custa R$ 150-250
-- - 2 consultas/mês = R$ 300-500
-- - Desconto em medicamentos economiza cliente em ~30% = ~R$ 100-200/mês
-- Logo, preço de R$ 149-249 é rentável para petshop + econômico para cliente
