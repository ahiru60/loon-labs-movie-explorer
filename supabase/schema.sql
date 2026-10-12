-- ==============================================================================
-- CineGlass Movie Explorer — Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'favorites' Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    vote_average NUMERIC(3, 1) DEFAULT 0,
    release_date TEXT,
    overview TEXT,
    media_type TEXT DEFAULT 'movie',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_movie UNIQUE (user_id, movie_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Ensure users can only access and manage their own watchlist)

-- Policy: Select (Read)
CREATE POLICY "Users can view own favorites"
    ON public.favorites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Insert (Add)
CREATE POLICY "Users can insert own favorites"
    ON public.favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Update
CREATE POLICY "Users can update own favorites"
    ON public.favorites
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Delete (Remove)
CREATE POLICY "Users can delete own favorites"
    ON public.favorites
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_movie ON public.favorites(user_id, movie_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(user_id, created_at DESC);
