// /lib/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStats, DashboardStats } from "../api/dashboard.api";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  graph: any;
  
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  graph: null,
};

// Async thunk
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (dates: { startDate: string; endDate: string } | undefined, { rejectWithValue }: any) => {
    try {
      // Convert dates format to match API expectation
      const apiDates = dates ? { start: dates.startDate, end: dates.endDate } : undefined;
      const data = await getDashboardStats(apiDates);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.graph = action.payload.graph;
       
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default dashboardSlice.reducer;