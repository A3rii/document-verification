import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthState,
  RegisterResponse,
  UserState,
  studentLogin,
} from "../../types/auth-type";
import Cookies from "js-cookie";
import authToken from "../../utils/authToken";

const initialState: AuthState = {
  currentUser: null,
  userToken: "",
  loading: false,
  error: null,
  success: false,
};

export const loginStudent = createAsyncThunk<RegisterResponse, studentLogin>(
  "auth/loginStudent",
  async (userData: studentLogin, thunkAPI) => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        userData
      );
      const { access_token, user } = response.data;
      Cookies.set("token", access_token, { expires: 7, secure: true });
      return { access_token, user };
    } catch (err) {
      const error = err as Error;

      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.errors || error.message
        );
      }

      return thunkAPI.rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Get Current User profile
export const studentProfile = createAsyncThunk<UserState>(
  "auth/studentProfile",
  async (_, thunkAPI) => {
    const token = authToken();
    try {
      const response = await axios.get<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Accept: `application/json`,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { user } = response.data;
      return user;
    } catch (err) {
      const error = err as Error;

      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.errors || error.message
        );
      }

      return thunkAPI.rejectWithValue(error.message || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.currentUser = null;

      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.userToken = action.payload.access_token;
        state.currentUser = action.payload.user || null;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    builder
      .addCase(studentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(studentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
