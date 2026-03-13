import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChatRooms } from "../api/chat.api";

interface Pagination {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

interface ChatState {
    chatRooms: Notification[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chatRooms: [],
    pagination: null,
    loading: false,
    error: null,
};

interface ChatFetchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const fetchChatRooms = createAsyncThunk(
    "admin/chat",
    async ({ page = 1, limit = 10, search = "" }: ChatFetchParams) => {
        const response = await getChatRooms(page, limit, search);
        console.log(response)
        return response;

    }
);


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchChatRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                // API response structure
                state.loading = false;
                state.chatRooms = action.payload.data;
                state.pagination = action.payload.pagination;
            })

            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch chat rooms";
            });

    },
});

export default chatSlice.reducer;