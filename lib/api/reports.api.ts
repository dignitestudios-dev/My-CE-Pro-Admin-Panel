import { API } from "./axios";

// ---------------- Users Reports ----------------
interface GetReportsUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: "all" | "active" | "deactivated";
  licenseExpired?: "all" | "true" | "false";
  startDate?: string;
  endDate?: string;
}

export const getReportsUsers = async (params: GetReportsUsersParams = {}) => {
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

    const response = await API.get("/admin/reports/users", {
      params: {
        page,
        limit,
        search,
        accountStatus,
        licenseExpired,
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users reports");
  }
};

// ---------------- Courses Reports ----------------
interface GetReportsCoursesParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const getReportsCourses = async (params: GetReportsCoursesParams = {}) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = params;

    const response = await API.get("/admin/reports/courses", {
      params: {
        page,
        limit,
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch courses reports");
  }
};

// User reports
export const downloadUsersExcel = async (params?: any) => {
  const response = await API.get("/admin/reports/users/export/excel", {
    params,
    responseType: "blob", // important
  });
  return response.data;
};

export const downloadUsersCSV = async (params?: any) => {
  const response = await API.get("/admin/reports/users/export/csv", {
    params,
    responseType: "blob",
  });
  return response.data;
};

// Course reports
export const downloadCoursesExcel = async (params?: any) => {
  const response = await API.get("/admin/reports/course/export/excel", {
    params,
    responseType: "blob",
  });
  return response.data;
};

export const downloadCoursesCSV = async (params?: any) => {
  const response = await API.get("/admin/reports/course/export/csv", {
    params,
    responseType: "blob",
  });
  return response.data;
};