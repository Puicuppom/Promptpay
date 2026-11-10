-- QR-PUI: เก็บข้อมูลบัญชี + พื้นหลัง (รันครั้งเดียวใน Supabase SQL Editor โปรเจกต์เดียวกับ PuiHome&Tax)

-- 1) ตารางเก็บ state ของแอป (1 แถวต่อผู้ใช้)
create table if not exists public.qr_pui_state (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.qr_pui_state enable row level security;
drop policy if exists "own row" on public.qr_pui_state;
create policy "own row" on public.qr_pui_state
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on public.qr_pui_state to authenticated;

-- 2) Storage bucket สำหรับรูปพื้นหลังสลิป (private) — ไฟล์อยู่ใต้โฟลเดอร์ <user_id>/
insert into storage.buckets (id, name, public)
values ('qr-pui', 'qr-pui', false)
on conflict (id) do nothing;

drop policy if exists "qr-pui own files" on storage.objects;
create policy "qr-pui own files" on storage.objects
  for all to authenticated
  using (bucket_id = 'qr-pui' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'qr-pui' and (storage.foldername(name))[1] = auth.uid()::text);
