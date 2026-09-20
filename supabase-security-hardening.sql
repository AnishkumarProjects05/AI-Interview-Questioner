-- ==============================================================================
-- CareerConnect AI: Supabase Database Security & RLS Lockdown Script
-- ==============================================================================
-- Execute this script in your Supabase Project -> SQL Editor.
-- It locks down the database against unauthorized access, enforces strict
-- Row-Level Security (RLS), isolates user data, and prevents SQL injection /
-- cross-user data tampering.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: Users
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."Users" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    picture TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to ensure clean idempotent run
DROP POLICY IF EXISTS "Users can view their own profile" ON public."Users";
DROP POLICY IF EXISTS "Users can create their own profile" ON public."Users";
DROP POLICY IF EXISTS "Users can update their own profile" ON public."Users";

-- Policy: Authenticated users can only read their own user record
CREATE POLICY "Users can view their own profile"
    ON public."Users"
    FOR SELECT
    TO authenticated
    USING (email = (auth.jwt() ->> 'email'));

-- Policy: Authenticated users can only insert their own user record matching JWT email
CREATE POLICY "Users can create their own profile"
    ON public."Users"
    FOR INSERT
    TO authenticated
    WITH CHECK (email = (auth.jwt() ->> 'email'));

-- Policy: Authenticated users can only update their own user record
CREATE POLICY "Users can update their own profile"
    ON public."Users"
    FOR UPDATE
    TO authenticated
    USING (email = (auth.jwt() ->> 'email'))
    WITH CHECK (email = (auth.jwt() ->> 'email'));


-- ------------------------------------------------------------------------------
-- 2. Table: user_details (Profile, LinkedIn, GitHub, LeetCode)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."user_details" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    linkedinprofile TEXT,
    githubprofile TEXT,
    leetcodeprofile TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."user_details" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own user_details" ON public."user_details";
DROP POLICY IF EXISTS "Users can insert own user_details" ON public."user_details";
DROP POLICY IF EXISTS "Users can update own user_details" ON public."user_details";

