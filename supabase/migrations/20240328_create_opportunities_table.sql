-- Create opportunities table for Opportunity Radar module
-- Run this in Supabase SQL Editor

create table if not exists public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  market text,
  niche text,
  sub_niche text,
  angle text,
  problem text,
  score float,
  horizon text check (horizon in ('short', 'mid', 'long')),
  dossier_url text,
  validation_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- Indexes for fast retrieval
create index idx_opportunities_score on public.opportunities(score desc);
create index idx_opportunities_horizon on public.opportunities(horizon);
create index idx_opportunities_active on public.opportunities(is_active);
create index idx_opportunities_created_at on public.opportunities(created_at desc);

-- Enable RLS
alter table public.opportunities enable row level security;

-- Public read access (users can view opportunities)
create policy "Allow public read" on public.opportunities
  for select using (true);

-- Service role can insert/update
create policy "Allow service insert" on public.opportunities
  for insert with check (true);
  
create policy "Allow service update" on public.opportunities
  for update using (true);

-- Add trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_opportunities_update
  before update on public.opportunities
  for each row
  execute function public.handle_updated_at();
