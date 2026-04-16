// lib/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginAPI, forgotPassword as forgotPasswordAPI, verifyOTP as verifyOTPAPI , updatePassword as updatePasswordAPI } from '../api/auth.api'; // tumhara API file
import Cookies from 'js-cookie';

// ------------------ Types ------------------
export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  email: string | null;
}

// ------------------ Helper Functions ------------------
// Check if token exists and is valid
export const validateToken = (): boolean => {
  const token = Cookies.get('authToken');
  if (!token) {
    return false;
  }
  
  try {
    // Basic JWT token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      // Token expired, remove it
      Cookies.remove('authToken');
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, remove it
    Cookies.remove('authToken');
    return false;
  }
};

// ------------------ Initial State ------------------
const initialState: AuthState = {
  user: null,
  isAuthenticated: validateToken(),
  loading: false,
  error: null,
  email: null,
};

// ------------------ Async Thunks ------------------

// Login user
export const loginUser  = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const data = await loginAPI(credentials); // API call
      console.log(data,"data-messages")
      return data?.data?.admin; // API se user info return
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (credentials, thunkAPI) => {
    try {
      const data = await forgotPasswordAPI(credentials.email);
      return data;
    } catch (err: any) {
      console.log(err, "errooor-");

      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk<void, { otp: any; email: string }>(
  'auth/verifyOTP',
  async (credentials, thunkAPI) => {
    try {
      await verifyOTPAPI(credentials.otp, credentials.email);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to verify OTP');
    }
  }
);
 
export const updatePassword = createAsyncThunk<void, { password: string }>(
  'auth/updatePassword',
  async (credentials, thunkAPI) => {
    try {
      await updatePasswordAPI(credentials.password);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update password');
    }
  }
);

// Token validation thunk
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    const isValid = validateToken();
    if (!isValid) {
      return thunkAPI.rejectWithValue('Token expired or invalid');
    }
    return true;
  }
);

// ------------------ Slice ------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
    reducers: {
    logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            Cookies.remove("authToken");
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
     state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Forgot password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      
      state.error = action.payload as string;
    });

// update password 
builder.addCase (updatePassword.pending, (state) => {
  state.loading = true;
  state.error = null;
});

builder.addCase (updatePassword.fulfilled, (state) => {
  state.loading = false;
});

builder.addCase (updatePassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

// Check auth status
builder.addCase(checkAuthStatus.pending, (state) => {
  state.loading = true;
});

builder.addCase(checkAuthStatus.fulfilled, (state) => {
  state.loading = false;
  // Token is valid, keep current state
});

builder.addCase(checkAuthStatus.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = action.payload as string;
  Cookies.remove('authToken');
});

  },
});



// ------------------ Exports ------------------
export const { logout, setEmail } = authSlice.actions;
export default authSlice.reducer;