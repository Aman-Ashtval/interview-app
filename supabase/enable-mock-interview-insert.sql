-- Run this in Supabase Dashboard → SQL Editor (run the whole script)
-- Allows only authenticated users to INSERT and SELECT on mock_interview.

-- Remove old policies if they exist (avoids "already exists" errors)
DROP POLICY IF EXISTS "Allow authenticated insert on mock_interview" ON public.mock_interview;
DROP POLICY IF EXISTS "Allow authenticated select on mock_interview" ON public.mock_interview;
DROP POLICY IF EXISTS "Allow anon insert on mock_interview" ON public.mock_interview;
DROP POLICY IF EXISTS "Allow anon select on mock_interview" ON public.mock_interview;

-- INSERT: allow authenticated users only
CREATE POLICY "Allow authenticated insert on mock_interview"
ON public.mock_interview
FOR INSERT
TO authenticated
WITH CHECK (true);

-- SELECT: allow authenticated users only (so .select() after insert works)
CREATE POLICY "Allow authenticated select on mock_interview"
ON public.mock_interview
FOR SELECT
TO authenticated
USING (true);
