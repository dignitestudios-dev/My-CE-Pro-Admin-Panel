import { API } from "./axios";
export const getProfessions = async (params: any = {}) => {
  try {
    const { page = 1, limit = 10 } = params;

    const response = await API.get("/admin/professions", {
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch professions"
    );
  }
};