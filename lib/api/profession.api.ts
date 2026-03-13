import { API } from "./axios";

export const getProfessions = async (page = 1, limit = 10) => {
  try {
    const response = await API.get("/admin/professions", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch professions");
  }
};
