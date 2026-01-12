-- Run this in your Supabase SQL Editor to promote your user to Admin

UPDATE profiles
SET role = 'admin'
WHERE email = 'riteshkumar.nitk21@gmail.com';

-- Verify the change
SELECT * FROM profiles WHERE email = 'riteshkumar.nitk21@gmail.com';
