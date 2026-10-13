-- Esquema de Padel Tracker en Postgres propio.
-- Mismas tablas y columnas que tenía en Supabase, con dos cambios: `profiles`
-- pasa a ser `users` (ahora guarda también el email del login) y no hay RLS,
-- porque solo el servidor lee y escribe, filtrando por el usuario de la sesión.

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  avatar_url text,
  preferred_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

create table shared_results (
  id text primary key,
  encoded_data text not null,
  player_names text[] not null,
  score_line text not null,
  winning_team smallint,
  created_at timestamptz not null default now()
);

create index shared_results_created_at on shared_results (created_at desc);

create table matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  played_at timestamptz not null default now(),
  team1_players text[] not null,
  team2_players text[] not null,
  winning_team smallint,
  user_team smallint,
  user_player_name text,
  sets_score jsonb not null,
  total_points integer not null,
  match_data jsonb not null,
  source_shared_id text references shared_results(id) on delete set null,
  created_at timestamptz not null default now(),
  -- Un usuario no puede guardar dos veces el mismo resultado compartido
  unique (user_id, source_shared_id)
);

create index matches_user_played_at on matches (user_id, played_at desc);

create table tournaments (
  id uuid primary key default gen_random_uuid(),
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  city text not null default 'Buenos Aires',
  address text,
  date_start date,
  date_end date,
  type text not null check (type in ('tournament', 'open_court')),
  category text check (category in ('open', 'amateur', 'advanced', 'pro')),
  price text,
  contact_phone text,
  contact_email text,
  contact_whatsapp text,
  external_url text,
  image_url text,
  status text not null default 'pending'
    check (status in ('pending', 'published', 'cancelled', 'completed')),
  submitted_by uuid references users(id) on delete set null,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tournaments_published on tournaments (date_start) where approved and status = 'published';
