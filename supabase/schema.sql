-- Jalankan file ini di Supabase Dashboard > SQL Editor > New Query > Run

create extension if not exists "pgcrypto";

-- ========== STORIES ==========
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content_md text not null default '',
  status_berkas text not null default 'AMAN', -- AMAN | DIAWASI | DIKARANTINA | DIMUSNAHKAN
  tags text[] not null default '{}',
  cover_image_url text,
  published boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector
);

create index if not exists stories_search_idx on stories using gin(search_vector);
create index if not exists stories_published_idx on stories(published, created_at desc);
create index if not exists stories_tags_idx on stories using gin(tags);

create or replace function stories_search_vector_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('indonesian', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('indonesian', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('indonesian', coalesce(new.content_md, '')), 'C') ||
    setweight(to_tsvector('indonesian', array_to_string(coalesce(new.tags, '{}'), ' ')), 'B');
  new.updated_at := now();
  return new;
end
$$ language plpgsql;

drop trigger if exists stories_search_vector_trigger on stories;
create trigger stories_search_vector_trigger
  before insert or update on stories
  for each row execute function stories_search_vector_update();

-- ========== COMMENTS ==========
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  author_name text not null default 'Anonim',
  content text not null,
  status text not null default 'pending', -- pending | approved | spam
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists comments_story_idx on comments(story_id, status, created_at desc);

-- ========== RATINGS ==========
-- "tingkat kengerian" 1-5, satu vote per voter_hash (fingerprint acak yang disimpan di cookie browser) per cerita
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  value smallint not null check (value between 1 and 5),
  voter_hash text not null,
  created_at timestamptz not null default now(),
  unique(story_id, voter_hash)
);

-- ========== ROW LEVEL SECURITY ==========
-- Publik hanya boleh BACA cerita yang published, dan komentar yang approved.
-- Semua tulis (insert story/comment/rating dari sisi publik) & moderasi lewat API route
-- pakai SUPABASE_SERVICE_ROLE_KEY (server-side saja), jadi RLS ketat di sisi anon key.

alter table stories enable row level security;
alter table comments enable row level security;
alter table ratings enable row level security;

drop policy if exists "public read published stories" on stories;
create policy "public read published stories" on stories
  for select using (published = true);

drop policy if exists "public read approved comments" on comments;
create policy "public read approved comments" on comments
  for select using (status = 'approved');

drop policy if exists "public read ratings" on ratings;
create policy "public read ratings" on ratings
  for select using (true);

-- Tidak ada policy insert/update/delete untuk role anon -> hanya service_role
-- (service_role otomatis bypass RLS di Supabase) yang bisa lewat API routes kita.
