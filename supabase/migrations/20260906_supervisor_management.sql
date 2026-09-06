-- ==============================================================================
-- MIGRATION: Admin Supervisor Management (إضافة وحذف المشرفين بصلاحيات الأدمن)
-- ==============================================================================

-- 1. Policies for profiles table to allow Admin full control
DROP POLICY IF EXISTS "Admin insert any profile" ON public.profiles;
CREATE POLICY "Admin insert any profile" ON public.profiles 
FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete any profile" ON public.profiles;
CREATE POLICY "Admin delete any profile" ON public.profiles 
FOR DELETE USING (public.is_admin());

-- 2. Stored Procedure: Admin Create Supervisor with credentials
CREATE OR REPLACE FUNCTION public.admin_create_supervisor(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_permissions JSONB DEFAULT '{"can_add_properties": true, "can_edit_all_properties": false, "can_delete_properties": false, "can_claim_unassigned_leads": true}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    new_user_id UUID;
    encrypted_pw TEXT;
BEGIN
    -- Ensure caller is admin (if profiles table has any admin)
    IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Only administrators can create supervisors';
        END IF;
    END IF;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
        RAISE EXCEPTION 'User with this email already exists';
    END IF;

    new_user_id := gen_random_uuid();
    encrypted_pw := crypt(p_password, gen_salt('bf'));

    -- Insert into auth.users so the supervisor can log in immediately
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        role,
        aud,
        created_at,
        updated_at
    )
    VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        p_email,
        encrypted_pw,
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', p_full_name, 'phone', p_phone, 'role', 'supervisor'),
        'authenticated',
        'authenticated',
        now(),
        now()
    );

    -- Insert into profiles
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        permissions,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        new_user_id,
        p_email,
        p_full_name,
        p_phone,
        'supervisor',
        p_permissions,
        true,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        permissions = EXCLUDED.permissions;

    RETURN jsonb_build_object('success', true, 'id', new_user_id);
END;
$$;

-- 3. Stored Procedure: Admin Delete Supervisor
CREATE OR REPLACE FUNCTION public.admin_delete_supervisor(
    p_supervisor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Check admin permission
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only administrators can delete supervisors';
    END IF;

    -- Prevent deleting administrators
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_supervisor_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Cannot delete an administrator account';
    END IF;

    -- Unassign leads from this supervisor so they can be redistributed
    UPDATE public.leads 
    SET assigned_to = NULL, updated_at = now() 
    WHERE assigned_to = p_supervisor_id;

    -- Delete from auth.users (cascades to public.profiles)
    DELETE FROM auth.users WHERE id = p_supervisor_id;
    DELETE FROM public.profiles WHERE id = p_supervisor_id;

    RETURN jsonb_build_object('success', true);
END;
$$;
