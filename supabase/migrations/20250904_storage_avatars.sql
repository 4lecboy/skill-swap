-- Create 'avatars' bucket if missing
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'avatars') then
    perform storage.create_bucket('avatars', public => true);
  end if;
end$$;

-- Policies for storage.objects on the 'avatars' bucket
-- Public read
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read avatars'
  ) then
    create policy "Public read avatars"
      on storage.objects
      for select
      using (bucket_id = 'avatars');
  end if;
end$$;

-- Users can upload to their own folder: {user_id}/filename
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users insert own avatars'
  ) then
    create policy "Users insert own avatars"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'avatars'
        and auth.uid()::text = split_part(name, '/', 1)
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users update own avatars'
  ) then
    create policy "Users update own avatars"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'avatars'
        and auth.uid()::text = split_part(name, '/', 1)
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users delete own avatars'
  ) then
    create policy "Users delete own avatars"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'avatars'
        and auth.uid()::text = split_part(name, '/', 1)
      );
  end if;
end$$;