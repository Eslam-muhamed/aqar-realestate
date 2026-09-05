import { useState, useCallback } from "react";
import { authStorage } from "@/lib/storage";
import type { User } from "@/types";

const MOCK_USERS = [
    { id: "u1", name: "Omar Al-Farsi", email: "omar@example.com", password: "password123", role: "user" as const },
    { id: "a1", name: "Khalid Al-Rashidi", email: "khalid@aqar.com", password: "agent123", role: "agent" as const },
    { id: "admin1", name: "Aqar Admin", email: "admin@aqar.com", password: "admin123", role: "admin" as const },
];

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => authStorage.get());

    const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
        const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
        if (!found) return { success: false, error: "Invalid credentials." };
        const { password: _p, ...userData } = found;
        authStorage.set(userData);
        setUser(userData);
        return { success: true };
    }, []);

    const signup = useCallback((name: string, email: string, _password: string): { success: boolean; error?: string } => {
        const exists = MOCK_USERS.find((u) => u.email === email);
        if (exists) return { success: false, error: "Email already registered." };
        const newUser = { id: `u${Date.now()}`, name, email, role: "user" as const };
        authStorage.set(newUser);
        setUser(newUser);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        authStorage.clear();
        setUser(null);
    }, []);

    return { user, login, signup, logout, isAuthenticated: !!user };
}
