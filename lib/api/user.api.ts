import { API } from "./axios";

export const getUsers = async (page = 1, limit = 10, search = "", accountStatus?: "" | "active" | "deactivated") => {
  try {
    const response = await API.get("/admin/users", {
      params: {
        page,
        limit,
        search,
        accountStatus,
      },
      
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};


export const getUserById = async (id: string) => {
  try {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};