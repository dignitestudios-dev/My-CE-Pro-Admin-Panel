"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchDashboardStats } from "@/lib/slices/dashboardSlice";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);
  console.log(stats);
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <h2 className="text-sm text-gray-500">Total Users</h2>
        <p className="text-xl font-bold">{stats?.totalUsers || 0}</p>
      </Card>

     

      <Card className="p-4">
        <h2 className="text-sm text-gray-500">Total Themes</h2>
        <p className="text-xl font-bold">{stats?.totalThemes || 0}</p>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm text-gray-500">Total Courses</h2>
        <p className="text-xl font-bold">{stats?.totalCourses || 0}</p>
      </Card>

      
    </div>
  );
}