// /lib/api/dashboard.api.ts
import { API } from "./axios";

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalThemes: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await API.get("/admin/dashboard");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
  }
};