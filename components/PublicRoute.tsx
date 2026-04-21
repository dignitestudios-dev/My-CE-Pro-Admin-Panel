'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Cookies from 'js-cookie';
interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const token = Cookies?.get("authToken");
  
  useEffect(() => {
    if ( token) {
      router.push('/dashboard');
      console.log('User is already logged in, redirecting to dashboard');
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return <>{children}</>;
}