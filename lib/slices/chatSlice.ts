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
    listPagination: Pagination | null;
}

const initialState: ChatState = {
    chatRooms: [],
    messages: [],
    pagination: null,
    loading: false,
    error: null,
    listPagination: null,
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
        return response;
    }
);

export const getMessages = createAsyncThunk(
    "chat/messages",
    async ({ roomId, page = 1, limit = 1000, search = "" }: ChatFetchParams) => {
        const response = await getChatRoomMessages(roomId, page, limit, search);
        return response;
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const incoming = action.payload;
            if (!incoming?._id) return;
            const alreadyExists = state.messages.some(
                (m: any) => m._id === incoming._id
            );
            if (!alreadyExists) {
                state.messages = [...state.messages, incoming];
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        // ✅ Existing message update karo (delete/edit ke liye)
        updateMessage: (state, action) => {
            const updated = action.payload;
            if (!updated?._id) return;
            state.messages = state.messages.map((m: any) =>
                m._id === updated._id ? { ...m, ...updated } : m
            );
        },
        clearRoomMessages: (state, action) => {
            const roomId = action.payload;
            state.messages = state.messages.filter(
                (m: any) => m.chatRoom !== roomId
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.chatRooms = action.payload.data;
                state.listPagination = action.payload.pagination;
            })
            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch chat rooms";
            })

            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                const incoming: any[] = action.payload.data || [];

                // ✅ Sirf naye unique messages add karo
                const existingIds = new Set(state.messages.map((m: any) => m._id));
                const newOnly = incoming.filter((m: any) => !existingIds.has(m._id));
                state.messages = [...state.messages, ...newOnly];

                state.pagination = action.payload.pagination;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch messages";
            });
    },
});

export const { setMessages, addMessage, updateMessage, clearRoomMessages } = chatSlice.actions;
export default chatSlice.reducer;