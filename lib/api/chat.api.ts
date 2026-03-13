import { API } from "./axios";


export const getChatRooms = async (page = 1, limit = 10, search = "") => {
    try {
        const response = await API.get("/chat/admin", {
            params: {
                page,
                limit,
                search,
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch chat rooms");
    }
};
