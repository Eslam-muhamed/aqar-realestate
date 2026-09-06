-- ==============================================================================
-- AQAR REAL ESTATE: SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Roles: Admin (Office Owner) | Supervisor (Agent) | Public Visitor (Anonymous)
-- Features: Anti-Collision Lead Management, Property Listings, Granular Permissions
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLE: public.profiles
-- Extends auth.users with app-specific roles, profile details, and permissions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'supervisor' CHECK (
        role IN ('admin', 'supervisor')
    ),
    permissions JSONB NOT NULL DEFAULT jsonb_build_object (
        'can_add_properties',
        true,
        'can_edit_all_properties',
        false,
        'can_delete_properties',
        false,
        'can_claim_unassigned_leads',
        false
    ),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function: Is current user an active admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is current user an active supervisor?
CREATE OR REPLACE FUNCTION public.is_active_supervisor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'supervisor'
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. TABLE: public.properties
-- Real estate listings created by Admins or Supervisors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id TEXT UNIQUE, -- e.g. "AQR-1001"
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('villa', 'apartment', 'penthouse', 'townhouse', 'duplex', 'commercial')),
    status TEXT NOT NULL CHECK (status IN ('for-sale', 'for-rent')),
    price NUMERIC NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'EGP',
    city TEXT NOT NULL,
    district TEXT,
    address TEXT,
    lat NUMERIC,
    lng NUMERIC,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    area NUMERIC NOT NULL CHECK (area >= 0),
    parking INTEGER NOT NULL DEFAULT 0,
    year_built INTEGER,
    floors INTEGER DEFAULT 1,
    images TEXT[] NOT NULL DEFAULT '{}',
    features TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT true,
    views INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    archived_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. TABLE: public.leads
-- Client inquiries submitted publicly, assigned by Admin to avoid supervisor collisions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    property_id UUID REFERENCES public.properties (id) ON DELETE SET NULL,
    property_title TEXT,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN (
            'new',
            'contacted',
            'meeting_scheduled',
            'closed_won',
            'closed_lost'
        )
    ),
    assigned_to UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    assigned_by UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    internal_notes TEXT NOT NULL DEFAULT '',
    is_archived BOOLEAN NOT NULL DEFAULT false,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: public.lead_activities
-- Timeline history for audit & supervisor actions on leads
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES for High Performance
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON public.properties (created_by);

CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);

CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);

CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city);

CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties (featured);

CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads (assigned_to);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

CREATE INDEX IF NOT EXISTS idx_leads_property_id ON public.leads (property_id);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities (lead_id);

-- Partial & compound indexes for 2-year scalability on active items
CREATE INDEX IF NOT EXISTS idx_properties_active_filter 
ON public.properties (city, type, status, price) 
WHERE is_archived = false AND is_published = true;

CREATE INDEX IF NOT EXISTS idx_properties_active_created 
ON public.properties (created_at DESC) 
WHERE is_archived = false;

CREATE INDEX IF NOT EXISTS idx_leads_active_assigned 
ON public.leads (assigned_to, status, created_at DESC) 
WHERE is_archived = false;

CREATE INDEX IF NOT EXISTS idx_leads_active_unassigned 
ON public.leads (created_at DESC) 
WHERE assigned_to IS NULL AND is_archived = false;

CREATE INDEX IF NOT EXISTS idx_properties_archived 
ON public.properties (archived_at DESC) 
WHERE is_archived = true;

CREATE INDEX IF NOT EXISTS idx_leads_archived 
ON public.leads (archived_at DESC) 
WHERE is_archived = true;

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: Auto-create Profile on Auth Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    users_count INT;
    assigned_role TEXT;
BEGIN
    SELECT count(*) INTO users_count FROM public.profiles;
    -- The first user is made admin automatically
    IF users_count = 0 THEN
        assigned_role := 'admin';
    ELSE
        assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'supervisor');
    END IF;

    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'phone',
        assigned_role
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- 8.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;

CREATE POLICY "Public read profiles" ON public.profiles FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id);

DROP POLICY IF EXISTS "Admin update any profile" ON public.profiles;

CREATE POLICY "Admin update any profile" ON public.profiles FOR
UPDATE USING (public.is_admin ());

-- 8.2 PROPERTIES POLICIES
DROP POLICY IF EXISTS "Public read published properties" ON public.properties;

CREATE POLICY "Public read published properties" ON public.properties FOR
SELECT USING (
        is_published = true
        OR public.is_admin ()
        OR created_by = auth.uid ()
    );

DROP POLICY IF EXISTS "Admins and supervisors can insert properties" ON public.properties;

CREATE POLICY "Admins and supervisors can insert properties" ON public.properties FOR
INSERT
WITH
    CHECK (
        public.is_admin ()
        OR (
            public.is_active_supervisor ()
            AND (
                auth.uid () = created_by
                OR created_by IS NULL
            )
        )
    );

DROP POLICY IF EXISTS "Admins and owners update properties" ON public.properties;

CREATE POLICY "Admins and owners update properties" ON public.properties FOR
UPDATE USING (
    public.is_admin ()
    OR (
        public.is_active_supervisor ()
        AND created_by = auth.uid ()
    )
);

DROP POLICY IF EXISTS "Admins and owners delete properties" ON public.properties;

CREATE POLICY "Admins and owners delete properties" ON public.properties FOR DELETE USING (
    public.is_admin ()
    OR (
        public.is_active_supervisor ()
        AND created_by = auth.uid ()
    )
);

-- 8.3 LEADS POLICIES (NO-COLLISION GUARANTEE)
DROP POLICY IF EXISTS "Public visitors can create leads" ON public.leads;

CREATE POLICY "Public visitors can create leads" ON public.leads FOR
INSERT
WITH
    CHECK (
        assigned_to IS NULL 
        AND assigned_by IS NULL
        AND status = 'new'
    );

DROP POLICY IF EXISTS "Admins and assigned supervisors can view leads" ON public.leads;

CREATE POLICY "Admins and assigned supervisors can view leads" ON public.leads FOR
SELECT USING (
        public.is_admin ()
        OR (
            public.is_active_supervisor ()
            AND assigned_to = auth.uid ()
        )
    );

DROP POLICY IF EXISTS "Admins and assigned supervisors can update leads" ON public.leads;

CREATE POLICY "Admins and assigned supervisors can update leads" ON public.leads FOR
UPDATE USING (
    public.is_admin ()
    OR (
        public.is_active_supervisor ()
        AND assigned_to = auth.uid ()
    )
);

DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;

CREATE POLICY "Only admins can delete leads" ON public.leads FOR DELETE USING (public.is_admin ());

-- 8.4 LEAD ACTIVITIES POLICIES
DROP POLICY IF EXISTS "View lead activities" ON public.lead_activities;

CREATE POLICY "View lead activities" ON public.lead_activities FOR
SELECT USING (
        public.is_admin ()
        OR EXISTS (
            SELECT 1
            FROM public.leads
            WHERE
                leads.id = lead_activities.lead_id
                AND leads.assigned_to = auth.uid ()
        )
    );

DROP POLICY IF EXISTS "Insert lead activities" ON public.lead_activities;

CREATE POLICY "Insert lead activities" ON public.lead_activities FOR
INSERT
WITH
    CHECK (auth.uid () IS NOT NULL);