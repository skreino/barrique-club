create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  full_name text,
  email text,
  phone text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  email text not null,
  birthday date,
  favorite_category text check (favorite_category in ('colazione', 'aperitivo', 'vino', 'cocktail')),
  marketing_consent boolean not null default false,
  created_at timestamp with time zone not null default now(),
  last_visit_at timestamp with time zone,
  unique (user_id),
  unique (email)
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  source text not null default 'manuale'
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  admin_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.customer_tags (
  customer_id uuid not null references public.customers(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (customer_id, tag_id)
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  required_checkins int not null check (required_checkins > 0),
  active boolean not null default true
);

create table if not exists public.customer_rewards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  reward_id uuid not null references public.rewards(id) on delete cascade,
  redeemed boolean not null default false,
  redeemed_at timestamp with time zone
);

create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists customers_email_idx on public.customers(email);
create index if not exists customers_created_at_idx on public.customers(created_at);
create index if not exists customers_last_visit_at_idx on public.customers(last_visit_at);
create index if not exists customers_birthday_idx on public.customers(birthday);
create index if not exists customers_favorite_category_idx on public.customers(favorite_category);
create index if not exists checkins_customer_id_created_at_idx on public.checkins(customer_id, created_at desc);
create index if not exists notes_customer_id_created_at_idx on public.notes(customer_id, created_at desc);
create index if not exists customer_tags_tag_id_idx on public.customer_tags(tag_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, phone)
  values (
    new.id,
    'customer',
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;

  if new.raw_user_meta_data ? 'first_name' then
    insert into public.customers (
      user_id,
      first_name,
      last_name,
      phone,
      email,
      birthday,
      favorite_category,
      marketing_consent
    )
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'first_name', ''),
      coalesce(new.raw_user_meta_data->>'last_name', ''),
      new.raw_user_meta_data->>'phone',
      new.email,
      nullif(new.raw_user_meta_data->>'birthday', '')::date,
      nullif(new.raw_user_meta_data->>'favorite_category', ''),
      coalesce((new.raw_user_meta_data->>'marketing_consent')::boolean, false)
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_customer_last_visit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.customers
  set last_visit_at = new.created_at
  where id = new.customer_id;

  return new;
end;
$$;

drop trigger if exists on_checkin_created on public.checkins;
create trigger on_checkin_created
  after insert on public.checkins
  for each row execute function public.touch_customer_last_visit();

insert into public.rewards (name, required_checkins, active)
select 'Premio Barrique', 10, true
where not exists (select 1 from public.rewards where active = true);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.checkins enable row level security;
alter table public.notes enable row level security;
alter table public.tags enable row level security;
alter table public.customer_tags enable row level security;
alter table public.rewards enable row level security;
alter table public.customer_rewards enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "customers_select_own_or_admin" on public.customers;
create policy "customers_select_own_or_admin"
on public.customers for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "customers_insert_own_or_admin" on public.customers;
create policy "customers_insert_own_or_admin"
on public.customers for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "customers_update_own_or_admin" on public.customers;
create policy "customers_update_own_or_admin"
on public.customers for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "checkins_select_own_or_admin" on public.checkins;
create policy "checkins_select_own_or_admin"
on public.checkins for select
using (
  public.is_admin()
  or exists (
    select 1 from public.customers
    where customers.id = checkins.customer_id
      and customers.user_id = auth.uid()
  )
);

drop policy if exists "checkins_insert_admin" on public.checkins;
create policy "checkins_insert_admin"
on public.checkins for insert
with check (public.is_admin());

drop policy if exists "notes_select_admin" on public.notes;
create policy "notes_select_admin"
on public.notes for select
using (public.is_admin());

drop policy if exists "notes_insert_admin" on public.notes;
create policy "notes_insert_admin"
on public.notes for insert
with check (public.is_admin() and admin_id = auth.uid());

drop policy if exists "tags_select_authenticated" on public.tags;
create policy "tags_select_authenticated"
on public.tags for select
using (auth.role() = 'authenticated');

drop policy if exists "tags_manage_admin" on public.tags;
create policy "tags_manage_admin"
on public.tags for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customer_tags_select_admin" on public.customer_tags;
create policy "customer_tags_select_admin"
on public.customer_tags for select
using (public.is_admin());

drop policy if exists "customer_tags_manage_admin" on public.customer_tags;
create policy "customer_tags_manage_admin"
on public.customer_tags for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "rewards_select_authenticated" on public.rewards;
create policy "rewards_select_authenticated"
on public.rewards for select
using (auth.role() = 'authenticated');

drop policy if exists "rewards_manage_admin" on public.rewards;
create policy "rewards_manage_admin"
on public.rewards for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "customer_rewards_select_own_or_admin" on public.customer_rewards;
create policy "customer_rewards_select_own_or_admin"
on public.customer_rewards for select
using (
  public.is_admin()
  or exists (
    select 1 from public.customers
    where customers.id = customer_rewards.customer_id
      and customers.user_id = auth.uid()
  )
);

drop policy if exists "customer_rewards_manage_admin" on public.customer_rewards;
create policy "customer_rewards_manage_admin"
on public.customer_rewards for all
using (public.is_admin())
with check (public.is_admin());
