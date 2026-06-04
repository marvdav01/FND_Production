import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { logoutAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'crew';
  avatar?: string;
  avatar_url?: string;
  phone?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetchAPI('/auth/profile');
        if (res.success) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  const logout = async () => {
    try {
      await logoutAction();
      localStorage.removeItem('token');
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.push('/');
    }
  };

  return { user, loading, error, logout, setUser };
}
