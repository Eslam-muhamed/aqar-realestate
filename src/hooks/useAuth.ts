import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { authStorage } from "@/lib/storage";
import type { User, UserRole, SupervisorPermissions } from "@/types";

const DEMO_USERS: (User & { password: string })[] = [
    {
        id: "admin-demo",
        name: "مدير المكتب (Admin)",
        email: "admin@aqar.com",
        password: "password123",
        role: "admin",
        is_active: true,
        permissions: {
            can_add_properties: true,
            can_edit_all_properties: true,
            can_delete_properties: true,
            can_claim_unassigned_leads: true,
        },
    },
    {
        id: "supervisor-1-demo",
        name: "أحمد منصور (مشرف مبيعات)",
        email: "ahmed@aqar.com",
        password: "password123",
        role: "supervisor",
        is_active: true,
        phone: "+20 100 123 4567",
        permissions: {
            can_add_properties: true,
            can_edit_all_properties: false,
            can_delete_properties: false,
            can_claim_unassigned_leads: true,
        },
    },
    {
        id: "supervisor-2-demo",
        name: "سارة كمال (مشرفة عقارات)",
        email: "sara@aqar.com",
        password: "password123",
        role: "supervisor",
        is_active: true,
        phone: "+20 101 987 6543",
        permissions: {
            can_add_properties: true,
            can_edit_all_properties: false,
            can_delete_properties: false,
            can_claim_unassigned_leads: false,
        },
    },
];

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => {
        const stored = authStorage.get();
        if (!import.meta.env.DEV && stored?.id?.endsWith("-demo")) {
            authStorage.clear();
            return null;
        }
        return stored;
    });
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (data && !error) {
                const userObj: User = {
                    id: data.id,
                    name: data.full_name || email.split("@")[0],
                    email: data.email,
                    role: data.role as UserRole,
                    avatar: data.avatar_url,
                    phone: data.phone,
                    permissions: data.permissions as SupervisorPermissions,
                    is_active: data.is_active,
                };
                setUser(userObj);
                authStorage.set(userObj);
                return userObj;
            }
        } catch (err) {
            console.warn("Supabase fetchUserProfile note:", err);
        }
        return null;
    };

    useEffect(() => {
        let mounted = true;

        // Check active session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email || "").finally(() => {
                    if (mounted) setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            if (session?.user) {
                await fetchUserProfile(session.user.id, session.user.email || "");
            } else {
                // In DEV mode only, preserve demo session if not using Supabase
                const currentLocal = authStorage.get();
                if (!import.meta.env.DEV || !currentLocal?.id?.endsWith("-demo")) {
                    setUser(null);
                    authStorage.clear();
                }
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
            setLoading(true);

            // 1. Try Supabase Auth first
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (!error && data?.user) {
                    const profile = await fetchUserProfile(data.user.id, data.user.email || email);
                    if (!profile) {
                        // If profile table doesn't have row yet, fallback to default role
                        const defaultUser: User = {
                            id: data.user.id,
                            name: data.user.user_metadata?.full_name || email.split("@")[0],
                            email: data.user.email || email,
                            role: (data.user.user_metadata?.role as UserRole) || "admin",
                        };
                        setUser(defaultUser);
                        authStorage.set(defaultUser);
                    }
                    setLoading(false);
                    return { success: true };
                }
            } catch (err) {
                console.warn("Supabase login error:", err);
            }

            // 2. In DEV mode only: Demo fallback accounts for local testing
            if (import.meta.env.DEV) {
                const demoMatch = DEMO_USERS.find(
                    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (demoMatch) {
                    const { password: _p, ...userData } = demoMatch;
                    authStorage.set(userData);
                    setUser(userData);
                    setLoading(false);
                    return { success: true };
                }
            }

            setLoading(false);
            return {
                success: false,
                error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
            };
        },
        []
    );

    const signup = useCallback(
        async (
            name: string,
            email: string,
            password: string,
            role: "admin" | "supervisor" = "supervisor"
        ): Promise<{ success: boolean; error?: string }> => {
            setLoading(true);

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            role: role,
                        },
                    },
                });

                if (error) {
                    // Fallback to local session
                    console.warn("Supabase signup note:", error.message);
                }

                const newUser: User = {
                    id: data?.user?.id || `user_${Date.now()}`,
                    name,
                    email,
                    role,
                    is_active: true,
                };
                authStorage.set(newUser);
                setUser(newUser);
                setLoading(false);
                return { success: true };
            } catch (err: any) {
                setLoading(false);
                return { success: false, error: err.message };
            }
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.warn("Supabase signOut error:", e);
        }
        authStorage.clear();
        setUser(null);
    }, []);

    return {
        user,
        role: user?.role || "user",
        isAdmin: user?.role === "admin",
        isSupervisor: user?.role === "supervisor",
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
    };
}
