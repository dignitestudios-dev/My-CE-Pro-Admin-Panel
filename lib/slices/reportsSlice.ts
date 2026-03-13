import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReportsCourses, getReportsUsers } from "../api/reports.api";

interface ReportUser {
  _id: string;
  fullName: string;
  username: string;
  emailAddress: string;
  profession: string;
  licenseNumber: string;
  licenseExpiry: string;
  accountStatus: boolean;
  lastActivity: string;
}

interface ReportCourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportState {
  users: ReportUser[];
  courses: ReportCourse[];
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  users: [],
  courses: [],
  totalUsers: 0,
  activeUsers: 0,
  deactivatedUsers: 0,
  loading: false,
  error: null,
};

// ---------------- USERS ----------------
export const fetchReportsUsers = createAsyncThunk(
  "report/fetchReportsUsers",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      accountStatus?: "all" | "active" | "deactivated";
      licenseExpired?: "all" | "true" | "false";
      startDate?: string;
      endDate?: string;
    } = {},
    thunkAPI
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        accountStatus = "all",
        licenseExpired = "all",
        startDate,
        endDate,
      } = params;

      const response = await getReportsUsers({
        page,
        limit,
        search,
        accountStatus,
        licenseExpired,
        startDate,
        endDate,
      });

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users reports"
      );
    }
  }
);

// ---------------- COURSES ----------------
export const fetchReportsCourses = createAsyncThunk(
  "report/fetchReportsCourses",
  async (
    params: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    } = {},
    thunkAPI
  ) => {
    try {
      const { page = 1, limit = 10, startDate, endDate } = params;

      const response = await getReportsCourses({
        page,
        limit,
        startDate,
        endDate,
      });

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses reports"
      );
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchReportsUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsUsers.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data;
        state.users = data?.users || [];
        state.totalUsers = data?.totalUsers || 0;
        state.activeUsers = data?.activeUsers || 0;
        state.deactivatedUsers = data?.deactivatedUsers || 0;
      })
      .addCase(fetchReportsUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Courses
      .addCase(fetchReportsCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsCourses.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data;
        state.courses = data?.courses || [];
      })
      .addCase(fetchReportsCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;