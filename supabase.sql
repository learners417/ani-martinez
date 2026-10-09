-- Pegar en Supabase → SQL Editor → Run
create table if not exists tamim_consultantes (
  email text primary key,
  nombre text,
  estado jsonb default '{}'::jsonb,
  creado_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table tamim_consultantes enable row level security;
-- Sin políticas públicas: solo el servidor (service key) lee y escribe.
