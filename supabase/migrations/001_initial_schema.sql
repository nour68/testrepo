-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PLANS
-- ─────────────────────────────────────────────
create table public.plans (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  price_dt    int  not null,
  credits_per_month int not null
);

insert into public.plans (name, price_dt, credits_per_month) values
  ('light',    49,  20),
  ('all_city', 89,  50),
  ('elite',    149, 999);

-- ─────────────────────────────────────────────
-- USERS (extends auth.users)
-- ─────────────────────────────────────────────
create table public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  phone               text,
  name                text,
  city                text,
  role                text not null default 'member' check (role in ('member', 'gym_owner')),
  plan                text not null default 'light'  check (plan in ('light', 'all_city', 'elite')),
  credits             int  not null default 20,
  credits_reset_date  date not null default (date_trunc('month', now()) + interval '1 month')::date,
  created_at          timestamptz not null default now()
);

-- Auto-create user row on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, phone)
  values (new.id, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- GYMS
-- ─────────────────────────────────────────────
create table public.gyms (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references public.users(id) on delete cascade,
  name          text not null,
  city          text not null check (city in ('Tunis', 'Sfax', 'Sousse')),
  categories    text[] not null default '{}',
  credit_cost   int  not null default 2,
  opening_hours jsonb not null default '{"open": "06:00", "close": "22:00", "days": ["Mon","Tue","Wed","Thu","Fri","Sat"]}',
  address       text,
  description   text,
  photos        text[] default '{}',
  rating        numeric(2,1) default 4.0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TIME SLOTS
-- ─────────────────────────────────────────────
create table public.time_slots (
  id           uuid primary key default uuid_generate_v4(),
  gym_id       uuid not null references public.gyms(id) on delete cascade,
  date         date not null,
  start_time   time not null,
  end_time     time not null,
  capacity     int  not null default 10,
  booked_count int  not null default 0 check (booked_count >= 0),
  created_at   timestamptz not null default now(),
  unique (gym_id, date, start_time)
);

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
create table public.bookings (
  id          uuid primary key default uuid_generate_v4(),
  member_id   uuid not null references public.users(id) on delete cascade,
  gym_id      uuid not null references public.gyms(id) on delete cascade,
  slot_id     uuid not null references public.time_slots(id) on delete cascade,
  status      text not null default 'upcoming' check (status in ('upcoming', 'checked_in', 'cancelled')),
  qr_code     text not null,
  credit_cost int  not null default 2,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.users        enable row level security;
alter table public.gyms         enable row level security;
alter table public.time_slots   enable row level security;
alter table public.bookings     enable row level security;
alter table public.plans        enable row level security;

-- Plans: readable by all
create policy "plans_read" on public.plans for select using (true);

-- Users: own row only (read/write)
create policy "users_own_read"   on public.users for select using (auth.uid() = id);
create policy "users_own_update" on public.users for update using (auth.uid() = id);

-- Gyms: readable by all authenticated, writable by owner
create policy "gyms_read"  on public.gyms for select using (auth.role() = 'authenticated');
create policy "gyms_owner_insert" on public.gyms for insert with check (auth.uid() = owner_id);
create policy "gyms_owner_update" on public.gyms for update using (auth.uid() = owner_id);

-- Time slots: readable by all authenticated
create policy "slots_read"   on public.time_slots for select using (auth.role() = 'authenticated');
create policy "slots_insert" on public.time_slots for insert with check (
  exists (select 1 from public.gyms where id = gym_id and owner_id = auth.uid())
);

-- Bookings: member sees own, owner sees their gym's bookings
create policy "bookings_member_read" on public.bookings for select
  using (auth.uid() = member_id);
create policy "bookings_owner_read" on public.bookings for select
  using (exists (select 1 from public.gyms where id = gym_id and owner_id = auth.uid()));
create policy "bookings_member_insert" on public.bookings for insert
  with check (auth.uid() = member_id);
create policy "bookings_member_update" on public.bookings for update
  using (auth.uid() = member_id);
create policy "bookings_owner_update" on public.bookings for update
  using (exists (select 1 from public.gyms where id = gym_id and owner_id = auth.uid()));

-- ─────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────

-- Deduct credits and create booking atomically
create or replace function public.create_booking(
  p_member_id  uuid,
  p_gym_id     uuid,
  p_slot_id    uuid,
  p_qr_code    text,
  p_cost       int
) returns uuid language plpgsql security definer as $$
declare
  v_booking_id uuid;
begin
  -- Check credits
  if (select credits from public.users where id = p_member_id) < p_cost then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  -- Check slot capacity
  if (select booked_count >= capacity from public.time_slots where id = p_slot_id) then
    raise exception 'SLOT_FULL';
  end if;

  -- Deduct credits
  update public.users set credits = credits - p_cost where id = p_member_id;

  -- Increment slot count
  update public.time_slots set booked_count = booked_count + 1 where id = p_slot_id;

  -- Create booking
  insert into public.bookings (member_id, gym_id, slot_id, qr_code, credit_cost, status)
  values (p_member_id, p_gym_id, p_slot_id, p_qr_code, p_cost, 'upcoming')
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

-- Cancel booking and refund credits (up to 2 hours before)
create or replace function public.cancel_booking(p_booking_id uuid, p_member_id uuid)
returns void language plpgsql security definer as $$
declare
  v_slot_start timestamptz;
  v_cost       int;
  v_slot_id    uuid;
begin
  select
    (b.credit_cost),
    (b.slot_id),
    (ts.date + ts.start_time)::timestamptz
  into v_cost, v_slot_id, v_slot_start
  from public.bookings b
  join public.time_slots ts on ts.id = b.slot_id
  where b.id = p_booking_id and b.member_id = p_member_id and b.status = 'upcoming';

  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  if v_slot_start - now() < interval '2 hours' then
    raise exception 'TOO_LATE_TO_CANCEL';
  end if;

  -- Refund credits
  update public.users set credits = credits + v_cost where id = p_member_id;

  -- Free up the slot
  update public.time_slots set booked_count = greatest(booked_count - 1, 0) where id = v_slot_id;

  -- Cancel booking
  update public.bookings set status = 'cancelled' where id = p_booking_id;
end;
$$;
