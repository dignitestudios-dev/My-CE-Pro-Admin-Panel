import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, getUsers } from "../api/user.api";

interface ApiUser {
  _id: string;
  fullName: string | null;
  emailAddress: string;
  profession: string | null;
  licenseNumber: string | number | null;
  licenseExpiry: string | null;
  accountStatus: boolean;
  lastActivity?: string;
}

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

interface UserState {
  users: ApiUser[];
  userDetail: ApiUser | null;
  pagination: Pagination | null;
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
userDetail: null,
  pagination: null,
  totalUsers: 0,
  activeUsers: 0,
  deactivatedUsers: 0,
  loading: false,
  error: null,
};
interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: "" | "active" | "deactivated";
}
export const    fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: FetchUsersParams = {}, thunkAPI) => {
    try {
      const { page = 1, limit = 10, search = "", accountStatus = "" } = params;

      const response = await getUsers(page, limit, search, accountStatus);

      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, thunkAPI) => {
    try {
      const response = await getUserById(id);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;

      // Destructure API response properly
      const usersData = action.payload?.data?.users || [];
      const totalUsers = action.payload?.data?.totalUsers || 0;
      const pagination = action.payload?.pagination || null;
      const activeUsers = action.payload?.data?.activateUsers;
      const deactivatedUsers = action.payload?.data?.deactivateUsers||0;

      state.users = usersData;
      state.totalUsers = totalUsers;
      state.activeUsers = activeUsers;
      state.deactivatedUsers = deactivatedUsers;

      state.pagination = pagination;
  
    });

    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


     // Fetch Single User by ID
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.userDetail = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.userDetail = action.payload?.data || null;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.userDetail = null;
    });
  },
});

export default userSlice.reducer;