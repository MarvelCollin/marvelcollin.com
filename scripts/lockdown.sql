do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where (schemaname = 'public' and tablename like 'portofolio\_kolin\_%')
       or (schemaname = 'storage' and tablename = 'objects'
           and (coalesce(qual, '') like '%portofolio-kolin-media%' or coalesce(with_check, '') like '%portofolio-kolin-media%'))
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

alter table public.portofolio_kolin_works enable row level security;
alter table public.portofolio_kolin_skills enable row level security;
alter table public.portofolio_kolin_experience enable row level security;
alter table public.portofolio_kolin_recognition enable row level security;
alter table public.portofolio_kolin_education enable row level security;

revoke insert, update, delete, truncate on
  public.portofolio_kolin_works,
  public.portofolio_kolin_skills,
  public.portofolio_kolin_experience,
  public.portofolio_kolin_recognition,
  public.portofolio_kolin_education
from anon, authenticated;

create policy "public read" on public.portofolio_kolin_works for select to anon, authenticated using (true);
create policy "public read" on public.portofolio_kolin_skills for select to anon, authenticated using (true);
create policy "public read" on public.portofolio_kolin_experience for select to anon, authenticated using (true);
create policy "public read" on public.portofolio_kolin_recognition for select to anon, authenticated using (true);
create policy "public read" on public.portofolio_kolin_education for select to anon, authenticated using (true);

select schemaname, tablename, policyname, cmd, roles
from pg_policies
where (schemaname = 'public' and tablename like 'portofolio\_kolin\_%')
   or (schemaname = 'storage' and tablename = 'objects')
order by 1, 2, 3;
