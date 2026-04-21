"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RootState } from "@/lib/store";
import { checkAuthStatus } from "@/lib/slices/authSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000); // Redirect after 2 seconds

      return () => clearTimeout(timer);
    } else {
      // If not authenticated, redirect to login
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Check token validity on initial load
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-gray-700 mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-lg text-gray-700 mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
