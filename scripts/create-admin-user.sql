-- Complete SQL to create an admin user in FoodieHub
-- Run this in Supabase SQL Editor

-- STEP 1: First, create the user via Supabase CLI or Dashboard
-- CLI command (run in terminal):
-- npx supabase auth signup admin@example.com --password Admin123! --project-ref YOUR_PROJECT_REF

-- OR go to Supabase Dashboard → Authentication → Users → Add User
-- Email: admin@example.com
-- Password: Admin123!

-- STEP 2: After creating the user, run this SQL to set admin role

-- First, get the user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Then update the profile to admin role (replace 'user-id-here' with actual ID from above query)
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Or if you know the user ID directly:
-- UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id-here';

-- Verify the admin was created
SELECT id, email, role FROM profiles WHERE role = 'admin';
