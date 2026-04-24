"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchDashboardStats } from "@/lib/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/lib/store";
import HeavyChartsPage from "../heavy-charts/page";
import { BookOpen, Palette, Users } from "lucide-react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error, graph } = useSelector((state: RootState) => state.dashboard);
  const defaultDates = (() => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 7);
    const format = (date: Date) => date.toISOString().split("T")[0];
    return { start: format(past), end: format(today) };
  })();

  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  console.log("graph", graph);
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch, ]);

  // if (loading) return <div className="flex items-center justify-center min-h-[200px]"><LoadingSpinner size="lg" /></div>;
  // if (error) return <div className="p-4 text-red-500">{error} heloooooooooooooo </div>;
  const handleFilter = () => {
    if (!startDate || !endDate) return;

    dispatch(
      fetchDashboardStats({
        startDate: startDate,
        endDate: endDate,
      })
    );
  };
  const router = useRouter();

  return (
    <div>
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
     <Card
  className="p-4 cursor-pointer hover:shadow-md transition"
  onClick={() => router.push("/dashboard/users")}
>
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
 {/* <div className="mb-4 flex flex-wrap items-end justify-end gap-3 rounded-xl border p-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Start Date</label>
          <input
            type="date"
            value={startDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">End Date</label>
          <input
            type="date"
            value={endDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleFilter}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Apply
        </button>
      </div> */}
    <HeavyChartsPage graph={graph}  loading={loading}/>
    </div>
  );
}