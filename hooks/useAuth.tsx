import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isMember: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    isMember: false,
    isAdmin: false,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSessionChange(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSessionChange(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSessionChange = (session: Session | null) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // Simple admin check: if email is owners or has special metadata
        // In a real app, this would check a 'roles' table or custom claims
        const isUserAdmin = currentUser?.email === 'ps.olkkari@gmail.com' || currentUser?.user_metadata?.role === 'admin';
        setIsAdmin(isUserAdmin);

        setLoading(false);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, isMember: !!user, isAdmin, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
