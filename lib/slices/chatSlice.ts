import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChatRoomMessages, getChatRooms } from "../api/chat.api";

interface Pagination {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

interface ChatState {
    chatRooms: any[];
    messages: any[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chatRooms: [],
    messages: [],
    pagination: null,
    loading: false,
    error: null,
};

interface ChatFetchParams {
    roomId?: any;
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
export const getMessages = createAsyncThunk(
    "chat/messages",
    async ({ roomId, page = 1, limit = 10, search = "" }: ChatFetchParams) => {
        const response = await getChatRoomMessages(roomId, page, limit, search);
        console.log(response)
        return response;

    }
);


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        addMessage: (state, action) => {
            if (!state.messages) {
                state.messages = [action.payload];
            } else {
                state.messages = [...state.messages, action.payload];
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
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
            })
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMessages.fulfilled, (state, action) => {
                // API response structure
                state.loading = false;
                state.messages = action.payload.data;
                state.pagination = action.payload.pagination;
            })

            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch chat rooms";
            });

    },
});
export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;