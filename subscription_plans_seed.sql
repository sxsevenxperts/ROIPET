-- Inserts para planos de assinatura padrão
INSERT INTO subscription_plans (name, description, plan_type, monthly_price, included_services, discount_percentage, max_rollover, features, is_active)
VALUES
  (
    'Ração Mensal',
    'Assinatura mensal de ração com entrega automática',
    'ração',
    149.90,
    '{"racao": 4}',
    15,
    2,
    '{"auto_booking": false, "groomer_preference": false}',
    true
  ),
  (
    'Banho Mensal',
    '1 banho por mês + banhos adicionais com desconto',
    'banho',
    99.90,
    '{"banho": 1}',
    15,
    2,
    '{"auto_booking": true, "groomer_preference": true}',
    true
  ),
  (
    'Tosa Mensal',
    '1 tosa por mês + tosas adicionais com desconto',
    'tosa',
    149.90,
    '{"tosa": 1}',
    15,
    2,
    '{"auto_booking": true, "groomer_preference": true}',
    true
  ),
  (
    'Hidratação Mensal',
    '1 hidratação por mês + tratamentos adicionais com desconto',
    'hidratação',
    89.90,
    '{"hidratacao": 1}',
    15,
    2,
    '{"auto_booking": true, "groomer_preference": true}',
    true
  ),
  (
    'Combo Grooming',
    'Banho + Tosa + Hidratação - pacote completo de grooming',
    'combo',
    289.90,
    '{"banho": 1, "tosa": 1, "hidratacao": 1}',
    20,
    2,
    '{"auto_booking": true, "groomer_preference": true}',
    true
  ),
  (
    'Complete+ Plus',
    'Todos os serviços + ração mensal - o melhor valor',
    'complete+',
    449.90,
    '{"banho": 1, "tosa": 1, "hidratacao": 1, "racao": 4}',
    25,
    3,
    '{"auto_booking": true, "groomer_preference": true}',
    true
  );
