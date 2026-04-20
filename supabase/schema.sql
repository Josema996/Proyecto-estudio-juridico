-- ====================================================
-- ESTUDIO JURÍDICO — Schema Supabase
-- Ejecutar en SQL Editor de tu proyecto Supabase
-- ====================================================

-- ENUMS
create type user_role as enum ('titular', 'asociado', 'administrativo', 'cliente');
create type causa_estado as enum ('activa', 'suspendida', 'archivada', 'resuelta');
create type honorario_estado as enum ('pendiente', 'parcial', 'cancelado');
create type evento_tipo as enum ('audiencia', 'vencimiento', 'reunion', 'otro');

-- PROFILES (extiende auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role user_role not null default 'administrativo',
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-crear profile al registrar usuario
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'administrativo')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- CLIENTES
create table clientes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  apellido text not null,
  dni text,
  email text,
  phone text,
  direccion text,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CAUSAS
create table causas (
  id uuid default gen_random_uuid() primary key,
  numero_expediente text not null unique,
  caratula text not null,
  fuero text,
  juzgado text,
  estado causa_estado not null default 'activa',
  cliente_id uuid references clientes(id) on delete set null,
  abogado_id uuid references profiles(id) on delete set null,
  descripcion text,
  fecha_inicio date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DOCUMENTOS
create table documentos (
  id uuid default gen_random_uuid() primary key,
  causa_id uuid references causas(id) on delete set null,
  cliente_id uuid references clientes(id) on delete set null,
  nombre text not null,
  descripcion text,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- EVENTOS (agenda)
create table eventos (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  tipo evento_tipo not null default 'otro',
  fecha_hora timestamptz not null,
  causa_id uuid references causas(id) on delete set null,
  creado_por uuid references profiles(id) on delete set null,
  recordatorio_enviado boolean default false,
  created_at timestamptz default now()
);

-- HONORARIOS
create table honorarios (
  id uuid default gen_random_uuid() primary key,
  causa_id uuid references causas(id) on delete set null,
  cliente_id uuid references clientes(id) on delete set null,
  concepto text not null,
  monto_total numeric(12,2) not null default 0,
  monto_pagado numeric(12,2) not null default 0,
  estado honorario_estado not null default 'pendiente',
  fecha_acuerdo date,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ====================================================
-- ROW LEVEL SECURITY
-- ====================================================

alter table profiles enable row level security;
alter table clientes enable row level security;
alter table causas enable row level security;
alter table documentos enable row level security;
alter table eventos enable row level security;
alter table honorarios enable row level security;

-- Helpers
create or replace function get_my_role()
returns user_role language sql stable security definer as $$
  select role from profiles where id = auth.uid();
$$;

-- Profiles: cada usuario ve el suyo; titulares ven todos
create policy "profiles_select" on profiles for select
  using (id = auth.uid() or get_my_role() in ('titular', 'administrativo'));

create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());

-- Clientes: todos los staff pueden ver; solo titular/administrativo crea/edita/borra
create policy "clientes_select" on clientes for select
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "clientes_insert" on clientes for insert
  with check (get_my_role() in ('titular', 'administrativo'));

create policy "clientes_update" on clientes for update
  using (get_my_role() in ('titular', 'administrativo'));

create policy "clientes_delete" on clientes for delete
  using (get_my_role() = 'titular');

-- Causas: igual que clientes
create policy "causas_select" on causas for select
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "causas_insert" on causas for insert
  with check (get_my_role() in ('titular', 'administrativo', 'asociado'));

create policy "causas_update" on causas for update
  using (get_my_role() in ('titular', 'administrativo', 'asociado'));

create policy "causas_delete" on causas for delete
  using (get_my_role() = 'titular');

-- Documentos, eventos y honorarios: staff completo puede leer; titular/admin gestiona
create policy "documentos_select" on documentos for select
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "documentos_insert" on documentos for insert
  with check (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "documentos_delete" on documentos for delete
  using (get_my_role() in ('titular', 'administrativo'));

create policy "eventos_select" on eventos for select
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "eventos_insert" on eventos for insert
  with check (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "eventos_update" on eventos for update
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "eventos_delete" on eventos for delete
  using (get_my_role() in ('titular', 'administrativo'));

create policy "honorarios_select" on honorarios for select
  using (get_my_role() in ('titular', 'asociado', 'administrativo'));

create policy "honorarios_insert" on honorarios for insert
  with check (get_my_role() in ('titular', 'administrativo'));

create policy "honorarios_update" on honorarios for update
  using (get_my_role() in ('titular', 'administrativo'));

create policy "honorarios_delete" on honorarios for delete
  using (get_my_role() = 'titular');

-- ====================================================
-- STORAGE BUCKET para documentos
-- ====================================================
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false);

create policy "storage_select" on storage.objects for select
  using (bucket_id = 'documentos' and auth.role() = 'authenticated');

create policy "storage_insert" on storage.objects for insert
  with check (bucket_id = 'documentos' and auth.role() = 'authenticated');

create policy "storage_delete" on storage.objects for delete
  using (bucket_id = 'documentos' and auth.uid()::text = (storage.foldername(name))[1]);
