-- Add email and is_active columns to users table for Supabase Auth integration
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
