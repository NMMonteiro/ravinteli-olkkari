import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isMember: boolean;
    isAdmin: boolean;
    isApproved: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isMember: false,
    isAdmin: false,
    isApproved: false,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

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

    const fetchProfileData = async (userId: string, userMetadata?: any) => {
        try {
            // Level 1: Optimistic Identity (Single Source of Truth: The User's JWT)
            if (userMetadata?.role === 'admin') {
                setIsAdmin(true);
                setIsApproved(true);
            } else if (userMetadata?.is_approved) {
                setIsApproved(true);
            }

            // Level 2: Registry Verification (Final Authority)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
                setIsAdmin(data.role === 'admin');
                setIsApproved(data.is_approved);
                return data;
            }
        } catch (err) {
            console.error('Deep Identity Sync Failure:', err);
        }
        return null;
    };

    const handleSessionChange = async (session: Session | null) => {
        const currentUser = session?.user ?? null;

        if (currentUser) {
            // 1. Initial Identity Set
            setUser(currentUser);
            setSession(session);

            // 2. Perform deep sync (Metadata + Registry)
            await fetchProfileData(currentUser.id, currentUser.user_metadata);
        } else {
            setUser(null);
            setSession(null);
            setProfile(null);
            setIsAdmin(false);
            setIsApproved(false);
        }

        // 3. Finalize state only after deep sync
        setLoading(false);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setIsApproved(false);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfileData(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{
            session,
            user,
            profile,
            loading,
            isMember: !!user,
            isAdmin,
            isApproved,
            signOut,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
