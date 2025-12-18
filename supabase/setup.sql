-- ============================================
-- Dreamy App - Supabase Database Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Project Settings -> SQL Editor -> New Query
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information synced with auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================
-- Automatically create a profile when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- DREAMS TABLE
-- ============================================
-- Stores user dreams and AI analysis

CREATE TABLE IF NOT EXISTS public.dreams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  interpretation TEXT,
  mood TEXT,
  keywords TEXT[],
  is_lucid BOOLEAN DEFAULT FALSE,
  dream_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dreams - Users can only access their own dreams
CREATE POLICY "Users can view own dreams"
  ON public.dreams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dreams"
  ON public.dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams"
  ON public.dreams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams"
  ON public.dreams FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS dreams_user_id_idx ON public.dreams(user_id);
CREATE INDEX IF NOT EXISTS dreams_created_at_idx ON public.dreams(created_at DESC);
CREATE INDEX IF NOT EXISTS dreams_dream_date_idx ON public.dreams(dream_date DESC);

-- ============================================
-- OPTIONAL: ERROR LOGGING TABLE
-- ============================================
-- For tracking errors in production

CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for error logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only allow inserts, no reads (for privacy)
CREATE POLICY "Users can insert own error logs"
  ON public.error_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure Google OAuth in Authentication -> Providers';
  RAISE NOTICE '2. Deploy the Edge Function for AI analysis';
  RAISE NOTICE '3. Update your .env file with Supabase credentials';
END $$;

