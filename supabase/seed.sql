-- Seed file: run after migrations for local dev / demo
-- Uses fixed UUIDs for reproducibility

-- Demo gym owner
insert into auth.users (id, phone, created_at, updated_at, email_confirmed_at)
values
  ('00000000-0000-0000-0000-000000000001', '+21699000001', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000002', '+21699000002', now(), now(), now())
on conflict do nothing;

insert into public.users (id, phone, name, city, role, plan, credits)
values
  ('00000000-0000-0000-0000-000000000001', '+21699000001', 'Sami Trabelsi', 'Tunis', 'member', 'all_city', 38),
  ('00000000-0000-0000-0000-000000000002', '+21699000002', 'Amine Boughanmi', 'Tunis', 'gym_owner', 'elite', 999)
on conflict do nothing;

-- Demo gyms
insert into public.gyms (id, owner_id, name, city, categories, credit_cost, address, description, rating, opening_hours) values
(
  'aaaaaaaa-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Iron Temple',
  'Tunis',
  ARRAY['Musculation','CrossFit'],
  2,
  'Av. Habib Bourguiba, Tunis',
  'Salle de musculation haut de gamme en plein cœur de Tunis. Équipements dernière génération et coachs certifiés.',
  4.8,
  '{"open":"06:00","close":"22:00","days":["Mon","Tue","Wed","Thu","Fri","Sat"]}'
),
(
  'aaaaaaaa-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'Zen Flow Studio',
  'Tunis',
  ARRAY['Yoga','Cycling'],
  3,
  'Rue du Lac, Les Berges du Lac, Tunis',
  'Studio bien-être spécialisé en yoga et cycling. Ambiance calme et instructeurs expérimentés.',
  4.6,
  '{"open":"07:00","close":"21:00","days":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}'
),
(
  'aaaaaaaa-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'Fight Club Tunis',
  'Tunis',
  ARRAY['Boxing','CrossFit'],
  3,
  'Av. Louis Braille, Tunis',
  'Centre de sports de combat et HIIT. Box, MMA, CrossFit dans un cadre authentique.',
  4.7,
  '{"open":"08:00","close":"22:00","days":["Mon","Tue","Wed","Thu","Fri","Sat"]}'
),
(
  'aaaaaaaa-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000002',
  'Aqua Sfax',
  'Sfax',
  ARRAY['Swimming'],
  4,
  'Route de Tunis km 5, Sfax',
  'Complexe aquatique avec piscine olympique et bassin pour enfants. Cours de natation tous niveaux.',
  4.5,
  '{"open":"07:00","close":"20:00","days":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}'
),
(
  'aaaaaaaa-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000002',
  'FitZone Sousse',
  'Sousse',
  ARRAY['Musculation','Yoga'],
  2,
  'Av. Taïeb Mhiri, Sousse',
  'Grande salle multisports avec espace cardio, musculation et studio yoga.',
  4.4,
  '{"open":"06:30","close":"22:30","days":["Mon","Tue","Wed","Thu","Fri","Sat"]}'
),
(
  'aaaaaaaa-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000002',
  'CrossFit Sfax',
  'Sfax',
  ARRAY['CrossFit','Boxing'],
  3,
  'Zone Industrielle, Sfax',
  'Box CrossFit affiliée avec programmation quotidienne et compétitions régionales.',
  4.9,
  '{"open":"06:00","close":"21:00","days":["Mon","Tue","Wed","Thu","Fri","Sat"]}'
);

-- Sample time slots for today and tomorrow (Iron Temple)
insert into public.time_slots (gym_id, date, start_time, end_time, capacity, booked_count)
select
  'aaaaaaaa-0000-0000-0000-000000000001',
  current_date,
  s.start_time::time,
  s.end_time::time,
  12,
  floor(random() * 8)::int
from (values
  ('07:00','08:00'),
  ('08:00','09:00'),
  ('09:00','10:00'),
  ('10:00','11:00'),
  ('17:00','18:00'),
  ('18:00','19:00'),
  ('19:00','20:00'),
  ('20:00','21:00')
) as s(start_time, end_time)
on conflict do nothing;

insert into public.time_slots (gym_id, date, start_time, end_time, capacity, booked_count)
select
  'aaaaaaaa-0000-0000-0000-000000000001',
  current_date + 1,
  s.start_time::time,
  s.end_time::time,
  12,
  0
from (values
  ('07:00','08:00'),
  ('08:00','09:00'),
  ('09:00','10:00'),
  ('17:00','18:00'),
  ('18:00','19:00'),
  ('19:00','20:00')
) as s(start_time, end_time)
on conflict do nothing;
