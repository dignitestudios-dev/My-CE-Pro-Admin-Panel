// chatApi.ts
import { API } from "./axios";



export const getChatRooms = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await API.get("/admin/chat", {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch chat rooms");
  }
};

export const getChatRoomMessages = async (roomId = "", page = 1, limit = 10, search = "") => {
  try {
    const response = await API.get(`/chat/messages/${roomId}`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch chat messages");
  }
};