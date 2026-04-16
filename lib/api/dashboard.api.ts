// /lib/api/dashboard.api.ts
import { API } from "./axios";

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalThemes: number;
  graph: any;
}

export const getDashboardStats = async (dates?: { start: string; end: string }): Promise<DashboardStats> => {
  try {
    const response = await API.get("/admin/dashboard", {
      params: dates
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
  }
};

