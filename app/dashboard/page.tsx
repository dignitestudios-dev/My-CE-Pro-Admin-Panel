"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchDashboardStats } from "@/lib/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/lib/store";
import HeavyChartsPage from "../heavy-charts/page";
import { BookOpen, Palette, Users } from "lucide-react";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  console.log("stats", stats);
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // if (loading) return <div className="flex items-center justify-center min-h-[200px]"><LoadingSpinner size="lg" /></div>;
  // if (error) return <div className="p-4 text-red-500">{error} heloooooooooooooo </div>;

  return (
    <div>
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm text-gray-500">Total Users</h2>
         <Users className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-xl font-bold">{stats?.totalUsers || 0}</p>
      </Card>

     

      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm text-gray-500">Total Themes</h2>
       <Palette className="w-8 h-8 text-purple-500" />
        </div>
        <p className="text-xl font-bold">{stats?.totalThemes || 0}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm text-gray-500">Total Courses</h2>
        <BookOpen className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-xl font-bold">{stats?.totalCourses || 0}</p>
      </Card>

      
    </div>

    <HeavyChartsPage />
    </div>
  );
}