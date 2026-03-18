import { API } from "./axios";

// ---------------- Users ----------------
interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: "all" | "active" | "deactivated";
  licenseExpired?: "all" | "true" | "false";
  startDate?: string;
  endDate?: string;
}

export const getUsers = async (params: GetUsersParams = {}) => {
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

    // Build params object to send to backend
    const queryParams: Record<string, any> = {
      page,
      limit,
      search,
    };

    if (accountStatus !== "all") queryParams.accountStatus = accountStatus;
    if (licenseExpired !== "all") queryParams.licenseExpired = licenseExpired;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await API.get("/admin/users", { params: queryParams });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};


// Get single user by ID
export const getUserById = async (id: string) => {
  try {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

export const getUserCourses = async (id: string) => {
  try {
    const response = await API.get(`/admin/courses/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user courses");
  }
};

export const postDeactivate = async (id: string) => {
  try {
    const response = await API.post(`/admin/users/${id}/deactivate`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to deactivate user");
  }
};

export const postReactivate = async (id: string) => {
  try {
    const response = await API.post(`/admin/users/${id}/reactive`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to deactivate user");
  }
};