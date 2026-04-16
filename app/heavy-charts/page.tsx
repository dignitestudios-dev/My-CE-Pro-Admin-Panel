'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
   date: string;
  users: number;
  courses: number;  
}

interface HeavyChartsPageProps {
  graph: ChartData[];
  loading: boolean;
}

export default function HeavyChartsPage({ graph, loading }: HeavyChartsPageProps) {
  console.log("chats", graph);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Loading charts...</p>
      </div>
    );
  }

  if (!graph || graph.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Trends</CardTitle>
          <CardDescription>Users, Posts & Circles over time</CardDescription>
        </CardHeader>
        <CardContent>
       <ResponsiveContainer width="95%" height={400}>
  <LineChart
    data={graph.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
      }), // 04/07 format
    }))}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip
      labelFormatter={(label) =>
        `Date: ${new Date(label).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}`
      }
    />
    <Legend />
    <Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" />
    <Line type="monotone" dataKey="courses" name="courses" stroke="#ef4444" />
    
  </LineChart>
</ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}