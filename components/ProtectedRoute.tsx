'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Cookies from 'js-cookie';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token=Cookies?.get("authToken");

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router])
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}