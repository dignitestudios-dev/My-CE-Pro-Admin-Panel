import { API } from "./axios"; 


export const getNotification = async (page = 1, limit = 10, search = "") => {
    try {
        const response = await API.get("/admin/notifications", {
            params: {
                page,
                limit,
                search,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
};


export const createNotification = async (data: any) => {
    try {
        const response = await API.post("/admin/notifications", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create notification");
    }
};
