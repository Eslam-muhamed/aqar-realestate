-- ==============================================================================
-- MIGRATION: Performance Indexes & Data Archiving for Aqar Real Estate
-- Resolves: Long-term database query slowdown & active dataset bloat
-- ==============================================================================

-- 1. Add Archiving columns to properties and leads
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- ------------------------------------------------------------------------------
-- 2. PARTIAL COMPOUND INDEXES for Fast Queries on Active Records
-- These indexes only index active (non-archived) records, keeping index size tiny
-- and scan speeds ultra-fast even after 2+ years of high activity.
-- ------------------------------------------------------------------------------

-- Search filter on active published properties
CREATE INDEX IF NOT EXISTS idx_properties_active_filter 
ON public.properties (city, type, status, price) 
WHERE is_archived = false AND is_published = true;

-- Ordering active properties by latest creation
CREATE INDEX IF NOT EXISTS idx_properties_active_created 
ON public.properties (created_at DESC) 
WHERE is_archived = false;

-- Active property lookup by slug
CREATE INDEX IF NOT EXISTS idx_properties_active_slug 
ON public.properties (slug) 
WHERE is_archived = false;

-- Supervisor assigned active leads
CREATE INDEX IF NOT EXISTS idx_leads_active_assigned 
ON public.leads (assigned_to, status, created_at DESC) 
WHERE is_archived = false;

-- Admin unassigned active leads queue
CREATE INDEX IF NOT EXISTS idx_leads_active_unassigned 
ON public.leads (created_at DESC) 
WHERE assigned_to IS NULL AND is_archived = false;

-- Fast archive lookups when browsing the archive tab
CREATE INDEX IF NOT EXISTS idx_properties_archived 
ON public.properties (archived_at DESC) 
WHERE is_archived = true;

CREATE INDEX IF NOT EXISTS idx_leads_archived 
ON public.leads (archived_at DESC) 
WHERE is_archived = true;

-- ------------------------------------------------------------------------------
-- 3. STORED PROCEDURE: Batch-archive closed leads older than N days
-- Usage: SELECT public.archive_old_closed_leads(90);
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.archive_old_closed_leads(days_threshold INT DEFAULT 90)
RETURNS INT AS $$
DECLARE
    archived_count INT;
BEGIN
    UPDATE public.leads
    SET is_archived = true,
        archived_at = now()
    WHERE is_archived = false
      AND status IN ('closed_won', 'closed_lost')
      AND updated_at < now() - (days_threshold || ' days')::INTERVAL;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
