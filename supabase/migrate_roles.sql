-- Migrate existing admins from 'profiles' to 'admin_roles' as 'super_admin'
insert into admin_roles (user_id, role)
select id, 'super_admin'
from profiles
where role = 'admin'
on conflict (user_id) do nothing;
