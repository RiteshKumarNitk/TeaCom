-- FIX: Manually insert profile if it's missing
-- This is needed because the 'profiles' table is empty, implying the signup trigger didn't fire.

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin' -- Force admin role immediately
FROM auth.users
WHERE email = 'riteshkumar.nitk21@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin'; -- Even if it exists (which you said it doesn't), make sure it's admin

-- Verify the insertion
SELECT * FROM public.profiles WHERE email = 'riteshkumar.nitk21@gmail.com';
