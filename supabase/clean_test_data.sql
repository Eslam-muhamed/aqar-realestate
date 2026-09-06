-- ==============================================================================
-- CLEAN TEST DATA SCRIPT (تصفير بيانات التجارب والبدء من الصفر)
-- This script cleans all test properties, test leads, and activities
-- while PRESERVING admin and supervisor accounts and settings.
-- ==============================================================================

-- 1. تفريغ سجلات وأنشطة المتابعة للعملاء التجريبيين (إن وجدت)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lead_activities') THEN
        DELETE FROM public.lead_activities;
    END IF;
END $$;

-- 2. تفريغ طلبات العملاء التجريبية بالكامل
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
        DELETE FROM public.leads;
    END IF;
END $$;

-- 3. تفريغ العقارات التجريبية بالكامل
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
        DELETE FROM public.properties;
    END IF;
END $$;

-- ملحوظة: المفضلة تُحفظ محلياً على أجهزة الزوار (Local Storage) وليست في قاعدة البيانات.
-- ملحوظة: حسابات المشرفين والمدير في جدول public.profiles و auth.users محفوظة بالكامل ولم تُمس.

SELECT 
    (SELECT count(*) FROM public.properties) AS remaining_properties,
    (SELECT count(*) FROM public.leads) AS remaining_leads,
    (SELECT count(*) FROM public.profiles) AS active_team_members;
