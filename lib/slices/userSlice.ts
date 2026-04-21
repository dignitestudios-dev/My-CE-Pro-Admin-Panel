import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, getUserCourses, getUsers, postDeactivate, postReactivate } from "../api/user.api";

interface ApiUser {
  _id: string;                        // User ka unique ID
  fullName: string | null;            // User ka full name, null ho sakta hai
  username?: string;                  // Username, optional
  emailAddress: string;               // User ka email
  profession: string | null;          // Profession, null ho sakta hai
  licenseNumber: string | number | null; // License number, string ya number
  licenseExpiry: string | null;       // License expiry date, string format or null
  accountStatus: boolean;             // Active / Inactive
  lastActivity?: string;              // Last activity timestamp, optional
  totalCourses?: number;              // Total courses added, optional
  completedCourses?: number;          // Completed courses count, optional
  totalCEMinutes?: number;            // Total CE minutes, optional
  certificateUploadCount?: number;    // Certificates uploaded count, optional
  courses?: Course[]; 
  profilePicture?: string | null;          // User profile picture, optional
}

interface Course {
  _id: string;                         // Course ID
  name: string;                         // Course Name
  institute?: string | null;            // Institute / Organization, optional
  startDate?: string | null;            // Start Date, optional
  endDate?: string | null;              // End Date, optional
  certificate?: string | null;          // Certificate URL, optional
  minsRequired: number;                 // Required minutes
  completedMinutes: number;             // Completed minutes
  status: "pending" | "active" | "completed" | "inProgress"; // Status
  completionPercentage?: number;        // Completion %, optional
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
  userCourses: any;       // ✅ Courses for selected user
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
  userCourses: [],
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
  accountStatus?: "all" | "active" | "deactivated";
  licenseExpired?: "all" | "true" | "false";
  startDate?: string;
  endDate?: string;
}

// ✅ Async thunk for fetching users with filters
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: FetchUsersParams = {}, thunkAPI) => {
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

      const response = await getUsers({
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
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Async thunk for fetching single user by ID
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

// ✅ Async thunk for fetching user courses
export const fetchUserCourses = createAsyncThunk(
  "users/fetchUserCourses",
  async (id: string, thunkAPI) => {
    try {
      const response = await getUserCourses(id);
      
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deactivateUser = createAsyncThunk(
  "users/deactivateUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await postDeactivate(id);
      return { id, data: response };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to deactivate user"
      );
    }
  }
);

export const reactivateUser = createAsyncThunk(
  "users/reactivateUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await postReactivate(id);
      return { id, data: response };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reactivate user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Fetch multiple users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;

      const usersData = action.payload?.data?.users || [];
      const totalUsers = action.payload?.data?.totalUsers || 0;
      const activeUsers = action.payload?.data?.activateUsers || 0;
      const deactivatedUsers = action.payload?.data?.deactivatedUsers || 0;
      const pagination = action.payload?.pagination || null;
      console.log(deactivatedUsers);
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

    // ✅ Fetch single user
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

    // ✅ Fetch user courses
    builder.addCase(fetchUserCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.userCourses = [];
    });
    builder.addCase(fetchUserCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.userCourses = action.payload?.course || [];

      console.log("action.payload", action.payload?.course);
    });
    builder.addCase(fetchUserCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.userCourses = [];
    });
    builder.addCase(deactivateUser.pending, (state) => {
  state.loading = true;
  state.error = null;
});

builder.addCase(deactivateUser.fulfilled, (state, action) => {
  state.loading = false;

  const userId = action.payload.id;

  // ✅ list update
  state.users = state.users.map((user) =>
    user._id === userId ? { ...user, accountStatus: false } : user
  );

  // ✅ detail update
  if (state.userDetail && state.userDetail._id === userId) {
    state.userDetail.accountStatus = false;
  }
});

builder.addCase(deactivateUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});


// 🔥 Reactivate

builder.addCase(reactivateUser.pending, (state) => {
  state.loading = true;
  state.error = null;
});

builder.addCase(reactivateUser.fulfilled, (state, action) => {
  state.loading = false;

  const userId = action.payload.id;

  state.users = state.users.map((user) =>
    user._id === userId ? { ...user, accountStatus: true } : user
  );

  if (state.userDetail && state.userDetail._id === userId) {
    state.userDetail.accountStatus = true;
  }
});

builder.addCase(reactivateUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});
  },
});



export default userSlice.reducer;