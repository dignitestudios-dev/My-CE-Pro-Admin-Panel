import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfessions } from "../api/profession.api";

interface Profession {
  _id: string;
  name: string;
  ceHours: string;
}

interface ProfessionState {
  professions: Profession[];
  pagination: any;
  loading: boolean;
  error: string | null;
}

const initialState: ProfessionState = {
  professions: [],
  pagination: null,
  loading: false,
  error: null,
};
interface FetchProfessionsParams {
  page?: number;
  limit?: number;
 
}

// Fetch professions
export const fetchProfessions = createAsyncThunk(
  "profession/fetchProfessions",
  async (params: FetchProfessionsParams = {}, thunkAPI) => {
    try {
      const { page = 1, limit = 10 } = params;

      const response = await getProfessions({
        page,
        limit,
      });

      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
const professionSlice = createSlice({
  name: "profession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfessions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

   builder.addCase(fetchProfessions.fulfilled, (state, action) => {
  state.loading = false;

  state.professions = action.payload?.data || [];

  // ✅ IMPORTANT FIX
  state.pagination = action.payload?.pagination || {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  };
});

    builder.addCase(fetchProfessions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default professionSlice.reducer;