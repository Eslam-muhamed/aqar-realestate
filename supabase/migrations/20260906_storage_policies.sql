-- ==============================================================================
-- FIX SUPABASE STORAGE POLICIES FOR 'properties' BUCKET
-- حل مشكلة فشل رفع الصور عبر تفعيل صلاحيات الـ Storage RLS لباكت properties
-- ==============================================================================

-- 1. التأكد من وجود وتكوين الـ Bucket العام للصور
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'properties',
    'properties',
    true,
    15728640, -- 15MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

-- 2. تفعيل قراءة الصور للجميع (Public Read) لظهور صور العقارات للزوار
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'properties');

-- 3. تفعيل رفع الصور (Insert)
DROP POLICY IF EXISTS "Allow uploads to property images" ON storage.objects;
CREATE POLICY "Allow uploads to property images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'properties');

-- 4. تفعيل استبدال وتحديث الصور (Update)
DROP POLICY IF EXISTS "Allow updates to property images" ON storage.objects;
CREATE POLICY "Allow updates to property images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'properties')
WITH CHECK (bucket_id = 'properties');

-- 5. تفعيل حذف الصور عند التعديل (Delete)
DROP POLICY IF EXISTS "Allow deletes of property images" ON storage.objects;
CREATE POLICY "Allow deletes of property images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'properties');
