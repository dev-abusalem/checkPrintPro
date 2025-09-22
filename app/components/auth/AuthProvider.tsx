'use client'
import { supabase } from '@/app/lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  loading: boolean;
  logout: () => void;
  loginDemo: () => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  loginDemo: () => {},
  isDemo: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error && type === 'recovery') {
          // redirect to reset password page
          router.push('/reset-password');
        }
      }

      // Always check existing session as fallback
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    handleRecovery();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);

        if (event === 'PASSWORD_RECOVERY') {
          router.push('/reset-password');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const loginDemo = () => {
    setUser({
      id: 'demo-user-1',
      email: 'demo@checkprint.app',
      name: 'Demo User',
      organization_id: 'demo-org-1',
      isDemo: true,
    }),
     router.push("/");
  }
  return (
    <AuthContext.Provider value={{ user, loading, logout,loginDemo , isDemo: user?.isDemo ?? false}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
