"use client"

import { useState, useEffect } from 'react'
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import { useContext } from 'react';
import UserDetailContext from '@/context/UserDetailContext';
import { useRouter, usePathname } from 'next/navigation';


function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        CreateNewUser();
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }

    useEffect(() => {
        // Handle redirection after user state is updated or when pathname changes
        if (user) {
            // If logged in and on /auth or /, go to dashboard
            if (pathname === '/auth' || pathname === '/') {
                router.replace('/dashboard');
            }
        } else if (!user && pathname !== '/auth') {
            // If NOT logged in and trying to access any page other than /auth, go to auth
            const checkAuth = async () => {
                if (!supabase) return;
                const { data } = await supabase.auth.getUser();
                if (!data?.user) {
                    router.replace('/auth');
                }
            };
            checkAuth();
        }
    }, [user, pathname]);

    // Build a safe row so we don't insert nulls when metadata keys differ by provider
    const mapAuthUserToRow = (authUser) => {
        if (!authUser) return { name: null, email: null, picture: null };

        const name =
            authUser.user_metadata?.name ||
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.user_name ||
            authUser.user_metadata?.nickname ||
            authUser.email?.split("@")[0] ||
            null;

        const picture =
            authUser.user_metadata?.picture ||
            authUser.user_metadata?.avatar_url ||
            authUser.user_metadata?.avatar ||
            null;

        return {
            name,
            email: authUser.email ?? null,
            picture,
        };
        console.log(name);

    };

    const CreateNewUser = async () => {
        if (!supabase) return;
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error("Auth error:", authError);
            return;
        }

        const authUser = authData?.user;
        if (!authUser) {
            console.warn("No authenticated user");
            return;
        }

        const userRow = mapAuthUserToRow(authUser);

        if (!supabase) return;
        const { data: Users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', userRow.email);

        if (error) {
            console.error("Select Users error:", error);
            return;
        }

        if (Users?.length === 0) {
            console.log('Creating New User');
            if (!supabase) return;
            const { data, error: insertError } = await supabase.from('Users')
                .insert([userRow])
                .select()
                .single();

            if (insertError) {
                console.error("Insert user error:", insertError);
                return;
            }

            console.log("New user created and set:", data);
            setUser(data);
            return;
        }

        console.log("Existing user fetched and set:", Users[0]);
        setUser(Users[0]);
    }

    return (
        <UserDetailContext.Provider value={{ user, setUser, theme, toggleTheme }}>
            <div>{children}</div>
        </UserDetailContext.Provider>

    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}