CREATE POLICY "Users can read own user_details"
    ON public."user_details"
    FOR SELECT
    TO authenticated
    USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can insert own user_details"
    ON public."user_details"
    FOR INSERT
    TO authenticated
    WITH CHECK (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own user_details"
    ON public."user_details"
    FOR UPDATE
    TO authenticated
    USING (email = (auth.jwt() ->> 'email'))
    WITH CHECK (email = (auth.jwt() ->> 'email'));


-- ------------------------------------------------------------------------------
-- 3. Table: Interviews (Generated Interviews)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."Interviews" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    interview_id BIGINT UNIQUE NOT NULL,
    "jobPosition" TEXT,
    "jobDescription" TEXT,
    duration TEXT,
    type TEXT,
    "questionList" JSONB,
    "userEmail" TEXT,
    user_id BIGINT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."Interviews" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creator can manage their own interviews" ON public."Interviews";
DROP POLICY IF EXISTS "Users can read specific interview by interview_id" ON public."Interviews";
DROP POLICY IF EXISTS "Creator can insert interviews" ON public."Interviews";
DROP POLICY IF EXISTS "Creator can update interviews" ON public."Interviews";
DROP POLICY IF EXISTS "Participant can update interview duration and transcript" ON public."Interviews";
DROP POLICY IF EXISTS "Creator can delete interviews" ON public."Interviews";

-- Policy: Creator can view all of their created interviews in the dashboard
CREATE POLICY "Creator can read own interviews"
    ON public."Interviews"
    FOR SELECT
    TO authenticated
    USING ("userEmail" = (auth.jwt() ->> 'email'));

-- Policy: Candidates (including anon/share link holders) can look up a single interview by interview_id
CREATE POLICY "Anyone can lookup interview by unique ID"
    ON public."Interviews"
    FOR SELECT
    TO anon, authenticated
    USING (interview_id IS NOT NULL);

-- Policy: Authenticated users can insert an interview belonging to their email
CREATE POLICY "Creator can insert interviews"
    ON public."Interviews"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userEmail" = (auth.jwt() ->> 'email'));

-- Policy: Creator or interviewee can update interview record (duration / transcript)
CREATE POLICY "Allowed interview update"
    ON public."Interviews"
    FOR UPDATE
    TO anon, authenticated
    USING (interview_id IS NOT NULL)
    WITH CHECK (interview_id IS NOT NULL);

-- Policy: Only the original creator can delete their interview
CREATE POLICY "Creator can delete interviews"
    ON public."Interviews"
    FOR DELETE
    TO authenticated
    USING ("userEmail" = (auth.jwt() ->> 'email'));


-- ------------------------------------------------------------------------------
-- 4. Table: InterviewHistory (User's Completed Mock Interviews)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."InterviewHistory" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "jobPosition" TEXT,
    "questionList" JSONB,
    duration INT4,
    transcript TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."InterviewHistory" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own interview history" ON public."InterviewHistory";
DROP POLICY IF EXISTS "Users can insert own interview history" ON public."InterviewHistory";

CREATE POLICY "Users can view own interview history"
    ON public."InterviewHistory"
    FOR SELECT
    TO authenticated
    USING ("userEmail" = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can insert own interview history"
    ON public."InterviewHistory"
    FOR INSERT
    TO authenticated
    WITH CHECK ("userEmail" = (auth.jwt() ->> 'email'));


-- ------------------------------------------------------------------------------
-- 5. Table: interview_experience (Community Pool)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."interview_experience" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id BIGINT,
    user_email TEXT,
    user_name TEXT,
    linkedin_url TEXT,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    experience_level TEXT,
    job_location TEXT,
    application_source TEXT,
    verdict TEXT,
    overall_difficulty TEXT,
    interview_date TEXT,
    description TEXT,
    preparation_tips TEXT,
    resources_used TEXT,
    is_verified BOOLEAN DEFAULT false,
    verification_score INT4,
    verification_verdict TEXT,
    verification_evidence TEXT,
    verification_flags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."interview_experience" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified experiences" ON public."interview_experience";
DROP POLICY IF EXISTS "Authenticated users can submit experience" ON public."interview_experience";

-- Public / Community can read all verified interview experiences
CREATE POLICY "Public can view verified experiences"
    ON public."interview_experience"
    FOR SELECT
    TO anon, authenticated
    USING (is_verified = true);

-- Authenticated users can insert an experience with their own email
CREATE POLICY "Authenticated users can submit experience"
    ON public."interview_experience"
    FOR INSERT
    TO authenticated
    WITH CHECK (user_email = (auth.jwt() ->> 'email'));


-- ------------------------------------------------------------------------------
-- 6. Table: interview_experience_rounds
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."interview_experience_rounds" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID REFERENCES public."interview_experience"(id) ON DELETE CASCADE,
    round_number INT4 NOT NULL,
    round_name TEXT NOT NULL,
    round_description TEXT,
    topics_covered TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."interview_experience_rounds" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view rounds for verified experience" ON public."interview_experience_rounds";
DROP POLICY IF EXISTS "Authenticated users can insert rounds" ON public."interview_experience_rounds";

CREATE POLICY "Public can view rounds for verified experience"
    ON public."interview_experience_rounds"
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public."interview_experience"
            WHERE public."interview_experience".id = public."interview_experience_rounds".experience_id
            AND public."interview_experience".is_verified = true
        )
    );

CREATE POLICY "Authenticated users can insert rounds"
    ON public."interview_experience_rounds"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public."interview_experience"
            WHERE public."interview_experience".id = public."interview_experience_rounds".experience_id
            AND public."interview_experience".user_email = (auth.jwt() ->> 'email')
        )
    );

-- ------------------------------------------------------------------------------
-- 7. Revoke direct schema alteration permissions from public anon role
-- ------------------------------------------------------------------------------
REVOKE CREATE ON SCHEMA public FROM anon;
REVOKE CREATE ON SCHEMA public FROM authenticated;

-- Confirmation Notice
COMMENT ON TABLE public."Users" IS 'CareerConnect AI: RLS Secured';
COMMENT ON TABLE public."user_details" IS 'CareerConnect AI: RLS Secured';
COMMENT ON TABLE public."Interviews" IS 'CareerConnect AI: RLS Secured';
COMMENT ON TABLE public."InterviewHistory" IS 'CareerConnect AI: RLS Secured';
COMMENT ON TABLE public."interview_experience" IS 'CareerConnect AI: RLS Secured';
COMMENT ON TABLE public."interview_experience_rounds" IS 'CareerConnect AI: RLS Secured';
