-- Improved Admin Promotion Script
-- This script ensures we update the profile associated with the login email
-- even if the email in the profiles table is missing or outdated.

UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'riteshkumar.nitk21@gmail.com';

-- Verification Query
SELECT p.id, p.email, p.role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'riteshkumar.nitk21@gmail.com';
